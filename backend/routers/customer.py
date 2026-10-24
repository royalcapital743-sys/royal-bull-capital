import uuid
from datetime import datetime
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import security
from commission_engine import check_user_qualification

router = APIRouter(prefix="/api/customer", tags=["Customer Portal"])

def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

@router.get("/profile", response_model=schemas.ProfileResponse)
def get_customer_profile(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == current_user.id).first()
    if not wallet:
        wallet = models.Wallet(user_id=current_user.id)
        db.add(wallet)
        db.commit()
        db.refresh(wallet)

    directs = db.query(models.User).filter(
        models.User.referrer_id == current_user.id,
        models.User.status == "active"
    ).all()
    direct_count = len(directs)

    qualified_count = 0
    for child in directs:
        has_funded = db.query(models.Deposit).filter(
            models.Deposit.user_id == child.id,
            models.Deposit.status == "confirmed"
        ).first() is not None
        if has_funded:
            qualified_count += 1

    is_qualified = qualified_count >= 2

    # Calculate total network count (up to 10 tiers)
    network_users = set()
    current_tier_ids = [d.id for d in directs]
    for _ in range(10):
        if not current_tier_ids:
            break
        network_users.update(current_tier_ids)
        next_tier = db.query(models.User.id).filter(
            models.User.referrer_id.in_(current_tier_ids),
            models.User.status == "active"
        ).all()
        current_tier_ids = [row[0] for row in next_tier]

    return {
        "user": current_user,
        "wallet": {
            "user_id": wallet.user_id,
            "original_principal_cents": wallet.original_principal_cents,
            "principal_credits_cents": wallet.principal_credits_cents,
            "roi_balance_cents": wallet.roi_balance_cents,
            "direct_bonus_cents": wallet.direct_bonus_cents,
            "level_commission_cents": wallet.level_commission_cents,
            "withdrawn_total_cents": wallet.withdrawn_total_cents,
            "total_balance_cents": wallet.total_balance_cents,
            "withdrawable_balance_cents": wallet.withdrawable_balance_cents,
        },
        "direct_referrals_count": direct_count,
        "qualified_referrals_count": qualified_count,
        "is_qualified": is_qualified,
        "total_network_count": len(network_users)
    }

