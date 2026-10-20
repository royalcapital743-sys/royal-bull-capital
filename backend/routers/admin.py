import json
import uuid
from datetime import datetime
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import security
from commission_engine import process_deposit_commissions
from cycle_engine import run_monthly_cycle
import accounting

router = APIRouter(prefix="/api/admin", tags=["Admin Console"])

def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

@router.get("/overview")
def get_admin_overview(
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    total_users = db.query(models.User).count()
    active_users = db.query(models.User).filter(models.User.status == "active").count()

    deposits = db.query(models.Deposit).filter(models.Deposit.status == "confirmed").all()
    total_deposits_cents = sum(d.amount_cents for d in deposits)

    pending_deposits_count = db.query(models.Deposit).filter(models.Deposit.status == "pending").count()

    commissions = db.query(models.Commission).filter(models.Commission.status == "credited").all()
    total_commissions_cents = sum(c.amount_cents for c in commissions)

    pending_withdrawals = db.query(models.Withdrawal).filter(models.Withdrawal.status == "pending").all()
    pending_withdrawals_count = len(pending_withdrawals)
    pending_withdrawals_cents = sum(w.amount_cents for w in pending_withdrawals)

    approved_withdrawals = db.query(models.Withdrawal).filter(models.Withdrawal.status == "approved").all()
    paid_withdrawals_cents = sum(w.amount_cents for w in approved_withdrawals)

    open_tickets = db.query(models.SupportTicket).filter(models.SupportTicket.status.in_(["open", "in_progress"])).count()

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_deposits_cents": total_deposits_cents,
        "total_deposits_usd": total_deposits_cents / 100.0,
        "pending_deposits_count": pending_deposits_count,
        "total_commissions_cents": total_commissions_cents,
        "total_commissions_usd": total_commissions_cents / 100.0,
        "pending_withdrawals_count": pending_withdrawals_count,
        "pending_withdrawals_cents": pending_withdrawals_cents,
        "pending_withdrawals_usd": pending_withdrawals_cents / 100.0,
        "paid_withdrawals_cents": paid_withdrawals_cents,
        "paid_withdrawals_usd": paid_withdrawals_cents / 100.0,
        "open_tickets_count": open_tickets
    }

@router.get("/users")
def list_users(
    search: str | None = None,
    role: str | None = None,
    status_filter: str | None = None,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(models.User)
    if search:
        s = f"%{search.strip().lower()}%"
        query = query.filter((models.User.name.ilike(s)) | (models.User.email.ilike(s)) | (models.User.referral_code.ilike(s)))
    if role:
        query = query.filter(models.User.role == role)
    if status_filter:
        query = query.filter(models.User.status == status_filter)

    users = query.order_by(models.User.created_at.desc()).limit(100).all()

    res = []
    for u in users:
        w = u.wallet or models.Wallet(user_id=u.id)
        ref_parent = db.query(models.User).filter(models.User.id == u.referrer_id).first() if u.referrer_id else None
        res.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role,
            "referral_code": u.referral_code,
            "referrer_name": ref_parent.name if ref_parent else None,
            "status": u.status,
            "balance_usd": w.total_balance_cents / 100.0,
            "created_at": u.created_at
        })
    return res

@router.patch("/users/{user_id}/status")
def toggle_user_status(
    user_id: str,
    req: schemas.AdminUserStatusUpdate,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    user.status = req.status
    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=admin.id,
        action="USER_STATUS_UPDATED",
        entity_type="users",
        entity_id=user.id,
        detail=f"Status set to '{req.status}' by {admin.name}"
    )
    db.add(audit)
    db.commit()
    return {"message": f"User status set to {req.status}."}

