import os
import sys
import json
import csv
from datetime import datetime
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import Base
import models
import security
import seed
from commission_engine import process_deposit_commissions
from cycle_engine import run_monthly_cycle
from reference_calculator import IndependentReferenceCalculator

AUDIT_DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "audit_verify.db"))
AUDIT_DB_URL = f"sqlite:///{AUDIT_DB_PATH}"

def run_independent_verification():
    print("=" * 80)
    print("ROYAL BULL CAPITAL — INDEPENDENT CALCULATION & LEDGER VERIFICATION")
    print("=" * 80)

    # 1. Clean setup in isolated audit database
    if os.path.exists(AUDIT_DB_PATH):
        try:
            os.remove(AUDIT_DB_PATH)
        except Exception:
            pass

    engine = create_engine(AUDIT_DB_URL, connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = Session()

    # Seed clean baseline
    seed.reset_and_seed_production_data(db)

    # Initialize independent reference oracle
    oracle = IndependentReferenceCalculator(
        direct_bonus_rate=Decimal("5.0"),
        level_rates=[
            Decimal("20.0"), Decimal("15.0"), Decimal("10.0"),
            Decimal("8.0"), Decimal("7.0"), Decimal("6.0"),
            Decimal("5.0"), Decimal("4.0"), Decimal("3.0"), Decimal("2.0")
        ],
        monthly_roi_rate=Decimal("5.0"),
        monthly_principal_rate=Decimal("5.0")
    )

    oracle.add_user("usr_admin", "Royal Bull Admin", "admin@royalbull.com", None)

    # Helper to add users
    def add_u(u_id, name, email, ref_code, parent_id):
        u = models.User(
            id=u_id, name=name, email=email,
            password_hash=security.hash_password("Pass123!"),
            role="customer", referral_code=ref_code,
            referrer_id=parent_id, status="active", is_verified=True,
            created_at=datetime(2026, 10, 1)
        )
        db.add(u)
        db.flush()
        db.add(models.Wallet(user_id=u_id))
        db.flush()
        oracle.add_user(u_id, name, email, parent_id)
        return u

    # Build 10-level hierarchy
    # L1: Qualified Leader
    add_u("usr_l1_lead", "Leader One", "lead1@test.com", "L1LEAD", "usr_admin")
    # L1: Unqualified Leader (0 funded directs)
    add_u("usr_l1_unq", "Unqualified Leader", "unq1@test.com", "L1UNQ", "usr_admin")

    # Qualifiers for L1_lead
    add_u("usr_q1", "Qualifier 1", "q1@test.com", "Q1", "usr_l1_lead")
    add_u("usr_q2", "Qualifier 2", "q2@test.com", "Q2", "usr_l1_lead")

    # 10 descendants in a chain under L1_lead
    chain_nodes = ["usr_l1_lead"]
    for i in range(1, 11):
        cid = f"usr_chain_l{i}"
        add_u(cid, f"Chain Node L{i}", f"chain{i}@test.com", f"CHN{i}", chain_nodes[-1])
        # Add 2 side qualifiers so intermediate ancestors meet qualification (>= 2 funded directs)
        add_u(f"usr_side_{i}_a", f"Side {i}A", f"s{i}a@test.com", f"S{i}A", cid)
        add_u(f"usr_side_{i}_b", f"Side {i}B", f"s{i}b@test.com", f"S{i}B", cid)
        chain_nodes.append(cid)

    # Child of unqualified leader
    add_u("usr_child_unq", "Child of Unqualified", "child_unq@test.com", "CUNQ", "usr_l1_unq")

    db.commit()

    # Helper for deposits
    def deposit(dep_id, u_id, amt_cents, status="confirmed", day=1):
        d = models.Deposit(
            id=dep_id, user_id=u_id, amount_cents=amt_cents, status=status,
            idempotency_key=f"idem_{dep_id}",
            created_at=datetime(2026, 10, day),
            confirmed_at=datetime(2026, 10, day) if status == "confirmed" else None
        )
        db.add(d)
        db.flush()
        if status == "confirmed":
            w = db.query(models.Wallet).filter(models.Wallet.user_id == u_id).first()
            w.original_principal_cents += amt_cents
            process_deposit_commissions(db, d)
        oracle.process_deposit(dep_id, u_id, amt_cents, status=status)
        db.commit()

    # Execute simulation events across the month:
    # Day 1: Qualifiers fund $1,000 each
    deposit("dep_q1", "usr_q1", 100000, day=1)
    deposit("dep_q2", "usr_q2", 100000, day=1)

    # Day 5: Side qualifiers fund $100 each
    for i in range(1, 11):
        deposit(f"dep_s_{i}_a", f"usr_side_{i}_a", 10000, day=5)
        deposit(f"dep_s_{i}_b", f"usr_side_{i}_b", 10000, day=5)

    # Day 15: Deepest child (L10) funds $10,000 (10 levels deep)
    deposit("dep_l10_deep", "usr_chain_l10", 1000000, day=15)

    # Day 20: Child of unqualified funds $500
    deposit("dep_child_unq", "usr_child_unq", 50000, day=20)

    # Day 25: Pending deposit ($2,000)
    deposit("dep_pending", "usr_chain_l5", 200000, status="pending", day=25)

    # Day 28: Failed deposit ($3,000)
    deposit("dep_failed", "usr_chain_l3", 300000, status="failed", day=28)

    # Execute Month 2026-10 Cycle
    month_key = "2026-10"
    cycle_run_1 = run_monthly_cycle(db, admin_id="usr_admin", specific_month=month_key)
    oracle.process_monthly_cycle(month_key)

    # Capture state before second run (Idempotency Audit)
    ledger_count_before = db.query(models.LedgerEntry).count()
    cycle_entries_before = db.query(models.MonthlyCycleEntry).count()
    wallets_before = {w.user_id: w.total_balance_cents for w in db.query(models.Wallet).all()}

    # Re-run the exact same cycle
    cycle_run_2 = run_monthly_cycle(db, admin_id="usr_admin", specific_month=month_key)
    db.refresh(cycle_run_2)

    ledger_count_after = db.query(models.LedgerEntry).count()
    cycle_entries_after = db.query(models.MonthlyCycleEntry).count()
    wallets_after = {w.user_id: w.total_balance_cents for w in db.query(models.Wallet).all()}

    # Idempotency assertions
    idempotency_passed = (
        ledger_count_before == ledger_count_after and
        cycle_entries_before == cycle_entries_after and
        wallets_before == wallets_after
    )

    # Ledger Analysis (Single-entry vs Double-entry)
    ledgers = db.query(models.LedgerEntry).all()
    total_credits = sum(l.amount_cents for l in ledgers if l.amount_cents > 0)
    total_debits = sum(abs(l.amount_cents) for l in ledgers if l.amount_cents < 0)

    # Build Reconciliation Table
    reconciliation_rows = []
    reconciliation_csv_rows = [
        [
            "Account ID", "User Name", "Starting Balance ($)", "Eligible Rate",
            "Expected Return ($)", "Actual Return ($)",
            "Expected Commissions ($)", "Actual Commissions ($)",
            "Expected Ending Balance ($)", "Actual Ending Balance ($)",
            "Difference ($)", "Status"
        ]
    ]

    all_matched = True
    for uid, ref_wallet in oracle.wallets.items():
        if uid == "usr_admin":
            continue
        db_w = db.query(models.Wallet).filter(models.Wallet.user_id == uid).first()
        exp_return = sum(r.roi_cents for r in oracle.month_returns if r.user_id == uid) / 100.0
        act_return = db_w.roi_balance_cents / 100.0
        exp_comm = (ref_wallet.direct_bonus_cents + ref_wallet.level_commission_cents) / 100.0
        act_comm = (db_w.direct_bonus_cents + db_w.level_commission_cents) / 100.0
        exp_bal = ref_wallet.total_balance_cents / 100.0
        act_bal = db_w.total_balance_cents / 100.0
        diff = round(act_bal - exp_bal, 2)

        matched = (diff == 0.0) and (exp_return == act_return) and (exp_comm == act_comm)
        if not matched:
            all_matched = False

        status_str = "PASS" if matched else "FAIL"
        u_name = oracle.users[uid].name

        row = {
            "account_id": uid,
            "user_name": u_name,
            "starting_balance_usd": 0.0,
            "eligible_rate": "5% ROI + 5% Prn + 85% Cascade",
            "expected_return_usd": exp_return,
            "actual_return_usd": act_return,
            "expected_commissions_usd": exp_comm,
            "actual_commissions_usd": act_comm,
            "expected_ending_balance_usd": exp_bal,
            "actual_ending_balance_usd": act_bal,
            "difference_usd": diff,
            "status": status_str
        }
        reconciliation_rows.append(row)
        reconciliation_csv_rows.append([
            uid, u_name, "0.00", "5% ROI + 5% Prn + 85% Cascade",
            f"{exp_return:.2f}", f"{act_return:.2f}",
            f"{exp_comm:.2f}", f"{act_comm:.2f}",
            f"{exp_bal:.2f}", f"{act_bal:.2f}",
            f"{diff:.2f}", status_str
        ])

    # Save CSV artifact
    artifacts_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "scratch"))
    os.makedirs(artifacts_dir, exist_ok=True)
    csv_path = os.path.join(artifacts_dir, "independent_reconciliation.csv")
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(reconciliation_csv_rows)

    summary = {
        "simulation_start_date": "2026-10-01T00:00:00Z",
        "simulation_end_date": "2026-10-31T23:59:59Z",
        "month_key": month_key,
        "database_used": AUDIT_DB_PATH,
        "total_users_evaluated": len(reconciliation_rows),
        "all_calculations_matched_oracle": all_matched,
        "idempotency_verified": idempotency_passed,
        "ledger_entries_before_rerun": ledger_count_before,
        "ledger_entries_after_rerun": ledger_count_after,
        "duplicate_entries_created": ledger_count_after - ledger_count_before,
        "total_ledger_credits_cents": total_credits,
        "total_ledger_debits_cents": total_debits,
        "ledger_accounting_type": "SINGLE_ENTRY_STATEMENT_LEDGER",
        "double_entry_balanced": False,  # Explaining why: no system treasury counter-debits
        "csv_artifact_path": csv_path
    }

    print("\n--- AUDIT SUMMARY RESULTS ---")
    print(json.dumps(summary, indent=2))
    return summary, reconciliation_rows

if __name__ == "__main__":
    run_independent_verification()