@router.get("/referrals", response_model=schemas.ReferralNetworkResponse)
def get_referral_network(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    rates = rules.get_level_rates() if rules else [20, 15, 10, 8, 7, 6, 5, 4, 3, 2]

    directs = db.query(models.User).filter(
        models.User.referrer_id == current_user.id,
        models.User.status == "active"
    ).all()

    qualified_direct_count = 0
    members: list[schemas.ReferralNode] = []
    level_summaries: list[schemas.ReferralLevelSummary] = []

    # Map members by level
    current_parents = [current_user.id]
    for level in range(1, 11):
        if not current_parents:
            level_summaries.append({
                "level": level,
                "rate_percent": float(rates[level - 1]) if level - 1 < len(rates) else 0.0,
                "members_count": 0,
                "funded_members_count": 0,
                "total_commissions_cents": 0,
                "required_directs": level,
                "your_directs": qualified_direct_count,
                "is_level_qualified": (qualified_direct_count >= level)
            })
            continue

        level_users = db.query(models.User).filter(
            models.User.referrer_id.in_(current_parents),
            models.User.status == "active"
        ).all()

        parent_map = {}
        if level == 1:
            parent_map = {current_user.id: current_user.name}
        elif current_parents:
            parents = db.query(models.User).filter(models.User.id.in_(current_parents)).all()
            parent_map = {p.id: p.name for p in parents}

        funded_count = 0
        for u in level_users:
            dep_sum = db.query(models.Deposit).filter(
                models.Deposit.user_id == u.id,
                models.Deposit.status == "confirmed"
            ).all()
            has_funded = len(dep_sum) > 0
            funded_amt = sum(d.amount_cents for d in dep_sum)

            if level == 1 and has_funded:
                qualified_direct_count += 1

            if has_funded:
                funded_count += 1

            u_directs_count = db.query(models.User).filter(
                models.User.referrer_id == u.id,
                models.User.status == "active"
            ).count()

            members.append(schemas.ReferralNode(
                id=u.id,
                name=u.name,
                email=u.email,
                referral_code=u.referral_code,
                level=level,
                status=u.status,
                has_funded_deposit=has_funded,
                funded_amount_cents=funded_amt,
                created_at=u.created_at,
                referrer_id=u.referrer_id,
                referrer_name=parent_map.get(u.referrer_id),
                directs_count=u_directs_count
            ))


        # Query commissions earned for this user from this level
        comm_cents = db.query(models.Commission).filter(
            models.Commission.recipient_user_id == current_user.id,
            models.Commission.level == level,
            models.Commission.status == "credited"
        ).all()
        total_comm = sum(c.amount_cents for c in comm_cents)

        level_summaries.append({
            "level": level,
            "rate_percent": float(rates[level - 1]) if level - 1 < len(rates) else 0.0,
            "members_count": len(level_users),
            "funded_members_count": funded_count,
            "total_commissions_cents": total_comm,
            "required_directs": level,
            "your_directs": qualified_direct_count,
            "is_level_qualified": (qualified_direct_count >= level)
        })

        current_parents = [u.id for u in level_users]

    return {
        "referral_code": current_user.referral_code,
        "referral_link": f"/register?ref={current_user.referral_code}",
        "total_direct_count": len(directs),
        "qualified_direct_count": qualified_direct_count,
        "is_qualified": qualified_direct_count >= 2,
        "total_network_count": len(members),
        "levels_summary": level_summaries,
        "members": members
    }

@router.post("/deposits", response_model=schemas.DepositResponse)
def create_deposit_request(
    req: schemas.DepositCreateRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    min_deposit = float(rules.minimum_deposit) if rules else 100.0

    if req.amount_usd < min_deposit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Minimum deposit is ${min_deposit:.2f} USD."
        )

    amount_cents = int(round(req.amount_usd * 100))
    idempotency_key = req.idempotency_key or f"dep_{current_user.id}_{int(datetime.utcnow().timestamp())}"

    # Check if duplicate idempotency key
    existing = db.query(models.Deposit).filter(models.Deposit.idempotency_key == idempotency_key).first()
    if existing:
        return {
            "id": existing.id,
            "user_id": existing.user_id,
            "amount_cents": existing.amount_cents,
            "amount_usd": existing.amount_cents / 100.0,
            "status": existing.status,
            "note": existing.note,
            "created_at": existing.created_at,
            "confirmed_at": existing.confirmed_at
        }

    dep_id = generate_id("dep")
    deposit = models.Deposit(
        id=dep_id,
        user_id=current_user.id,
        amount_cents=amount_cents,
        status="pending",
        idempotency_key=idempotency_key,
        note=req.note,
        created_at=datetime.utcnow()
    )
    db.add(deposit)

    # In-app notification
    notif = models.Notification(
        id=generate_id("notif"),
        user_id=current_user.id,
        title="Deposit Created",
        message=f"Deposit request of ${req.amount_usd:.2f} is pending verification.",
        notif_type="deposit"
    )
    db.add(notif)

    # Audit log
    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=current_user.id,
        action="DEPOSIT_REQUESTED",
        entity_type="deposits",
        entity_id=dep_id,
        detail=f"Amount: ${req.amount_usd:.2f} USD"
    )
    db.add(audit)

    db.commit()
    db.refresh(deposit)

    return {
        "id": deposit.id,
        "user_id": deposit.user_id,
        "amount_cents": deposit.amount_cents,
        "amount_usd": deposit.amount_cents / 100.0,
        "status": deposit.status,
        "note": deposit.note,
        "created_at": deposit.created_at,
        "confirmed_at": deposit.confirmed_at
    }

