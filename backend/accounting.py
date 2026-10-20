import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import func
import models

class UnbalancedJournalEntryError(ValueError):
    """Raised when sum(debits) != sum(credits) in a journal entry."""
    pass

class AccountingError(Exception):
    pass

# Standard Chart of Accounts (COA)
CHART_OF_ACCOUNTS = {
    "1010_PLATFORM_OPERATING_CASH": {
        "name": "Platform Operating Cash / Settlement Clearing",
        "category": "ASSET"
    },
    "2010_MEMBER_PRINCIPAL_PAYABLE": {
        "name": "Member Principal Liability",
        "category": "LIABILITY"
    },
    "2020_MEMBER_DIRECT_BONUS_PAYABLE": {
        "name": "Member Direct Bonus Payable",
        "category": "LIABILITY"
    },
    "2030_MEMBER_LEVEL_COMMISSION_PAYABLE": {
        "name": "Member Level Commission Payable",
        "category": "LIABILITY"
    },
    "2040_MEMBER_ROI_PAYABLE": {
        "name": "Member Monthly ROI Distribution Payable",
        "category": "LIABILITY"
    },
    "2050_MEMBER_PRINCIPAL_CREDIT_PAYABLE": {
        "name": "Member Monthly Principal Growth Credit Payable",
        "category": "LIABILITY"
    },
    "5010_DIRECT_BONUS_EXPENSE": {
        "name": "Platform Direct Referral Bonus Expense",
        "category": "EXPENSE"
    },
    "5020_LEVEL_COMMISSION_EXPENSE": {
        "name": "Platform Multi-Tier Level Commission Expense",
        "category": "EXPENSE"
    },
    "5030_ROI_DISTRIBUTION_EXPENSE": {
        "name": "Platform Monthly Performance ROI Distribution Expense",
        "category": "EXPENSE"
    },
    "5040_PRINCIPAL_GROWTH_EXPENSE": {
        "name": "Platform Monthly Principal Growth Distribution Expense",
        "category": "EXPENSE"
    }
}

def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

class JournalLineDraft:
    def __init__(
        self,
        account_code: str,
        debit_cents: int = 0,
        credit_cents: int = 0,
        user_id: Optional[str] = None
    ):
        if account_code not in CHART_OF_ACCOUNTS:
            raise AccountingError(f"Account code '{account_code}' not defined in Chart of Accounts.")
        if debit_cents < 0 or credit_cents < 0:
            raise AccountingError("Debit and credit amounts must be non-negative integers.")
        if debit_cents > 0 and credit_cents > 0:
            raise AccountingError("A single journal line cannot contain both debit and credit.")
        if debit_cents == 0 and credit_cents == 0:
            raise AccountingError("Journal line amount must be greater than zero.")

        self.account_code = account_code
        self.account_name = CHART_OF_ACCOUNTS[account_code]["name"]
        self.debit_cents = int(debit_cents)
        self.credit_cents = int(credit_cents)
        self.user_id = user_id

def post_journal_entry(
    db: Session,
    transaction_type: str,
    reference_id: Optional[str],
    idempotency_key: str,
    description: str,
    lines: List[JournalLineDraft],
    posted_at: Optional[datetime] = None
) -> models.JournalEntry:
    """
    Enforces double-entry bookkeeping:
    1. Sum of all debits must strictly equal sum of all credits.
    2. Enforces idempotency: if entry with idempotency_key exists, returns it.
    3. Entries are immutable once posted.
    """
    # 1. Check idempotency
    existing = db.query(models.JournalEntry).filter(
        models.JournalEntry.idempotency_key == idempotency_key
    ).first()
    if existing:
        return existing

    # 2. Strict Balance Verification
    total_debits = sum(line.debit_cents for line in lines)
    total_credits = sum(line.credit_cents for line in lines)

    if total_debits != total_credits:
        raise UnbalancedJournalEntryError(
            f"Unbalanced journal entry rejected! Total debits ({total_debits} cents) != Total credits ({total_credits} cents). "
            f"Idempotency key: {idempotency_key}"
        )

    if total_debits == 0:
        raise AccountingError("Cannot post a zero-value journal entry.")

    now = posted_at or datetime.utcnow()
    entry = models.JournalEntry(
        id=generate_id("jrn"),
        transaction_type=transaction_type,
        reference_id=reference_id,
        idempotency_key=idempotency_key,
        description=description,
        status="posted",
        posted_at=now,
        created_at=now
    )
    db.add(entry)
    db.flush()

    for line_draft in lines:
        line = models.JournalLine(
            id=generate_id("jln"),
            journal_entry_id=entry.id,
            account_code=line_draft.account_code,
            account_name=line_draft.account_name,
            user_id=line_draft.user_id,
            debit_cents=line_draft.debit_cents,
            credit_cents=line_draft.credit_cents,
            created_at=now
        )
        db.add(line)

    db.flush()
    return entry

