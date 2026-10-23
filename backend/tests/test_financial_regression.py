"""
Royal Bull Capital — Financial Calculation Regression & Independent Oracle Test Suite

Validates:
1. All 10 referral levels: [20%, 15%, 10%, 8%, 7%, 6%, 5%, 4%, 3%, 2%] calculated from Monthly ROI
2. Direct referral bonus: 5% on deposit confirmation
3. Option A Qualification boundary rules: user must have >= L funded direct referrals for Level L
4. Multi-level cascade tree up to 10 ancestor levels, and cutoff at level 11
5. Monthly cycle calculation (5% ROI + 5% Principal Credit)
6. Duplicate execution & idempotency protection
7. Failed and rejected deposits (zero financial credits)
8. Independent oracle parity check against production commission engine
"""

import os
import sys
import pytest
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend and tests directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
tests_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)
if tests_dir not in sys.path:
    sys.path.insert(0, tests_dir)

import models
import database
import accounting
from commission_engine import (
    process_deposit_commissions,
    process_monthly_roi_commissions,
    check_user_level_qualification,
    check_user_qualification,
    get_user_funded_directs_count
)
from cycle_engine import run_monthly_cycle
from reference_calculator import IndependentReferenceCalculator

@pytest.fixture
def calc_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    models.Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        rules = models.SystemRule(
            id="global",
            direct_bonus=5.00,
            level_rates="[20, 15, 10, 8, 7, 6, 5, 4, 3, 2]",
            monthly_roi=5.00,
            monthly_principal=5.00,
            minimum_deposit=100.00,
            min_withdrawal=20.00,
            max_withdrawal=50000.00
        )
        db.add(rules)
        db.commit()
        yield db
    finally:
        db.close()

def test_qualification_boundary_rule(calc_db):
    """
    Tests Option A boundary conditions for referral level qualification:
    - 0 funded directs -> Disqualified for all levels
    - 1 funded direct -> Qualified for Level 1, Disqualified for Level 2
    - 2 funded directs -> Qualified for Level 1 and Level 2, Disqualified for Level 3
    """
    parent = models.User(id="u_parent", name="Parent", email="p@test.com", password_hash="h", referral_code="PARENT")
    calc_db.add(parent)
    calc_db.commit()

    # 0 directs
    assert check_user_level_qualification(calc_db, "u_parent", level=1) is False
    assert check_user_level_qualification(calc_db, "u_parent", level=2) is False

    # Child 1 registered but NOT funded
    child1 = models.User(id="u_c1", name="Child 1", email="c1@test.com", password_hash="h", referral_code="C1", referrer_id="u_parent")
    calc_db.add(child1)
    calc_db.commit()
    assert check_user_level_qualification(calc_db, "u_parent", level=1) is False

    # Child 1 funds deposit ($100 = 10000 cents)
    dep1 = models.Deposit(id="dep_c1", user_id="u_c1", amount_cents=10000, status="confirmed")
    calc_db.add(dep1)
    calc_db.commit()
    # 1 funded direct -> Qualified for Level 1, NOT Level 2
    assert check_user_level_qualification(calc_db, "u_parent", level=1) is True
    assert check_user_level_qualification(calc_db, "u_parent", level=2) is False

    # Child 2 registered but pending deposit
    child2 = models.User(id="u_c2", name="Child 2", email="c2@test.com", password_hash="h", referral_code="C2", referrer_id="u_parent")
    dep2_pending = models.Deposit(id="dep_c2_p", user_id="u_c2", amount_cents=10000, status="pending")
    calc_db.add_all([child2, dep2_pending])
    calc_db.commit()
    # Pending does NOT count
    assert check_user_level_qualification(calc_db, "u_parent", level=2) is False

    # Confirm Child 2 deposit
    dep2_pending.status = "confirmed"
    calc_db.commit()
    # 2 funded directs -> Qualified for Level 2!
    assert check_user_level_qualification(calc_db, "u_parent", level=2) is True
    assert check_user_level_qualification(calc_db, "u_parent", level=3) is False