@router.get("/deposits", response_model=list[schemas.DepositResponse])
def list_customer_deposits(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    deposits = db.query(models.Deposit).filter(
        models.Deposit.user_id == current_user.id
    ).order_by(models.Deposit.created_at.desc()).all()

    return [
        {
            "id": d.id,
            "user_id": d.user_id,
            "amount_cents": d.amount_cents,
            "amount_usd": d.amount_cents / 100.0,
            "status": d.status,
            "note": d.note,
            "created_at": d.created_at,
            "confirmed_at": d.confirmed_at
        }
        for d in deposits
    ]

@router.post("/withdrawals", response_model=schemas.WithdrawalResponse)
def create_withdrawal_request(
    req: schemas.WithdrawalCreateRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    min_wd = float(rules.min_withdrawal) if rules else 20.0
    max_wd = float(rules.max_withdrawal) if rules else 50000.0

    if req.amount_usd < min_wd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Minimum withdrawal is ${min_wd:.2f} USD."
        )
    if req.amount_usd > max_wd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Maximum withdrawal per request is ${max_wd:.2f} USD."
        )

    amount_cents = int(round(req.amount_usd * 100))

    # Check monthly request frequency rule: 1 active request per calendar month
    now = datetime.utcnow()
    current_month_key = f"{now.year}-{now.month:02d}"
    existing_month_wd = db.query(models.Withdrawal).filter(
        models.Withdrawal.user_id == current_user.id,
        models.Withdrawal.month_key == current_month_key,
        models.Withdrawal.status.in_(["pending", "approved"])
    ).first()

    if existing_month_wd:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an active or approved withdrawal request for this calendar month."
        )

    # Check available wallet balance
    wallet = db.query(models.Wallet).filter(models.Wallet.user_id == current_user.id).first()
    if not wallet or wallet.withdrawable_balance_cents < amount_cents:
        avail = (wallet.withdrawable_balance_cents / 100.0) if wallet else 0.0
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Insufficient available balance. You have ${avail:.2f} available."
        )

    # Check account deposit age for 3-month threshold early withdrawal classification
    deposits = db.query(models.Deposit).filter(
        models.Deposit.user_id == current_user.id,
        models.Deposit.status == "confirmed"
    ).all()

    is_early = True
    if deposits:
        earliest_deposit = min(d.confirmed_at or d.created_at for d in deposits)
        months_diff = (now.year - earliest_deposit.year) * 12 + now.month - earliest_deposit.month
        is_early = months_diff < 3

    wd_id = generate_id("wd")
    withdrawal = models.Withdrawal(
        id=wd_id,
        user_id=current_user.id,
        amount_cents=amount_cents,
        is_early_withdrawal=is_early,
        month_key=current_month_key,
        status="pending",
        payout_method=req.payout_method or "BINANCE_PAY",
        payout_details=req.payout_details,
        created_at=now
    )
    db.add(withdrawal)

    # Add in-app notification
    notif = models.Notification(
        id=generate_id("notif"),
        user_id=current_user.id,
        title="Withdrawal Request Submitted",
        message=f"Simulated withdrawal request of ${req.amount_usd:.2f} is awaiting admin review.",
        notif_type="withdrawal"
    )
    db.add(notif)

    # Audit log
    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=current_user.id,
        action="WITHDRAWAL_REQUESTED",
        entity_type="withdrawals",
        entity_id=wd_id,
        detail=f"Amount: ${req.amount_usd:.2f} USD, Early: {is_early}"
    )
    db.add(audit)

    db.commit()
    db.refresh(withdrawal)

    return {
        "id": withdrawal.id,
        "user_id": withdrawal.user_id,
        "amount_cents": withdrawal.amount_cents,
        "amount_usd": withdrawal.amount_cents / 100.0,
        "principal_portion_cents": withdrawal.principal_portion_cents,
        "roi_portion_cents": withdrawal.roi_portion_cents,
        "commission_portion_cents": withdrawal.commission_portion_cents,
        "is_early_withdrawal": withdrawal.is_early_withdrawal,
        "month_key": withdrawal.month_key,
        "status": withdrawal.status,
        "payout_method": withdrawal.payout_method,
        "payout_details": withdrawal.payout_details,
        "rejection_reason": withdrawal.rejection_reason,
        "created_at": withdrawal.created_at,
        "reviewed_at": withdrawal.reviewed_at
    }