def verify_trial_balance(db: Session) -> Dict[str, Any]:
    """
    Validates institutional trial balance across all journal lines in the system:
    Asserts: Total Debits == Total Credits.
    Returns account-level summary.
    """
    totals = db.query(
        func.coalesce(func.sum(models.JournalLine.debit_cents), 0),
        func.coalesce(func.sum(models.JournalLine.credit_cents), 0)
    ).first()

    total_debits = totals[0]
    total_credits = totals[1]
    is_balanced = (total_debits == total_credits)

    # Breakdown by account code
    breakdown_rows = db.query(
        models.JournalLine.account_code,
        models.JournalLine.account_name,
        func.sum(models.JournalLine.debit_cents).label("debit_cents"),
        func.sum(models.JournalLine.credit_cents).label("credit_cents")
    ).group_by(models.JournalLine.account_code, models.JournalLine.account_name).all()

    accounts_summary = []
    for row in breakdown_rows:
        accounts_summary.append({
            "account_code": row.account_code,
            "account_name": row.account_name,
            "debit_cents": row.debit_cents or 0,
            "credit_cents": row.credit_cents or 0,
            "net_cents": (row.debit_cents or 0) - (row.credit_cents or 0)
        })

    return {
        "is_balanced": is_balanced,
        "total_debits_cents": total_debits,
        "total_credits_cents": total_credits,
        "difference_cents": total_debits - total_credits,
        "accounts": accounts_summary
    }

def reverse_journal_entry(
    db: Session,
    original_entry_id: str,
    reason: str,
    admin_id: Optional[str] = None
) -> models.JournalEntry:
    """
    Creates a compensating reversal entry. Immutable original entry is marked 'reversed',
    and a compensating entry is posted flipping debits and credits.
    """
    orig = db.query(models.JournalEntry).filter(models.JournalEntry.id == original_entry_id).first()
    if not orig:
        raise AccountingError(f"Journal entry '{original_entry_id}' not found.")
    if orig.status == "reversed":
        raise AccountingError(f"Journal entry '{original_entry_id}' has already been reversed.")

    reversal_lines = []
    for line in orig.lines:
        reversal_lines.append(
            JournalLineDraft(
                account_code=line.account_code,
                debit_cents=line.credit_cents,  # Flip
                credit_cents=line.debit_cents,  # Flip
                user_id=line.user_id
            )
        )

    reversal_entry = post_journal_entry(
        db=db,
        transaction_type="reversal",
        reference_id=orig.id,
        idempotency_key=f"rev_{orig.idempotency_key}",
        description=f"Compensating reversal of {orig.id}: {reason}",
        lines=reversal_lines
    )

    orig.status = "reversed"
    db.flush()

    # Audit log
    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=admin_id or "system",
        action="JOURNAL_ENTRY_REVERSED",
        entity_type="journal_entries",
        entity_id=orig.id,
        detail=f"Reversed via compensating entry {reversal_entry.id}. Reason: {reason}"
    )
    db.add(audit)
    return reversal_entry

# ----------------- Transaction-Specific Posting Helpers -----------------

def post_deposit_journal(db: Session, deposit: models.Deposit) -> models.JournalEntry:
    """
    Posts double-entry record for confirmed deposit:
    Debit:  1010_PLATFORM_OPERATING_CASH (Platform Asset increases)
    Credit: 2010_MEMBER_PRINCIPAL_PAYABLE (Member Principal Liability increases)
    """
    idempotency_key = f"jrn_dep_{deposit.id}"
    lines = [
        JournalLineDraft(
            account_code="1010_PLATFORM_OPERATING_CASH",
            debit_cents=deposit.amount_cents,
            credit_cents=0,
            user_id=None
        ),
        JournalLineDraft(
            account_code="2010_MEMBER_PRINCIPAL_PAYABLE",
            debit_cents=0,
            credit_cents=deposit.amount_cents,
            user_id=deposit.user_id
        )
    ]
    return post_journal_entry(
        db=db,
        transaction_type="deposit",
        reference_id=deposit.id,
        idempotency_key=idempotency_key,
        description=f"Confirmed member deposit ${deposit.amount_cents/100:.2f} USD",
        lines=lines
    )

