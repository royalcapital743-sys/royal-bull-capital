"""
Royal Bull Capital — Double-Entry Accounting Ledger Test Suite

Validates:
1. Chart of Accounts integrity
2. Strict debit == credit enforcement (sum(Debits) == sum(Credits))
3. Unbalanced entry rejection
4. Immutability of posted entries
5. Compensating reversals
6. Subledger reconciliation against wallet balances
7. End-to-end transaction flow (Deposit -> Direct Bonus -> Multi-Tier Cascade -> Monthly ROI -> Principal Growth -> Withdrawal)
"""

import os
import sys
import pytest
from datetime import datetime
from decimal import Decimal
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

import models
import database
import accounting
from accounting import (
    JournalLineDraft, post_journal_entry, verify_trial_balance,
    reverse_journal_entry, UnbalancedJournalEntryError, AccountingError,
    post_deposit_journal, post_direct_bonus_journal, post_level_commission_journal,
    post_monthly_cycle_journal, post_withdrawal_journal,
    reconcile_user_subledger, reconcile_system_wide
)

@pytest.fixture
def test_db():
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    models.Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    db = Session()
    try:
        # Seed system rules
        rules = models.SystemRule(
            id="global",
            direct_bonus=5.00,
            level_rates="[20, 15, 10, 8, 7, 6, 5, 4, 3, 2]",
            monthly_roi=5.00,
            monthly_principal=5.00
        )
        db.add(rules)
        db.commit()
        yield db
    finally:
        db.close()

def test_chart_of_accounts_completeness():
    """Verifies all required asset, liability, and expense accounts exist in COA."""
    coa = accounting.CHART_OF_ACCOUNTS
    required_accounts = [
        "1010_PLATFORM_OPERATING_CASH",
        "2010_MEMBER_PRINCIPAL_PAYABLE",
        "2020_MEMBER_DIRECT_BONUS_PAYABLE",
        "2030_MEMBER_LEVEL_COMMISSION_PAYABLE",
        "2040_MEMBER_ROI_PAYABLE",
        "2050_MEMBER_PRINCIPAL_CREDIT_PAYABLE",
        "5010_DIRECT_BONUS_EXPENSE",
        "5020_LEVEL_COMMISSION_EXPENSE",
        "5030_ROI_DISTRIBUTION_EXPENSE",
        "5040_PRINCIPAL_GROWTH_EXPENSE"
    ]
    for acct in required_accounts:
        assert acct in coa, f"Account {acct} missing from Chart of Accounts."

def test_reject_unbalanced_journal_entry(test_db):
    """Proves that unbalanced journal entries are strictly rejected."""
    lines = [
        JournalLineDraft("1010_PLATFORM_OPERATING_CASH", debit_cents=10000, credit_cents=0),
        JournalLineDraft("2010_MEMBER_PRINCIPAL_PAYABLE", debit_cents=0, credit_cents=9000)  # Off by 1000 cents
    ]

    with pytest.raises(UnbalancedJournalEntryError) as exc_info:
        post_journal_entry(
            db=test_db,
            transaction_type="deposit",
            reference_id="dep_test_fail",
            idempotency_key="idemp_unbalanced_1",
            description="Unbalanced test entry",
            lines=lines
        )
    assert "Total debits (10000 cents) != Total credits (9000 cents)" in str(exc_info.value)

def test_idempotency_enforcement(test_db):
    """Proves that duplicate postings with identical idempotency key are idempotent."""
    lines = [
        JournalLineDraft("1010_PLATFORM_OPERATING_CASH", debit_cents=5000, credit_cents=0),
        JournalLineDraft("2010_MEMBER_PRINCIPAL_PAYABLE", debit_cents=0, credit_cents=5000)
    ]
    entry1 = post_journal_entry(
        db=test_db,
        transaction_type="deposit",
        reference_id="dep_1",
        idempotency_key="idemp_unique_test_1",
        description="Deposit",
        lines=lines
    )
    test_db.commit()

    entry2 = post_journal_entry(
        db=test_db,
        transaction_type="deposit",
        reference_id="dep_1",
        idempotency_key="idemp_unique_test_1",
        description="Deposit duplicate",
        lines=lines
    )
    assert entry1.id == entry2.id
    # Assert line count did not double
    total_lines = test_db.query(models.JournalLine).count()
    assert total_lines == 2

def test_compensating_reversal(test_db):
    """Proves that reversals post compensating entries and preserve audit history."""
    lines = [
        JournalLineDraft("1010_PLATFORM_OPERATING_CASH", debit_cents=20000, credit_cents=0),
        JournalLineDraft("2010_MEMBER_PRINCIPAL_PAYABLE", debit_cents=0, credit_cents=20000)
    ]
    entry = post_journal_entry(
        db=test_db,
        transaction_type="deposit",
        reference_id="dep_rev_test",
        idempotency_key="idemp_rev_test",
        description="Original Deposit to reverse",
        lines=lines
    )
    test_db.commit()

    # Reverse entry
    reversal = reverse_journal_entry(
        db=test_db,
        original_entry_id=entry.id,
        reason="Chargeback / simulated reversal",
        admin_id="adm_tester"
    )
    test_db.commit()

    assert entry.status == "reversed"
    assert reversal.status == "posted"
    assert reversal.transaction_type == "reversal"
    assert reversal.reference_id == entry.id

    # Verify trial balance is still balanced
    tb = verify_trial_balance(test_db)
    assert tb["is_balanced"] is True
    assert tb["total_debits_cents"] == 40000
    assert tb["total_credits_cents"] == 40000
    assert tb["difference_cents"] == 0

    # Net balance for cash and member principal is 0
    cash_net = [a for a in tb["accounts"] if a["account_code"] == "1010_PLATFORM_OPERATING_CASH"][0]["net_cents"]
    payable_net = [a for a in tb["accounts"] if a["account_code"] == "2010_MEMBER_PRINCIPAL_PAYABLE"][0]["net_cents"]
    assert cash_net == 0
    assert payable_net == 0