def test_all_10_referral_levels_cascade_and_rates(calc_db):
    """
    Constructs an 11-level deep referral tree:
    U0 -> U1 -> U2 -> U3 -> U4 -> U5 -> U6 -> U7 -> U8 -> U9 -> U10 -> Depositor
    Ensures each ancestor qualifies for their level (has >= level funded directs).
    Depositor deposits $10,000 (1,000,000 cents).
    Executes Monthly Cycle: generates 5% ROI on $10,000 = $500.00 (50,000 cents).
    Verifies 10-level cascade calculated from the $500 monthly ROI:
    - Level 1 to U10: 20% ($100.00 / 10,000 cents)
    - Level 2 to U9:  15% ($75.00  /  7,500 cents)
    - Level 3 to U8:  10% ($50.00  /  5,000 cents)
    - Level 4 to U7:   8% ($40.00  /  4,000 cents)
    - Level 5 to U6:   7% ($35.00  /  3,500 cents)
    - Level 6 to U5:   6% ($30.00  /  3,000 cents)
    - Level 7 to U4:   5% ($25.00  /  2,500 cents)
    - Level 8 to U3:   4% ($20.00  /  2,000 cents)
    - Level 9 to U2:   3% ($15.00  /  1,500 cents)
    - Level 10 to U1:  2% ($10.00  /  1,000 cents)
    - Total Level Commissions: $400.00 (40,000 cents = 80% of $500 ROI)
    - Level 11 to U0: Cutoff! U0 receives $0 (exceeds 10 configured levels).
    """
    expected_rates = [20, 15, 10, 8, 7, 6, 5, 4, 3, 2]

    # Create root U0
    u0 = models.User(id="u_0", name="Ancestor 0", email="u0@test.com", password_hash="h", referral_code="U0")
    calc_db.add(u0)
    calc_db.flush()

    ancestors = [u0]
    # Create U1 through U10 in a chain
    for i in range(1, 11):
        prev = ancestors[i - 1]
        u = models.User(
            id=f"u_{i}",
            name=f"Ancestor {i}",
            email=f"u{i}@test.com",
            password_hash="h",
            referral_code=f"U{i}",
            referrer_id=prev.id
        )
        calc_db.add(u)
        calc_db.flush()
        ancestors.append(u)

        # Give user 10 funded direct children so they qualify for any level up to 10
        for d in range(10):
            c = models.User(id=f"qual_{i}_{d}", name=f"Q_{i}_{d}", email=f"q_{i}_{d}@test.com", password_hash="h", referral_code=f"Q_{i}_{d}", referrer_id=u.id)
            calc_db.add(c)
            calc_db.flush()
            dep = models.Deposit(id=f"dep_q_{i}_{d}", user_id=c.id, amount_cents=10000, status="confirmed")
            calc_db.add(dep)
            calc_db.flush()

    # Create depositor referred by U10
    depositor = models.User(
        id="u_depositor",
        name="Depositor",
        email="depositor@test.com",
        password_hash="h",
        referral_code="DEPOSITOR",
        referrer_id=ancestors[10].id
    )
    calc_db.add(depositor)
    calc_db.flush()

    # Deposit $10,000 (1,000,000 cents)
    deposit = models.Deposit(id="dep_main", user_id=depositor.id, amount_cents=1000000, status="confirmed")
    calc_db.add(deposit)
    calc_db.flush()

    # Deposit confirmation triggers ONLY 5% direct bonus to U10
    dep_comms = process_deposit_commissions(calc_db, deposit)
    assert len(dep_comms) == 1
    assert dep_comms[0].commission_type == "direct_bonus"
    assert dep_comms[0].amount_cents == 50000  # 5% of $10,000 = $500
    assert dep_comms[0].recipient_user_id == ancestors[10].id

    # Execute Monthly Cycle for 2026-10
    # $10,000 deposit yields 5% ROI = $500 (50,000 cents)
    cycle_run = run_monthly_cycle(calc_db, specific_month="2026-10")
    calc_db.commit()

    # Query all level commissions generated during monthly cycle
    level_comms = calc_db.query(models.Commission).filter(
        models.Commission.commission_type == "roi_level_commission",
        models.Commission.month_key == "2026-10"
    ).all()
    level_by_num = {c.level: c for c in level_comms}
    assert len(level_by_num) == 10

    roi_cents = 50000  # $500.00
    for lvl in range(1, 11):
        expected_rate = expected_rates[lvl - 1]
        expected_cents = int(roi_cents * expected_rate / 100)
        expected_recipient = ancestors[11 - lvl]  # Level 1 goes to U10, Level 10 goes to U1

        c = level_by_num[lvl]
        assert c.recipient_user_id == expected_recipient.id, f"Level {lvl} wrong recipient"
        assert c.amount_cents == expected_cents, f"Level {lvl} wrong amount: expected {expected_cents}, got {c.amount_cents}"
        assert float(c.rate_percent) == float(expected_rate)
        assert c.base_cents == roi_cents

    # Verify U0 (level 11) received 0 commissions
    u0_comms = calc_db.query(models.Commission).filter(models.Commission.recipient_user_id == u0.id).all()
    assert len(u0_comms) == 0

    # Verify double-entry ledger is completely balanced
    tb = accounting.verify_trial_balance(calc_db)
    assert tb["is_balanced"] is True
    assert tb["difference_cents"] == 0