def post_direct_bonus_journal(
    db: Session,
    deposit_id: str,
    recipient_id: str,
    bonus_amount_cents: int,
    idempotency_key: str
) -> models.JournalEntry:
    """
    Posts double-entry record for direct referral bonus (5%):
    Debit:  5010_DIRECT_BONUS_EXPENSE (Expense increases)
    Credit: 2020_MEMBER_DIRECT_BONUS_PAYABLE (Member Bonus Liability increases)
    """
    jrn_idempotency_key = f"jrn_{idempotency_key}"
    lines = [
        JournalLineDraft(
            account_code="5010_DIRECT_BONUS_EXPENSE",
            debit_cents=bonus_amount_cents,
            credit_cents=0,
            user_id=None
        ),
        JournalLineDraft(
            account_code="2020_MEMBER_DIRECT_BONUS_PAYABLE",
            debit_cents=0,
            credit_cents=bonus_amount_cents,
            user_id=recipient_id
        )
    ]
    return post_journal_entry(
        db=db,
        transaction_type="direct_bonus",
        reference_id=deposit_id,
        idempotency_key=jrn_idempotency_key,
        description=f"Direct referral bonus allocation ${bonus_amount_cents/100:.2f} USD",
        lines=lines
    )

def post_level_commission_journal(
    db: Session,
    deposit_id: str,
    ancestor_id: str,
    level: int,
    comm_amount_cents: int,
    idempotency_key: str
) -> models.JournalEntry:
    """
    Posts double-entry record for multi-tier level commission:
    Debit:  5020_LEVEL_COMMISSION_EXPENSE (Expense increases)
    Credit: 2030_MEMBER_LEVEL_COMMISSION_PAYABLE (Member Commission Liability increases)
    """
    jrn_idempotency_key = f"jrn_{idempotency_key}"
    lines = [
        JournalLineDraft(
            account_code="5020_LEVEL_COMMISSION_EXPENSE",
            debit_cents=comm_amount_cents,
            credit_cents=0,
            user_id=None
        ),
        JournalLineDraft(
            account_code="2030_MEMBER_LEVEL_COMMISSION_PAYABLE",
            debit_cents=0,
            credit_cents=comm_amount_cents,
            user_id=ancestor_id
        )
    ]
    return post_journal_entry(
        db=db,
        transaction_type="level_commission",
        reference_id=deposit_id,
        idempotency_key=jrn_idempotency_key,
        description=f"Level {level} referral commission allocation ${comm_amount_cents/100:.2f} USD",
        lines=lines
    )

def post_monthly_cycle_journal(
    db: Session,
    deposit_id: str,
    user_id: str,
    month_key: str,
    roi_cents: int,
    principal_cents: int,
    cycle_key: str
) -> List[models.JournalEntry]:
    """
    Posts double-entry records for monthly cycle performance:
    1. ROI Allocation:
       Debit:  5030_ROI_DISTRIBUTION_EXPENSE
       Credit: 2040_MEMBER_ROI_PAYABLE
    2. Principal Growth Allocation:
       Debit:  5040_PRINCIPAL_GROWTH_EXPENSE
       Credit: 2050_MEMBER_PRINCIPAL_CREDIT_PAYABLE
    """
    entries = []
    if roi_cents > 0:
        lines_roi = [
            JournalLineDraft(
                account_code="5030_ROI_DISTRIBUTION_EXPENSE",
                debit_cents=roi_cents,
                credit_cents=0,
                user_id=None
            ),
            JournalLineDraft(
                account_code="2040_MEMBER_ROI_PAYABLE",
                debit_cents=0,
                credit_cents=roi_cents,
                user_id=user_id
            )
        ]
        entries.append(
            post_journal_entry(
                db=db,
                transaction_type="monthly_roi",
                reference_id=deposit_id,
                idempotency_key=f"jrn_roi_{cycle_key}",
                description=f"Monthly ROI distribution ({month_key}) ${roi_cents/100:.2f} USD",
                lines=lines_roi
            )
        )

    if principal_cents > 0:
        lines_prn = [
            JournalLineDraft(
                account_code="5040_PRINCIPAL_GROWTH_EXPENSE",
                debit_cents=principal_cents,
                credit_cents=0,
                user_id=None
            ),
            JournalLineDraft(
                account_code="2050_MEMBER_PRINCIPAL_CREDIT_PAYABLE",
                debit_cents=0,
                credit_cents=principal_cents,
                user_id=user_id
            )
        ]
        entries.append(
            post_journal_entry(
                db=db,
                transaction_type="monthly_principal",
                reference_id=deposit_id,
                idempotency_key=f"jrn_prn_{cycle_key}",
                description=f"Monthly principal credit distribution ({month_key}) ${principal_cents/100:.2f} USD",
                lines=lines_prn
            )
        )

    return entries