@router.get("/deposits")
def list_all_deposits(
    status_filter: str | None = None,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    q = db.query(models.Deposit)
    if status_filter:
        q = q.filter(models.Deposit.status == status_filter)
    deposits = q.order_by(models.Deposit.created_at.desc()).limit(100).all()

    res = []
    for d in deposits:
        u = d.user
        res.append({
            "id": d.id,
            "user_id": d.user_id,
            "user_name": u.name if u else "Unknown",
            "user_email": u.email if u else "Unknown",
            "amount_cents": d.amount_cents,
            "amount_usd": d.amount_cents / 100.0,
            "status": d.status,
            "note": d.note,
            "created_at": d.created_at,
            "confirmed_at": d.confirmed_at
        })
    return res

@router.post("/deposits/{deposit_id}/review")
def review_deposit(
    deposit_id: str,
    req: schemas.DepositReviewRequest,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    deposit = db.query(models.Deposit).filter(models.Deposit.id == deposit_id).first()
    if not deposit:
        raise HTTPException(status_code=404, detail="Deposit not found.")
    if deposit.status == "confirmed":
        return {"status": "confirmed", "message": "Deposit is already confirmed."}
    if deposit.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending deposits can be reviewed.")

    now = datetime.utcnow()
    if not req.success:
        deposit.status = "failed"
        deposit.updated_at = now
        audit = models.AuditLog(
            id=generate_id("aud"),
            admin_id=admin.id,
            action="DEPOSIT_REJECTED",
            entity_type="deposits",
            entity_id=deposit.id,
            detail=req.rejection_reason or "Deposit rejected by administrator."
        )
        db.add(audit)
        db.commit()
        return {"status": "failed", "message": "Deposit marked as failed."}

    # 1. Mark confirmed
    deposit.status = "confirmed"
    deposit.confirmed_at = now
    deposit.updated_at = now

    # 2. Credit principal to depositor wallet
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == deposit.user_id).first()
    if not wallet:
        wallet = models.Wallet(user_id=deposit.user_id)
        db.add(wallet)
        db.flush()

    wallet.original_principal_cents += deposit.amount_cents

    # 3. Post double-entry journal entry (Operating Cash Asset -> Member Principal Liability)
    accounting.post_deposit_journal(db=db, deposit=deposit)

    # 4. Add statement ledger entry for depositor
    ledger = models.LedgerEntry(
        id=generate_id("led"),
        user_id=deposit.user_id,
        entry_type="deposit",
        amount_cents=deposit.amount_cents,
        balance_after_cents=wallet.total_balance_cents,
        description=f"Simulated deposit confirmed (${deposit.amount_cents/100:.2f})",
        reference_id=deposit.id,
        idempotency_key=f"dep_cred_{deposit.id}"
    )
    db.add(ledger)

    # 4. In-app notification for depositor
    notif = models.Notification(
        id=generate_id("notif"),
        user_id=deposit.user_id,
        title="Deposit Confirmed",
        message=f"Your deposit of ${deposit.amount_cents/100:.2f} has been verified and funded.",
        notif_type="deposit"
    )
    db.add(notif)

    # 5. Process Multi-tier Referral Commissions (Direct 5% + 10 Levels)
    comms = process_deposit_commissions(db, deposit)

    # 6. Audit log
    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=admin.id,
        action="DEPOSIT_CONFIRMED",
        entity_type="deposits",
        entity_id=deposit.id,
        detail=f"Approved ${deposit.amount_cents/100:.2f} USD. Generated {len(comms)} commission allocations."
    )
    db.add(audit)

    db.commit()
    return {
        "status": "confirmed",
        "commissions_count": len(comms),
        "message": f"Deposit confirmed successfully. Distributed {len(comms)} commissions across referral tree."
    }