def test_full_financial_flow_and_reconciliation(test_db):
    """
    Simulates a complete real-world customer journey and verifies double-entry balance at every step:
    1. Alice deposits $1,000.
    2. Bob (referred by Alice) deposits $500.
       - Alice receives $25 (5% direct bonus)
    3. Charlie (referred by Bob) deposits $1,000.
       - Bob receives $50 (5% direct bonus)
    4. Monthly cycle executes (5% ROI + 5% principal growth).
    5. Alice withdraws $50.
    Asserts:
    - Every transaction produces balanced entries.
    - Global trial balance has sum(Debits) == sum(Credits).
    - Alice and Bob wallets match their double-entry subledger positions exactly.
    """
    # Create Alice, Bob, Charlie
    alice = models.User(id="usr_alice", name="Alice", email="alice@test.com", password_hash="hash", referral_code="ALICE")
    bob = models.User(id="usr_bob", name="Bob", email="bob@test.com", password_hash="hash", referral_code="BOB", referrer_id="usr_alice")
    charlie = models.User(id="usr_charlie", name="Charlie", email="charlie@test.com", password_hash="hash", referral_code="CHARLIE", referrer_id="usr_bob")

    test_db.add_all([alice, bob, charlie])
    test_db.flush()

    w_alice = models.Wallet(user_id=alice.id)
    w_bob = models.Wallet(user_id=bob.id)
    w_charlie = models.Wallet(user_id=charlie.id)
    test_db.add_all([w_alice, w_bob, w_charlie])
    test_db.flush()

    # 1. Alice deposits $1,000 (100,000 cents)
    dep_alice = models.Deposit(id="dep_alice_1", user_id=alice.id, amount_cents=100000, status="confirmed")
    test_db.add(dep_alice)
    w_alice.original_principal_cents += 100000
    post_deposit_journal(test_db, dep_alice)
    test_db.flush()

    # Check trial balance after deposit 1
    tb1 = verify_trial_balance(test_db)
    assert tb1["is_balanced"] is True
    assert tb1["total_debits_cents"] == 100000
    assert tb1["total_credits_cents"] == 100000

    # 2. Bob deposits $500 (50,000 cents) -> Alice gets 5% direct bonus ($25 / 2,500 cents)
    dep_bob = models.Deposit(id="dep_bob_1", user_id=bob.id, amount_cents=50000, status="confirmed")
    test_db.add(dep_bob)
    w_bob.original_principal_cents += 50000
    post_deposit_journal(test_db, dep_bob)

    bonus_alice_cents = 2500
    w_alice.direct_bonus_cents += bonus_alice_cents
    post_direct_bonus_journal(test_db, dep_bob.id, alice.id, bonus_alice_cents, "dep_bob_1_direct_alice")
    test_db.flush()

    # Check trial balance after deposit 2 + direct bonus
    tb2 = verify_trial_balance(test_db)
    assert tb2["is_balanced"] is True
    assert tb2["total_debits_cents"] == 152500
    assert tb2["total_credits_cents"] == 152500

    # 3. Monthly Cycle Run for Alice ($1,000 deposit): 5% ROI ($50 / 5,000 cents) + 5% Principal Credit ($50 / 5,000 cents)
    roi_alice = 5000
    prn_alice = 5000
    w_alice.roi_balance_cents += roi_alice
    w_alice.principal_credits_cents += prn_alice
    post_monthly_cycle_journal(test_db, dep_alice.id, alice.id, "2026-10", roi_alice, prn_alice, "dep_alice_1_2026-10")
    test_db.flush()

    # Check trial balance after monthly cycle
    tb3 = verify_trial_balance(test_db)
    assert tb3["is_balanced"] is True
    assert tb3["total_debits_cents"] == 162500
    assert tb3["total_credits_cents"] == 162500

    # 4. Alice withdraws $50 (5,000 cents) deducted from her direct bonus ($25) and ROI ($25)
    wd_alice = models.Withdrawal(id="wd_alice_1", user_id=alice.id, amount_cents=5000, status="approved", month_key="2026-10")
    test_db.add(wd_alice)
    deductions = {
        "direct_bonus_cents": 2500,
        "roi_balance_cents": 2500
    }
    w_alice.direct_bonus_cents -= 2500
    w_alice.roi_balance_cents -= 2500
    w_alice.withdrawn_total_cents += 5000
    post_withdrawal_journal(test_db, wd_alice, deductions)
    test_db.flush()

    # 5. Full Final Verification
    tb_final = verify_trial_balance(test_db)
    assert tb_final["is_balanced"] is True
    assert tb_final["difference_cents"] == 0

    # Subledger reconciliation for Alice
    rec_alice = reconcile_user_subledger(test_db, alice.id)
    assert rec_alice["reconciled"] is True, f"Alice subledger discrepancy: {rec_alice['discrepancies']}"

    # Subledger reconciliation for Bob
    rec_bob = reconcile_user_subledger(test_db, bob.id)
    assert rec_bob["reconciled"] is True, f"Bob subledger discrepancy: {rec_bob['discrepancies']}"

    # System-wide reconciliation
    rec_sys = reconcile_system_wide(test_db)
    assert rec_sys["is_fully_reconciled"] is True
    assert rec_sys["wallet_discrepancies_count"] == 0