def post_withdrawal_journal(
    db: Session,
    withdrawal: models.Withdrawal,
    bucket_deductions: Dict[str, int]
) -> models.JournalEntry:
    """
    Posts double-entry record for approved withdrawal:
    Debits:  Member payable liability buckets corresponding to deducted balances:
             - 2020_MEMBER_DIRECT_BONUS_PAYABLE
             - 2030_MEMBER_LEVEL_COMMISSION_PAYABLE
             - 2040_MEMBER_ROI_PAYABLE
             - 2050_MEMBER_PRINCIPAL_CREDIT_PAYABLE
             - 2010_MEMBER_PRINCIPAL_PAYABLE
    Credit:  1010_PLATFORM_OPERATING_CASH (Platform Asset decreases by payout amount)
    """
    account_map = {
        "direct_bonus_cents": "2020_MEMBER_DIRECT_BONUS_PAYABLE",
        "level_commission_cents": "2030_MEMBER_LEVEL_COMMISSION_PAYABLE",
        "roi_balance_cents": "2040_MEMBER_ROI_PAYABLE",
        "principal_credits_cents": "2050_MEMBER_PRINCIPAL_CREDIT_PAYABLE",
        "original_principal_cents": "2010_MEMBER_PRINCIPAL_PAYABLE"
    }

    lines: List[JournalLineDraft] = []
    total_deducted = 0

    for bucket_name, deducted_cents in bucket_deductions.items():
        if deducted_cents > 0:
            acct_code = account_map.get(bucket_name)
            if not acct_code:
                continue
            lines.append(
                JournalLineDraft(
                    account_code=acct_code,
                    debit_cents=deducted_cents,
                    credit_cents=0,
                    user_id=withdrawal.user_id
                )
            )
            total_deducted += deducted_cents

    if total_deducted != withdrawal.amount_cents:
        raise AccountingError(
            f"Withdrawal deduction sum ({total_deducted} cents) does not match withdrawal request amount ({withdrawal.amount_cents} cents)."
        )

    lines.append(
        JournalLineDraft(
            account_code="1010_PLATFORM_OPERATING_CASH",
            debit_cents=0,
            credit_cents=total_deducted,
            user_id=None
        )
    )

    return post_journal_entry(
        db=db,
        transaction_type="withdrawal",
        reference_id=withdrawal.id,
        idempotency_key=f"jrn_wd_{withdrawal.id}",
        description=f"Approved member withdrawal payout ${withdrawal.amount_cents/100:.2f} USD",
        lines=lines
    )

# ----------------- Reconciliation Utilities -----------------

def reconcile_user_subledger(db: Session, user_id: str) -> Dict[str, Any]:
    """
    Verifies that the user's wallet buckets match their net double-entry subledger positions:
    Net Position = sum(Credits) - sum(Debits) for each liability account.
    """
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == user_id).first()
    if not wallet:
        return {"reconciled": True, "user_id": user_id, "discrepancies": []}

    account_to_wallet_attr = {
        "2010_MEMBER_PRINCIPAL_PAYABLE": "original_principal_cents",
        "2020_MEMBER_DIRECT_BONUS_PAYABLE": "direct_bonus_cents",
        "2030_MEMBER_LEVEL_COMMISSION_PAYABLE": "level_commission_cents",
        "2040_MEMBER_ROI_PAYABLE": "roi_balance_cents",
        "2050_MEMBER_PRINCIPAL_CREDIT_PAYABLE": "principal_credits_cents"
    }

    discrepancies = []
    for acct_code, wallet_attr in account_to_wallet_attr.items():
        row = db.query(
            func.coalesce(func.sum(models.JournalLine.credit_cents), 0),
            func.coalesce(func.sum(models.JournalLine.debit_cents), 0)
        ).filter(
            models.JournalLine.account_code == acct_code,
            models.JournalLine.user_id == user_id
        ).first()

        subledger_net = (row[0] or 0) - (row[1] or 0)
        wallet_val = getattr(wallet, wallet_attr)

        if subledger_net != wallet_val:
            discrepancies.append({
                "account_code": acct_code,
                "wallet_attribute": wallet_attr,
                "subledger_net_cents": subledger_net,
                "wallet_cents": wallet_val,
                "difference_cents": wallet_val - subledger_net
            })

    return {
        "user_id": user_id,
        "reconciled": len(discrepancies) == 0,
        "discrepancies": discrepancies
    }