@router.get("/withdrawals", response_model=list[schemas.WithdrawalResponse])
def list_customer_withdrawals(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    withdrawals = db.query(models.Withdrawal).filter(
        models.Withdrawal.user_id == current_user.id
    ).order_by(models.Withdrawal.created_at.desc()).all()

    return [
        {
            "id": w.id,
            "user_id": w.user_id,
            "amount_cents": w.amount_cents,
            "amount_usd": w.amount_cents / 100.0,
            "principal_portion_cents": w.principal_portion_cents,
            "roi_portion_cents": w.roi_portion_cents,
            "commission_portion_cents": w.commission_portion_cents,
            "is_early_withdrawal": w.is_early_withdrawal,
            "month_key": w.month_key,
            "status": w.status,
            "payout_method": w.payout_method,
            "payout_details": w.payout_details,
            "rejection_reason": w.rejection_reason,
            "created_at": w.created_at,
            "reviewed_at": w.reviewed_at
        }
        for w in withdrawals
    ]

@router.get("/ledger", response_model=list[schemas.LedgerEntryResponse])
def get_customer_ledger(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    entries = db.query(models.LedgerEntry).filter(
        models.LedgerEntry.user_id == current_user.id
    ).order_by(models.LedgerEntry.created_at.desc()).limit(100).all()
    return entries

@router.get("/commissions", response_model=list[schemas.CommissionResponse])
def get_customer_commissions(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    comms = db.query(models.Commission).filter(
        models.Commission.recipient_user_id == current_user.id
    ).order_by(models.Commission.created_at.desc()).all()

    res = []
    for c in comms:
        src = db.query(models.User).filter(models.User.id == c.source_user_id).first()
        res.append({
            "id": c.id,
            "deposit_id": c.deposit_id,
            "source_user_id": c.source_user_id,
            "source_user_name": src.name if src else "Unknown",
            "recipient_user_id": c.recipient_user_id,
            "level": c.level,
            "commission_type": c.commission_type,
            "rate_percent": float(c.rate_percent),
            "base_cents": c.base_cents,
            "amount_cents": c.amount_cents,
            "status": c.status,
            "month_key": c.month_key,
            "created_at": c.created_at
        })
    return res

@router.get("/notifications", response_model=list[schemas.NotificationResponse])
def get_customer_notifications(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).order_by(models.Notification.created_at.desc()).limit(50).all()

@router.post("/notifications/{notif_id}/read")
def mark_notification_read(
    notif_id: str,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    notif = db.query(models.Notification).filter(
        models.Notification.id == notif_id,
        models.Notification.user_id == current_user.id
    ).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"status": "ok"}

@router.post("/notifications/mark-all-read")
def mark_all_notifications_read(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id
    ).update({"is_read": True})
    db.commit()
    return {"status": "ok"}

@router.get("/tickets", response_model=list[schemas.SupportTicketResponse])
def list_support_tickets(
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    tickets = db.query(models.SupportTicket).filter(
        models.SupportTicket.user_id == current_user.id
    ).order_by(models.SupportTicket.updated_at.desc()).all()

    res = []
    for t in tickets:
        msgs = [
            schemas.SupportMessageResponse(
                id=m.id,
                ticket_id=m.ticket_id,
                sender_id=m.sender_id,
                sender_name=m.sender.name if m.sender else "User",
                sender_role=m.sender_role,
                message=m.message,
                created_at=m.created_at
            )
            for m in t.messages
        ]
        res.append(schemas.SupportTicketResponse(
            id=t.id,
            user_id=t.user_id,
            user_name=current_user.name,
            subject=t.subject,
            category=t.category,
            priority=t.priority,
            status=t.status,
            created_at=t.created_at,
            updated_at=t.updated_at,
            messages=msgs
        ))
    return res

@router.post("/tickets", response_model=schemas.SupportTicketResponse)
def create_support_ticket(
    req: schemas.SupportTicketCreateRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    ticket_id = generate_id("tkt")
    now = datetime.utcnow()

    ticket = models.SupportTicket(
        id=ticket_id,
        user_id=current_user.id,
        subject=req.subject,
        category=req.category,
        priority=req.priority,
        status="open",
        created_at=now,
        updated_at=now
    )
    db.add(ticket)
    db.flush()

    msg = models.SupportMessage(
        id=generate_id("msg"),
        ticket_id=ticket.id,
        sender_id=current_user.id,
        sender_role=current_user.role,
        message=req.initial_message,
        created_at=now
    )
    db.add(msg)
    db.commit()
    db.refresh(ticket)

    return schemas.SupportTicketResponse(
        id=ticket.id,
        user_id=ticket.user_id,
        user_name=current_user.name,
        subject=ticket.subject,
        category=ticket.category,
        priority=ticket.priority,
        status=ticket.status,
        created_at=ticket.created_at,
        updated_at=ticket.updated_at,
        messages=[
            schemas.SupportMessageResponse(
                id=msg.id,
                ticket_id=msg.ticket_id,
                sender_id=msg.sender_id,
                sender_name=current_user.name,
                sender_role=msg.sender_role,
                message=msg.message,
                created_at=msg.created_at
            )
        ]
    )

@router.post("/tickets/{ticket_id}/messages", response_model=schemas.SupportMessageResponse)
def add_ticket_message(
    ticket_id: str,
    req: schemas.SupportMessageCreateRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    ticket = db.query(models.SupportTicket).filter(
        models.SupportTicket.id == ticket_id,
        models.SupportTicket.user_id == current_user.id
    ).first()
    if not ticket:
        raise HTTPException(status_code=404, detail="Support ticket not found.")

    msg = models.SupportMessage(
        id=generate_id("msg"),
        ticket_id=ticket.id,
        sender_id=current_user.id,
        sender_role=current_user.role,
        message=req.message,
        created_at=datetime.utcnow()
    )
    ticket.updated_at = datetime.utcnow()
    if ticket.status == "resolved":
        ticket.status = "open"

    db.add(msg)
    db.commit()
    db.refresh(msg)

    return schemas.SupportMessageResponse(
        id=msg.id,
        ticket_id=msg.ticket_id,
        sender_id=msg.sender_id,
        sender_name=current_user.name,
        sender_role=msg.sender_role,
        message=msg.message,
        created_at=msg.created_at
    )
