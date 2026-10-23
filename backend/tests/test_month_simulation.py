import os
import sys
import json
import pytest
from decimal import Decimal
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.dirname(__file__))

from database import Base, get_db
import models
import security
import seed
from commission_engine import process_deposit_commissions
from cycle_engine import run_monthly_cycle
from reference_calculator import IndependentReferenceCalculator

SIM_DB_URL = "sqlite:///./test_sim_royal_bull.db"
sim_engine = create_engine(SIM_DB_URL, connect_args={"check_same_thread": False})
SimSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sim_engine)

from main import app

def override_sim_get_db():
    db = SimSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module")
def sim_db():
    app.dependency_overrides[get_db] = override_sim_get_db
    Base.metadata.drop_all(bind=sim_engine)
    Base.metadata.create_all(bind=sim_engine)
    db = SimSessionLocal()
    seed.reset_and_seed_production_data(db)
    yield db
    db.close()
    app.dependency_overrides.pop(get_db, None)
    sim_engine.dispose()
    try:
        if os.path.exists("test_sim_royal_bull.db"):
            os.remove("test_sim_royal_bull.db")
    except Exception:
        pass

@pytest.fixture(scope="module")
def sim_client():
    return TestClient(app)

class TestOneMonthCalculationAndReferralAudit:
    """
    Phases 3, 4, 5, 6, 9:
    1-Month Simulation, Multi-Tier Referral Network, Idempotency, and Independent Reconciliation
    """

    def test_complete_month_simulation_and_reconciliation(self, sim_db, sim_client):
        # 1. Setup Independent Reference Engine
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

        # 2. Build multi-branch, 10-level hierarchy in isolated database
        # Root is usr_admin (ROYALADMIN)
        oracle.add_user("usr_admin", "Royal Bull Admin", "admin@royalbull.com", None)

        # Level 1 users under admin:
        # User 1: Qualified Root Leader (will have 2 funded direct referrals)
        # User 2: Unqualified Root Member (0 funded directs)
        users_created = {}

        def create_user(u_id: str, name: str, email: str, ref_code: str, parent_id: str | None):
            u = models.User(
                id=u_id,
                name=name,
                email=email,
                password_hash=security.hash_password("Password123!"),
                role="customer",
                referral_code=ref_code,
                referrer_id=parent_id,
                status="active",
                is_verified=True,
                created_at=datetime(2026, 10, 1)
            )
            sim_db.add(u)
            sim_db.flush()
            w = models.Wallet(user_id=u_id)
            sim_db.add(w)
            sim_db.flush()
            users_created[u_id] = u
            oracle.add_user(u_id, name, email, parent_id)
            return u

        # Level 1 Leader (L1_Lead)
        create_user("usr_l1_lead", "Leader One", "l1_lead@test.com", "L1LEAD", "usr_admin")
        # Level 1 Unqualified (L1_Unqual)
        create_user("usr_l1_unq", "Unqualified One", "l1_unq@test.com", "L1UNQ", "usr_admin")

        # Two direct referrals under L1_Lead to qualify L1_Lead:
        create_user("usr_q1", "Qualifier One", "q1@test.com", "Q1CODE", "usr_l1_lead")
        create_user("usr_q2", "Qualifier Two", "q2@test.com", "Q2CODE", "usr_l1_lead")

        # Now build a 10-tier linear chain under L1_Lead:
        # L1_Lead (lvl 0) -> Tier 1 -> Tier 2 -> Tier 3 -> Tier 4 -> Tier 5 -> Tier 6 -> Tier 7 -> Tier 8 -> Tier 9 -> Tier 10
        chain_ids = ["usr_l1_lead"]
        for i in range(1, 11):
            curr_id = f"usr_chain_l{i}"
            parent_id = chain_ids[-1]
            create_user(curr_id, f"Chain Member L{i}", f"chain_l{i}@test.com", f"CHN{i}", parent_id)
            # To qualify intermediate members so multi-tier commissions flow up to all 10 levels,
            # give each chain node 2 funded side-referrals:
            create_user(f"usr_side_{i}_a", f"Side {i}A", f"side_{i}_a@test.com", f"SDA{i}", curr_id)
            create_user(f"usr_side_{i}_b", f"Side {i}B", f"side_{i}_b@test.com", f"SDB{i}", curr_id)
            chain_ids.append(curr_id)

        sim_db.commit()

        # 3. Simulate Deposits across different days of the month:
        # Day 1: Qualifiers fund $1,000 each (confirming L1_Lead qualification)
        def add_deposit(dep_id: str, u_id: str, amount_cents: int, status: str = "confirmed"):
            d = models.Deposit(
                id=dep_id,
                user_id=u_id,
                amount_cents=amount_cents,
                status=status,
                idempotency_key=f"dep_idem_{dep_id}",
                created_at=datetime(2026, 10, 1),
                confirmed_at=datetime(2026, 10, 1) if status == "confirmed" else None
            )
            sim_db.add(d)
            sim_db.flush()
            if status == "confirmed":
                w = sim_db.query(models.Wallet).filter(models.Wallet.user_id == u_id).first()
                w.original_principal_cents += amount_cents
                # Process commissions
                process_deposit_commissions(sim_db, d)
            # Process in Oracle
            oracle.process_deposit(dep_id, u_id, amount_cents, status=status)
            sim_db.commit()

        # Fund qualifiers
        add_deposit("dep_q1", "usr_q1", 100000)  # $1,000.00
        add_deposit("dep_q2", "usr_q2", 100000)  # $1,000.00

        # Fund side qualifiers for chain nodes so ancestors qualify
        for i in range(1, 11):
            add_deposit(f"dep_side_{i}_a", f"usr_side_{i}_a", 10000)  # $100
            add_deposit(f"dep_side_{i}_b", f"usr_side_{i}_b", 10000)  # $100

        # Day 15: Deepest child (usr_chain_l10) makes a $10,000 confirmed deposit!
        # This will cascade 10 levels up through the chain to usr_l1_lead and direct bonus to usr_chain_l9!
        add_deposit("dep_big_l10", "usr_chain_l10", 1000000)  # $10,000.00 (1,000,000 cents)

        # Day 20: Deposit under unqualified user (usr_l1_unq has no funded directs, should NOT earn level commissions from below)
        create_user("usr_child_unq", "Child of Unqualified", "child_unq@test.com", "CHUNQ", "usr_l1_unq")
        add_deposit("dep_child_unq", "usr_child_unq", 50000)  # $500.00

        # Day 25: Pending deposit (should generate 0 commissions and 0 cycle ROI)
        add_deposit("dep_pending_1", "usr_chain_l5", 200000, status="pending")

        # Day 28: Failed deposit (should generate 0 commissions and 0 cycle ROI)
        add_deposit("dep_failed_1", "usr_chain_l3", 300000, status="failed")

        # 4. Execute Full Month-End Calculation Cycle for Month "2026-10"
        month_key = "2026-10"
        run_record = run_monthly_cycle(sim_db, admin_id="usr_admin", specific_month=month_key)
        oracle_returns = oracle.process_monthly_cycle(month_key)

        assert run_record.status == "completed"
        assert run_record.total_eligible_deposits > 0

        # 5. IDEMPOTENCY AUDIT: Re-run the exact same monthly cycle
        # Expected: Zero new deposits processed, zero duplicate wallet credits, zero duplicate cycle entries
        pre_re_run_roi = run_record.total_roi_cents
        pre_re_run_principal = run_record.total_principal_cents
        second_run_record = run_monthly_cycle(sim_db, admin_id="usr_admin", specific_month=month_key)
        sim_db.refresh(second_run_record)

        assert second_run_record.total_roi_cents == pre_re_run_roi, "Duplicate cycle execution corrupted ROI totals!"
        assert second_run_record.total_principal_cents == pre_re_run_principal, "Duplicate cycle execution corrupted Principal totals!"

        # 6. INDEPENDENT RECONCILIATION FOR EVERY ACCOUNT
        reconciliation_table = []
        all_passed = True

        for user_id, ref_wallet in oracle.wallets.items():
            if user_id == "usr_admin":
                continue

            db_wallet = sim_db.query(models.Wallet).filter(models.Wallet.user_id == user_id).first()
            assert db_wallet is not None, f"Wallet missing for {user_id}"

            # Calculate returns for this user
            user_exp_roi = sum(r.roi_cents for r in oracle.month_returns if r.user_id == user_id)
            user_act_roi = db_wallet.roi_balance_cents

            # Calculate commissions for this user
            user_exp_direct = ref_wallet.direct_bonus_cents
            user_exp_level = ref_wallet.level_commission_cents
            user_exp_comm = user_exp_direct + user_exp_level

            user_act_comm = db_wallet.direct_bonus_cents + db_wallet.level_commission_cents

            user_exp_balance = ref_wallet.total_balance_cents
            user_act_balance = db_wallet.total_balance_cents
            diff = user_act_balance - user_exp_balance

            status_str = "PASS" if diff == 0 else "FAIL"
            if diff != 0:
                all_passed = False

            rec_item = {
                "account_id": user_id,
                "user_name": oracle.users[user_id].name,
                "starting_balance_usd": 0.00,
                "eligible_rate": "5% ROI + 5% Prn + 85% Cascade",
                "expected_return_usd": user_exp_roi / 100.0,
                "actual_return_usd": user_act_roi / 100.0,
                "expected_commissions_usd": user_exp_comm / 100.0,
                "actual_commissions_usd": user_act_comm / 100.0,
                "expected_ending_balance_usd": user_exp_balance / 100.0,
                "actual_ending_balance_usd": user_act_balance / 100.0,
                "difference_usd": diff / 100.0,
                "status": status_str
            }
            reconciliation_table.append(rec_item)

        # Write reconciliation results to artifacts
        out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "scratch"))
        os.makedirs(out_dir, exist_ok=True)
        with open(os.path.join(out_dir, "reconciliation_results.json"), "w", encoding="utf-8") as f:
            json.dump(reconciliation_table, f, indent=2)

        assert all_passed is True, "One or more accounts failed independent calculation reconciliation!"

    def test_circular_referral_graph_prevention(self, sim_db):
        """
        Verify that circular referral loops (if any corrupt graph occurred) cannot cause infinite loops in commission engine.
        """
        u1 = models.User(
            id="usr_circ_a", name="Circ A", email="circ_a@test.com",
            password_hash="x", role="customer", referral_code="CIRCA",
            referrer_id="usr_circ_b", status="active", is_verified=True
        )
        u2 = models.User(
            id="usr_circ_b", name="Circ B", email="circ_b@test.com",
            password_hash="x", role="customer", referral_code="CIRCB",
            referrer_id="usr_circ_a", status="active", is_verified=True
        )
        sim_db.add(u1)
        sim_db.add(u2)
        sim_db.flush()

        dep = models.Deposit(
            id="dep_circ", user_id="usr_circ_a", amount_cents=10000, status="confirmed",
            idempotency_key="dep_circ_key"
        )
        sim_db.add(dep)
        sim_db.flush()

        # Calling commission engine must terminate safely and not recurse infinitely
        comms = process_deposit_commissions(sim_db, dep)
        assert isinstance(comms, list)
        sim_db.rollback()