@router.get("/withdrawals")
def list_all_withdrawals(
    status_filter: str | None = None,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    q = db.query(models.Withdrawal)
    if status_filter:
        q = q.filter(models.Withdrawal.status == status_filter)
    withdrawals = q.order_by(models.Withdrawal.created_at.desc()).limit(100).all()

    res = []
    for w in withdrawals:
        u = w.user
        res.append({
            "id": w.id,
            "user_id": w.user_id,
            "user_name": u.name if u else "Unknown",
            "user_email": u.email if u else "Unknown",
            "amount_cents": w.amount_cents,
            "amount_usd": w.amount_cents / 100.0,
            "status": w.status,
            "month_key": w.month_key,
            "is_early_withdrawal": w.is_early_withdrawal,
            "payout_method": w.payout_method,
            "payout_details": w.payout_details,
            "rejection_reason": w.rejection_reason,
            "created_at": w.created_at,
            "reviewed_at": w.reviewed_at
        })
    return res

@router.post("/withdrawals/{withdrawal_id}/review")
def review_withdrawal(
    withdrawal_id: str,
    req: schemas.WithdrawalReviewRequest,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    w = db.query(models.Withdrawal).filter(models.Withdrawal.id == withdrawal_id).first()
    if not w:
        raise HTTPException(status_code=404, detail="Withdrawal request not found.")
    if w.status != "pending":
        raise HTTPException(status_code=400, detail="Only pending withdrawals can be reviewed.")

    now = datetime.utcnow()
    user = w.user
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == w.user_id).first()

    if not req.approve:
        w.status = "rejected"
        w.rejection_reason = req.rejection_reason or "Declined by administrator."
        w.reviewed_by = admin.id
        w.reviewed_at = now

        notif = models.Notification(
            id=generate_id("notif"),
            user_id=w.user_id,
            title="Withdrawal Request Declined",
            message=f"Your withdrawal of ${w.amount_cents/100:.2f} was rejected: {w.rejection_reason}",
            notif_type="withdrawal"
        )
        db.add(notif)

        audit = models.AuditLog(
            id=generate_id("aud"),
            admin_id=admin.id,
            action="WITHDRAWAL_REJECTED",
            entity_type="withdrawals",
            entity_id=w.id,
            detail=w.rejection_reason
        )
        db.add(audit)
        db.commit()
        return {"status": "rejected", "message": "Withdrawal rejected."}

    # Verify balance is still sufficient
    if not wallet or wallet.total_balance_cents < w.amount_cents:
        raise HTTPException(status_code=400, detail="User has insufficient wallet balance to fulfill this withdrawal.")

    # Deduct from buckets
    buckets = [
        "direct_bonus_cents",
        "level_commission_cents",
        "roi_balance_cents",
        "principal_credits_cents",
        "original_principal_cents"
    ]
    remaining = w.amount_cents
    bucket_deductions = {}
    for bucket_attr in buckets:
        cur_val = getattr(wallet, bucket_attr)
        deduct = min(cur_val, remaining)
        if deduct > 0:
            setattr(wallet, bucket_attr, cur_val - deduct)
            remaining -= deduct
            bucket_deductions[bucket_attr] = deduct
        if remaining <= 0:
            break

    wallet.withdrawn_total_cents += w.amount_cents
    w.status = "approved"
    w.reviewed_by = admin.id
    w.reviewed_at = now

    # Post double-entry journal entry (Member Liability Buckets -> Platform Cash Asset)
    accounting.post_withdrawal_journal(
        db=db,
        withdrawal=w,
        bucket_deductions=bucket_deductions
    )

    # Legacy statement ledger entry (negative debit)
    ledger = models.LedgerEntry(
        id=generate_id("led"),
        user_id=w.user_id,
        entry_type="withdrawal",
        amount_cents=-w.amount_cents,
        balance_after_cents=wallet.total_balance_cents,
        description=f"Approved simulated payout (${w.amount_cents/100:.2f} USD)",
        reference_id=w.id,
        idempotency_key=f"wd_pay_{w.id}"
    )
    db.add(ledger)

    notif = models.Notification(
        id=generate_id("notif"),
        user_id=w.user_id,
        title="Withdrawal Approved",
        message=f"Your payout request of ${w.amount_cents/100:.2f} has been approved.",
        notif_type="withdrawal"
    )
    db.add(notif)

    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=admin.id,
        action="WITHDRAWAL_APPROVED",
        entity_type="withdrawals",
        entity_id=w.id,
        detail=f"Approved payout of ${w.amount_cents/100:.2f} USD for user {user.email if user else 'Unknown'}."
    )
    db.add(audit)

    db.commit()
    return {"status": "approved", "message": "Withdrawal approved and funds deducted from ledger."}