def reconcile_system_wide(db: Session) -> Dict[str, Any]:
    """
    Performs full institutional reconciliation:
    1. Trial balance verification (Total Debits == Total Credits).
    2. Subledger reconciliation across every wallet in the system.
    """
    tb = verify_trial_balance(db)
    wallets = db.query(models.Wallet).all()
    user_discrepancies = []

    for w in wallets:
        res = reconcile_user_subledger(db, w.user_id)
        if not res["reconciled"]:
            user_discrepancies.append(res)

    is_fully_reconciled = tb["is_balanced"] and len(user_discrepancies) == 0

    return {
        "is_fully_reconciled": is_fully_reconciled,
        "trial_balance": tb,
        "wallet_discrepancies_count": len(user_discrepancies),
        "wallet_discrepancies": user_discrepancies
    }

def backfill_legacy_entries(db: Session) -> int:
    """
    Backfills double-entry journal entries for pre-existing legacy transactions
    to achieve 100% historical subledger reconciliation.
    """
    backfilled_count = 0

    # 1. Confirmed deposits
    confirmed_deposits = db.query(models.Deposit).filter(models.Deposit.status == "confirmed").all()
    for dep in confirmed_deposits:
        existing = db.query(models.JournalEntry).filter(
            models.JournalEntry.transaction_type == "deposit",
            models.JournalEntry.reference_id == dep.id
        ).first()
        if not existing:
            post_deposit_journal(db, dep)
            backfilled_count += 1

    # 2. Credited commissions
    credited_comms = db.query(models.Commission).filter(models.Commission.status == "credited").all()
    for comm in credited_comms:
        if comm.commission_type == "direct_bonus":
            existing = db.query(models.JournalEntry).filter(
                models.JournalEntry.transaction_type == "direct_bonus",
                models.JournalEntry.idempotency_key == f"jrn_{comm.idempotency_key}"
            ).first()
            if not existing:
                post_direct_bonus_journal(
                    db=db,
                    deposit_id=comm.deposit_id,
                    recipient_id=comm.recipient_user_id,
                    bonus_amount_cents=comm.amount_cents,
                    idempotency_key=comm.idempotency_key
                )
                backfilled_count += 1
        elif comm.commission_type == "level_commission":
            existing = db.query(models.JournalEntry).filter(
                models.JournalEntry.transaction_type == "level_commission",
                models.JournalEntry.idempotency_key == f"jrn_{comm.idempotency_key}"
            ).first()
            if not existing:
                post_level_commission_journal(
                    db=db,
                    deposit_id=comm.deposit_id,
                    ancestor_id=comm.recipient_user_id,
                    level=comm.level,
                    comm_amount_cents=comm.amount_cents,
                    idempotency_key=comm.idempotency_key
                )
                backfilled_count += 1

    # 3. Monthly cycle entries
    cycle_entries = db.query(models.MonthlyCycleEntry).all()
    for ce in cycle_entries:
        existing_roi = db.query(models.JournalEntry).filter(
            models.JournalEntry.transaction_type == "monthly_roi",
            models.JournalEntry.idempotency_key == f"jrn_roi_{ce.cycle_key}"
        ).first()
        if not existing_roi:
            month_key = ce.cycle_key.split("_")[-1] if "_" in ce.cycle_key else "historical"
            post_monthly_cycle_journal(
                db=db,
                deposit_id=ce.deposit_id,
                user_id=ce.user_id,
                month_key=month_key,
                roi_cents=ce.roi_cents,
                principal_cents=ce.principal_cents,
                cycle_key=ce.cycle_key
            )
            backfilled_count += 1

    # 4. Approved withdrawals
    approved_withdrawals = db.query(models.Withdrawal).filter(models.Withdrawal.status == "approved").all()
    for w in approved_withdrawals:
        existing_wd = db.query(models.JournalEntry).filter(
            models.JournalEntry.transaction_type == "withdrawal",
            models.JournalEntry.reference_id == w.id
        ).first()
        if not existing_wd:
            # Default to principal liability deduction if portions unspecified
            deductions = {"original_principal_cents": w.amount_cents}
            post_withdrawal_journal(db=db, withdrawal=w, bucket_deductions=deductions)
            backfilled_count += 1

    db.commit()
    return backfilled_count