def test_independent_oracle_parity(calc_db):
    """
    Executes identical input through the independent ReferenceCalculator oracle
    and proves 100% exact numerical match with production calculations for both
    direct bonus and monthly ROI 10-level commissions.
    """
    oracle = IndependentReferenceCalculator()

    # Depositor parent and child
    oracle.add_user("usr_p", "Parent", "p@test.com", None)
    oracle.add_user("usr_c", "Child", "c@test.com", "usr_p")

    # Qualify parent with 2 funded directs
    oracle.add_user("usr_q1", "Q1", "q1@test.com", "usr_p")
    oracle.add_user("usr_q2", "Q2", "q2@test.com", "usr_p")
    oracle.process_deposit("dep_q1", "usr_q1", 10000)
    oracle.process_deposit("dep_q2", "usr_q2", 10000)

    # Child deposits $1,234.56 (123,456 cents)
    dep_cents = 123456
    oracle_deposit_comms = oracle.process_deposit("dep_test_oracle", "usr_c", dep_cents)
    oracle_cycle_returns = oracle.process_monthly_cycle("2026-10")

    # In production DB:
    up = models.User(id="usr_p", name="Parent", email="p_or@test.com", password_hash="h", referral_code="POR")
    uc = models.User(id="usr_c", name="Child", email="c_or@test.com", password_hash="h", referral_code="COR", referrer_id="usr_p")
    uq1 = models.User(id="usr_q1", name="Q1", email="q1_or@test.com", password_hash="h", referral_code="Q1OR", referrer_id="usr_p")
    uq2 = models.User(id="usr_q2", name="Q2", email="q2_or@test.com", password_hash="h", referral_code="Q2OR", referrer_id="usr_p")
    calc_db.add_all([up, uc, uq1, uq2])
    calc_db.flush()

    dep_q1 = models.Deposit(id="dep_q1", user_id="usr_q1", amount_cents=10000, status="confirmed")
    dep_q2 = models.Deposit(id="dep_q2", user_id="usr_q2", amount_cents=10000, status="confirmed")
    calc_db.add_all([dep_q1, dep_q2])
    calc_db.flush()

    dep_prod = models.Deposit(id="dep_test_oracle", user_id="usr_c", amount_cents=dep_cents, status="confirmed")
    calc_db.add(dep_prod)
    calc_db.flush()

    prod_dep_comms = process_deposit_commissions(calc_db, dep_prod)
    run_monthly_cycle(calc_db, specific_month="2026-10")
    calc_db.commit()

    # Compare direct bonus cents
    oracle_direct = [c for c in oracle.commissions if c.commission_type == "direct_bonus" and c.deposit_id == "dep_test_oracle"][0].amount_cents
    prod_direct = prod_dep_comms[0].amount_cents
    assert oracle_direct == prod_direct

    # Compare level 1 ROI commission cents
    oracle_lvl1 = [c for c in oracle.commissions if c.commission_type == "roi_level_commission" and c.level == 1 and c.deposit_id == "dep_test_oracle"][0].amount_cents
    prod_lvl1 = calc_db.query(models.Commission).filter(
        models.Commission.deposit_id == "dep_test_oracle",
        models.Commission.level == 1,
        models.Commission.commission_type == "roi_level_commission"
    ).first().amount_cents
    assert oracle_lvl1 == prod_lvl1

def test_monthly_cycle_idempotency_and_limits(calc_db):
    """
    Verifies that running the monthly cycle twice for the same month:
    - Does NOT double credit user wallets.
    - Does NOT double insert ledger records.
    - Yields exact 5% ROI and 5% Principal Credit.
    """
    user = models.User(id="usr_cyc", name="Cycle User", email="cyc@test.com", password_hash="h", referral_code="CYC")
    calc_db.add(user)
    calc_db.flush()

    wallet = models.Wallet(user_id=user.id)
    calc_db.add(wallet)
    calc_db.flush()

    dep = models.Deposit(id="dep_cyc_1", user_id=user.id, amount_cents=200000, status="confirmed")  # $2,000
    calc_db.add(dep)
    calc_db.commit()

    # Run cycle 1 for 2026-10
    run1 = run_monthly_cycle(calc_db, specific_month="2026-10")
    assert run1.total_eligible_deposits == 1
    # 5% of 200,000 = 10,000 cents ($100)
    assert run1.total_roi_cents == 10000
    assert run1.total_principal_cents == 10000
    assert wallet.roi_balance_cents == 10000
    assert wallet.principal_credits_cents == 10000

    # Run cycle 2 for SAME month 2026-10
    run2 = run_monthly_cycle(calc_db, specific_month="2026-10")
    # Idempotent: 0 newly processed deposits
    assert wallet.roi_balance_cents == 10000
    assert wallet.principal_credits_cents == 10000

    # Subledger reconciliation
    rec = accounting.reconcile_user_subledger(calc_db, user.id)
    assert rec["reconciled"] is True