@router.post("/monthly-cycle")
def execute_monthly_cycle(
    req: schemas.MonthlyCycleRequest,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    cycle_run = run_monthly_cycle(db, admin_id=admin.id, specific_month=req.month_key)
    return {
        "id": cycle_run.id,
        "month_key": cycle_run.month_key,
        "total_eligible_deposits": cycle_run.total_eligible_deposits,
        "total_roi_usd": cycle_run.total_roi_cents / 100.0,
        "total_principal_usd": cycle_run.total_principal_cents / 100.0,
        "status": cycle_run.status,
        "message": f"Successfully simulated monthly cycle for {cycle_run.month_key}."
    }

@router.get("/monthly-cycles")
def list_monthly_cycles(
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    runs = db.query(models.MonthlyCycleRun).order_by(models.MonthlyCycleRun.executed_at.desc()).all()
    return [
        {
            "id": r.id,
            "month_key": r.month_key,
            "total_eligible_deposits": r.total_eligible_deposits,
            "total_roi_usd": r.total_roi_cents / 100.0,
            "total_principal_usd": r.total_principal_cents / 100.0,
            "status": r.status,
            "executed_at": r.executed_at
        }
        for r in runs
    ]

@router.get("/rules", response_model=schemas.SystemRuleResponse)
def get_system_rules(
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    if not rules:
        rules = models.SystemRule(id="global")
        db.add(rules)
        db.commit()
        db.refresh(rules)

    return {
        "direct_bonus": float(rules.direct_bonus),
        "level_rates": rules.get_level_rates(),
        "monthly_roi": float(rules.monthly_roi),
        "monthly_principal": float(rules.monthly_principal),
        "minimum_deposit": float(rules.minimum_deposit),
        "min_withdrawal": float(rules.min_withdrawal),
        "max_withdrawal": float(rules.max_withdrawal),
        "demo_mode_active": rules.demo_mode_active,
        "last_monthly_run": rules.last_monthly_run
    }

@router.post("/rules", response_model=schemas.SystemRuleResponse)
def update_system_rules(
    req: schemas.SystemRuleUpdate,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    if not rules:
        rules = models.SystemRule(id="global")
        db.add(rules)

    if req.direct_bonus is not None:
        rules.direct_bonus = Decimal(str(req.direct_bonus))
    if req.level_rates is not None:
        if len(req.level_rates) != 10:
            raise HTTPException(status_code=400, detail="Must provide exactly 10 level commission rates.")
        rules.level_rates = json.dumps(req.level_rates)
    if req.monthly_roi is not None:
        rules.monthly_roi = Decimal(str(req.monthly_roi))
    if req.monthly_principal is not None:
        rules.monthly_principal = Decimal(str(req.monthly_principal))
    if req.minimum_deposit is not None:
        rules.minimum_deposit = Decimal(str(req.minimum_deposit))
    if req.min_withdrawal is not None:
        rules.min_withdrawal = Decimal(str(req.min_withdrawal))
    if req.max_withdrawal is not None:
        rules.max_withdrawal = Decimal(str(req.max_withdrawal))

    rules.updated_at = datetime.utcnow()

    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=admin.id,
        action="SYSTEM_RULES_UPDATED",
        entity_type="system_rules",
        entity_id="global",
        detail="Commission percentages and simulation parameters updated."
    )
    db.add(audit)
    db.commit()
    db.refresh(rules)

    return {
        "direct_bonus": float(rules.direct_bonus),
        "level_rates": rules.get_level_rates(),
        "monthly_roi": float(rules.monthly_roi),
        "monthly_principal": float(rules.monthly_principal),
        "minimum_deposit": float(rules.minimum_deposit),
        "min_withdrawal": float(rules.min_withdrawal),
        "max_withdrawal": float(rules.max_withdrawal),
        "demo_mode_active": rules.demo_mode_active,
        "last_monthly_run": rules.last_monthly_run
    }

@router.get("/audit-logs", response_model=list[schemas.AuditLogResponse])
def get_audit_logs(
    limit: int = 100,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    return db.query(models.AuditLog).order_by(models.AuditLog.created_at.desc()).limit(limit).all()

@router.get("/tickets", response_model=list[schemas.SupportTicketResponse])
def list_all_tickets(
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    tickets = db.query(models.SupportTicket).order_by(models.SupportTicket.updated_at.desc()).all()
    res = []
    for t in tickets:
        u = t.user
        msgs = [
            schemas.SupportMessageResponse(
                id=m.id,
                ticket_id=m.ticket_id,
                sender_id=m.sender_id,
                sender_name=m.sender.name if m.sender else "Support",
                sender_role=m.sender_role,
                message=m.message,
                created_at=m.created_at
            )
            for m in t.messages
        ]
        res.append(schemas.SupportTicketResponse(
            id=t.id,
            user_id=t.user_id,
            user_name=u.name if u else "Unknown",
            subject=t.subject,
            category=t.category,
            priority=t.priority,
            status=t.status,
            created_at=t.created_at,
            updated_at=t.updated_at,
            messages=msgs
        ))
    return res

@router.post("/tickets/{ticket_id}/reply")
def reply_support_ticket(
    ticket_id: str,
    req: schemas.SupportMessageCreateRequest,
    ticket_status: str | None = None,
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    ticket = db.query(models.SupportTicket).filter(models.SupportTicket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found.")

    msg = models.SupportMessage(
        id=generate_id("msg"),
        ticket_id=ticket.id,
        sender_id=admin.id,
        sender_role="admin",
        message=req.message,
        created_at=datetime.utcnow()
    )
    db.add(msg)

    ticket.updated_at = datetime.utcnow()
    if ticket_status:
        ticket.status = ticket_status
    else:
        ticket.status = "in_progress"

    # Notify ticket owner
    notif = models.Notification(
        id=generate_id("notif"),
        user_id=ticket.user_id,
        title=f"Support Reply: {ticket.subject[:30]}...",
        message=f"Administrator replied to your support ticket: '{req.message[:60]}...'",
        notif_type="system"
    )
    db.add(notif)
    db.commit()

    return {"message": "Reply posted successfully.", "ticket_status": ticket.status}

@router.post("/purge-test-data")
@router.post("/reset-demo")
def purge_test_data(
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    import seed
    seed.reset_and_seed_production_data(db)
    return {"message": "Database successfully reset to clean production baseline. All test data removed."}

# ----------------- Double-Entry Accounting Audit Endpoints -----------------

@router.get("/accounting/trial-balance")
def get_accounting_trial_balance(
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    """
    Returns the general ledger trial balance with account breakdown.
    Enforces that sum(Debits) == sum(Credits).
    """
    return accounting.verify_trial_balance(db)

@router.get("/accounting/reconciliation")
def get_accounting_reconciliation(
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    """
    Runs full institutional reconciliation between double-entry subledgers and customer wallets.
    """
    return accounting.reconcile_system_wide(db)

@router.post("/accounting/reverse/{entry_id}")
def reverse_journal_entry_endpoint(
    entry_id: str,
    reason: str = Query(..., description="Audit reason for reversing this journal entry"),
    admin: models.User = Depends(security.require_admin),
    db: Session = Depends(get_db)
):
    """
    Creates a compensating reversal entry. Immutable original entry is preserved and marked 'reversed'.
    """
    try:
        reversal = accounting.reverse_journal_entry(
            db=db,
            original_entry_id=entry_id,
            reason=reason,
            admin_id=admin.id
        )
        db.commit()
        return {
            "status": "reversed",
            "original_entry_id": entry_id,
            "reversal_entry_id": reversal.id,
            "message": f"Compensating reversal {reversal.id} posted successfully."
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

