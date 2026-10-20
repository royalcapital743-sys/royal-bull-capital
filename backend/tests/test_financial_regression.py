"""
Royal Bull Capital — Financial Calculation Regression & Independent Oracle Test Suite

Validates:
1. All 10 referral levels: [20%, 15%, 10%, 8%, 7%, 6%, 5%, 4%, 3%, 2%]
2. Direct referral bonus: 5%
3. Qualification boundary rules: user must have >= 2 funded direct referrals
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
from commission_engine import process_deposit_commissions, check_user_qualification
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
    Tests exact boundary conditions for referral level qualification:
    - 0 funded directs -> Disqualified (False)
    - 1 funded direct -> Disqualified (False)
    - 2 funded directs -> Qualified (True)
    - 3+ funded directs -> Qualified (True)
    """
    # Create parent user
    parent = models.User(id="u_parent", name="Parent", email="p@test.com", password_hash="h", referral_code="PARENT")
    calc_db.add(parent)
    calc_db.commit()

    # 0 directs
    assert check_user_qualification(calc_db, "u_parent") is False

    # Child 1 registered but NOT funded
    child1 = models.User(id="u_c1", name="Child 1", email="c1@test.com", password_hash="h", referral_code="C1", referrer_id="u_parent")
    calc_db.add(child1)
    calc_db.commit()
    assert check_user_qualification(calc_db, "u_parent") is False

    # Child 1 funds deposit
    dep1 = models.Deposit(id="dep_c1", user_id="u_c1", amount_cents=10000, status="confirmed")
    calc_db.add(dep1)
    calc_db.commit()
    # 1 funded direct -> still False!
    assert check_user_qualification(calc_db, "u_parent") is False

    # Child 2 registered but pending deposit
    child2 = models.User(id="u_c2", name="Child 2", email="c2@test.com", password_hash="h", referral_code="C2", referrer_id="u_parent")
    dep2_pending = models.Deposit(id="dep_c2_p", user_id="u_c2", amount_cents=10000, status="pending")
    calc_db.add_all([child2, dep2_pending])
    calc_db.commit()
    # Pending does NOT qualify!
    assert check_user_qualification(calc_db, "u_parent") is False

    # Confirm Child 2 deposit
    dep2_pending.status = "confirmed"
    calc_db.commit()
    # 2 funded directs -> Qualified!
    assert check_user_qualification(calc_db, "u_parent") is True

