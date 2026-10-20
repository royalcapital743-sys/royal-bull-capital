import uuid
from datetime import datetime
from decimal import Decimal, ROUND_HALF_UP
from sqlalchemy.orm import Session
import models
import accounting

def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

def run_monthly_cycle(db: Session, admin_id: str | None = None, specific_month: str | None = None) -> models.MonthlyCycleRun:
    """
    Executes the monthly simulated allocation:
    - 5% monthly ROI simulation credited to roi_balance
    - 5% additional principal credit credited to principal_credits
    Ensures strict idempotency: each deposit can only receive one cycle allocation per calendar month.
    """
    now = datetime.utcnow()
    month_key = specific_month or f"{now.year}-{now.month:02d}"

    # Fetch global rules
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    if not rules:
        rules = models.SystemRule(id="global")
        db.add(rules)
        db.flush()

    roi_rate = Decimal(str(rules.monthly_roi))
    principal_rate = Decimal(str(rules.monthly_principal))

    # Retrieve or create cycle run record
    run = db.query(models.MonthlyCycleRun).filter(models.MonthlyCycleRun.month_key == month_key).first()
    if not run:
        run = models.MonthlyCycleRun(
            id=generate_id("run"),
            month_key=month_key,
            admin_id=admin_id,
            total_eligible_deposits=0,
            total_roi_cents=0,
            total_principal_cents=0,
            status="completed",
            executed_at=now
        )
        db.add(run)
        db.flush()

    # Query all confirmed deposits
    confirmed_deposits = db.query(models.Deposit).filter(models.Deposit.status == "confirmed").all()
    processed_count = 0
    cycle_total_roi = 0
    cycle_total_principal = 0

    for deposit in confirmed_deposits:
        cycle_key = f"{deposit.id}_{month_key}"
        existing_entry = db.query(models.MonthlyCycleEntry).filter(
            models.MonthlyCycleEntry.cycle_key == cycle_key
        ).first()

        if existing_entry:
            # Already allocated for this deposit in this month
            continue

        deposit_amt = Decimal(deposit.amount_cents)
        roi_cents = int((deposit_amt * roi_rate / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
        principal_cents = int((deposit_amt * principal_rate / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

        # Update wallet
        wallet = db.query(models.Wallet).filter(models.Wallet.user_id == deposit.user_id).first()
        if not wallet:
            wallet = models.Wallet(user_id=deposit.user_id)
            db.add(wallet)
            db.flush()

        wallet.roi_balance_cents += roi_cents
        wallet.principal_credits_cents += principal_cents

        # Create cycle entry
        entry = models.MonthlyCycleEntry(
            id=generate_id("cyc"),
            run_id=run.id,
            cycle_key=cycle_key,
            deposit_id=deposit.id,
            user_id=deposit.user_id,
            roi_cents=roi_cents,
            principal_cents=principal_cents,
            created_at=now
        )
        db.add(entry)

        # Double-entry ledger postings (ROI expense -> ROI payable, Principal expense -> Principal payable)
        accounting.post_monthly_cycle_journal(
            db=db,
            deposit_id=deposit.id,
            user_id=deposit.user_id,
            month_key=month_key,
            roi_cents=roi_cents,
            principal_cents=principal_cents,
            cycle_key=cycle_key
        )

        # Legacy statement ledger entries
        roi_ledger = models.LedgerEntry(
            id=generate_id("led"),
            user_id=deposit.user_id,
            entry_type="roi_credit",
            amount_cents=roi_cents,
            balance_after_cents=wallet.total_balance_cents,
            description=f"Monthly simulated ROI credit ({roi_rate}%) — {month_key}",
            reference_id=deposit.id,
            idempotency_key=f"roi_{cycle_key}"
        )
        db.add(roi_ledger)

        principal_ledger = models.LedgerEntry(
            id=generate_id("led"),
            user_id=deposit.user_id,
            entry_type="principal_credit",
            amount_cents=principal_cents,
            balance_after_cents=wallet.total_balance_cents,
            description=f"Monthly simulated principal growth credit ({principal_rate}%) — {month_key}",
            reference_id=deposit.id,
            idempotency_key=f"prn_{cycle_key}"
        )
        db.add(principal_ledger)

        # User notification
        notif = models.Notification(
            id=generate_id("notif"),
            user_id=deposit.user_id,
            title=f"Monthly Performance Credited — {month_key}",
            message=f"Received ${roi_cents/100:.2f} ROI credit and ${principal_cents/100:.2f} principal credit for {month_key}.",
            notif_type="cycle"
        )
        db.add(notif)

        processed_count += 1
        cycle_total_roi += roi_cents
        cycle_total_principal += principal_cents

    run.total_eligible_deposits += processed_count
    run.total_roi_cents += cycle_total_roi
    run.total_principal_cents += cycle_total_principal
    rules.last_monthly_run = now

    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=admin_id or "system",
        action="MONTHLY_CYCLE_EXECUTED",
        entity_type="monthly_cycle_runs",
        entity_id=run.id,
        detail=f"Month {month_key}: processed {processed_count} deposits. Total ROI: ${cycle_total_roi/100:.2f}, Principal: ${cycle_total_principal/100:.2f}."
    )
    db.add(audit)
    db.commit()
    db.refresh(run)
    return run