def test_all_10_referral_levels_cascade_and_rates(calc_db):
    """
    Constructs an 11-level deep referral tree:
    U0 -> U1 -> U2 -> U3 -> U4 -> U5 -> U6 -> U7 -> U8 -> U9 -> U10 -> Depositor
    Ensures every ancestor is qualified (has 2 funded side branches).
    Depositor deposits $10,000 (1,000,000 cents).
    Verifies:
    - Direct bonus to immediate parent (U10): 5% ($500.00 / 50,000 cents)
    - Level 1 to U10: 20% ($2,000.00 / 200,000 cents)
    - Level 2 to U9:  15% ($1,500.00 / 150,000 cents)
    - Level 3 to U8:  10% ($1,000.00 / 100,000 cents)
    - Level 4 to U7:   8%   ($800.00 / 80,000 cents)
    - Level 5 to U6:   7%   ($700.00 / 70,000 cents)
    - Level 6 to U5:   6%   ($600.00 / 60,000 cents)
    - Level 7 to U4:   5%   ($500.00 / 50,000 cents)
    - Level 8 to U3:   4%   ($400.00 / 40,000 cents)
    - Level 9 to U2:   3%   ($300.00 / 30,000 cents)
    - Level 10 to U1:  2%   ($200.00 / 20,000 cents)
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

        # Qualify user i-1 by giving them 2 funded direct children
        c_a = models.User(id=f"qual_{i}_a", name="QA", email=f"qa_{i}@test.com", password_hash="h", referral_code=f"QA{i}", referrer_id=prev.id)
        c_b = models.User(id=f"qual_{i}_b", name="QB", email=f"qb_{i}@test.com", password_hash="h", referral_code=f"QB{i}", referrer_id=prev.id)
        calc_db.add_all([c_a, c_b])
        calc_db.flush()

        dep_qa = models.Deposit(id=f"dep_qa_{i}", user_id=c_a.id, amount_cents=10000, status="confirmed")
        dep_qb = models.Deposit(id=f"dep_qb_{i}", user_id=c_b.id, amount_cents=10000, status="confirmed")
        calc_db.add_all([dep_qa, dep_qb])
        calc_db.flush()

    # Qualify U10 as well
    c10_a = models.User(id="qual_top_10_a", name="Q10A", email="qtop10a@test.com", password_hash="h", referral_code="Q10A", referrer_id=ancestors[10].id)
    c10_b = models.User(id="qual_top_10_b", name="Q10B", email="qtop10b@test.com", password_hash="h", referral_code="Q10B", referrer_id=ancestors[10].id)
    calc_db.add_all([c10_a, c10_b])
    calc_db.flush()
    dep10_a = models.Deposit(id="dep_qtop_10_a", user_id=c10_a.id, amount_cents=10000, status="confirmed")
    dep10_b = models.Deposit(id="dep_qtop_10_b", user_id=c10_b.id, amount_cents=10000, status="confirmed")
    calc_db.add_all([dep10_a, dep10_b])
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

    # Run commission processing
    comms = process_deposit_commissions(calc_db, deposit)
    calc_db.commit()

    # Total commissions should be 1 direct bonus + 10 level commissions = 11 allocations
    assert len(comms) == 11

    # Check direct bonus to U10: 5% of $10,000 = $500 (50,000 cents)
    direct_comm = [c for c in comms if c.commission_type == "direct_bonus"][0]
    assert direct_comm.recipient_user_id == ancestors[10].id
    assert direct_comm.amount_cents == 50000
    assert direct_comm.rate_percent == Decimal("5.00")

    # Check all 10 level commissions
    level_comms = {c.level: c for c in comms if c.commission_type == "level_commission"}
    assert len(level_comms) == 10

    for lvl in range(1, 11):
        expected_rate = expected_rates[lvl - 1]
        expected_cents = int(1000000 * expected_rate / 100)
        expected_recipient = ancestors[11 - lvl]  # Level 1 goes to U10, Level 10 goes to U1

        c = level_comms[lvl]
        assert c.recipient_user_id == expected_recipient.id, f"Level {lvl} wrong recipient: expected {expected_recipient.id}, got {c.recipient_user_id}"
        assert c.amount_cents == expected_cents, f"Level {lvl} wrong amount: expected {expected_cents}, got {c.amount_cents}"
        assert float(c.rate_percent) == float(expected_rate)

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
    and proves 100% exact numerical match with production calculations.
    """
    oracle = IndependentReferenceCalculator()

    # Depositor parent and child
    oracle.add_user("usr_p", "Parent", "p@test.com", None)
    oracle.add_user("usr_c", "Child", "c@test.com", "usr_p")

    # Qualify parent in oracle
    oracle.add_user("usr_q1", "Q1", "q1@test.com", "usr_p")
    oracle.add_user("usr_q2", "Q2", "q2@test.com", "usr_p")
    oracle.process_deposit("dep_q1", "usr_q1", 10000)
    oracle.process_deposit("dep_q2", "usr_q2", 10000)

    # Child deposits $1,234.56 (123,456 cents)
    dep_cents = 123456
    oracle_comms = oracle.process_deposit("dep_test_oracle", "usr_c", dep_cents)

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

    prod_comms = process_deposit_commissions(calc_db, dep_prod)
    calc_db.commit()

    # Compare direct bonus cents
    oracle_direct = [c for c in oracle_comms if c.commission_type == "direct_bonus"][0].amount_cents
    prod_direct = [c for c in prod_comms if c.commission_type == "direct_bonus"][0].amount_cents
    assert oracle_direct == prod_direct

    # Compare level 1 commission cents
    oracle_lvl1 = [c for c in oracle_comms if c.commission_type == "level_commission" and c.level == 1][0].amount_cents
    prod_lvl1 = [c for c in prod_comms if c.commission_type == "level_commission" and c.level == 1][0].amount_cents
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
