import uuid
from decimal import Decimal, ROUND_HALF_UP
from sqlalchemy.orm import Session
import models
import accounting

def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

def check_user_qualification(db: Session, user_id: str) -> bool:
    """
    Qualification rule for Royal Bull Capital:
    A user becomes qualified to receive 10-level commissions when they have at least
    2 direct active referrals who have completed at least one confirmed deposit.
    """
    directs = db.query(models.User).filter(
        models.User.referrer_id == user_id,
        models.User.status == "active"
    ).all()

    funded_count = 0
    for child in directs:
        has_successful_deposit = db.query(models.Deposit).filter(
            models.Deposit.user_id == child.id,
            models.Deposit.status == "confirmed"
        ).first() is not None
        if has_successful_deposit:
            funded_count += 1

    return funded_count >= 2

def process_deposit_commissions(db: Session, deposit: models.Deposit) -> list[models.Commission]:
    """
    Executes server-authoritative commission calculations upon deposit confirmation:
    1. Direct Referral Bonus (5%) to immediate parent (level 0).
    2. Multi-tier commissions across up to 10 ancestor levels (levels 1-10).
    Only ancestors who meet the qualification criteria receive level commissions.
    """
    created_commissions: list[models.Commission] = []
    depositor = db.query(models.User).filter(models.User.id == deposit.user_id).first()
    if not depositor:
        return created_commissions

    # Fetch global system rules
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    if not rules:
        rules = models.SystemRule(id="global")
        db.add(rules)
        db.flush()

    direct_bonus_percent = Decimal(str(rules.direct_bonus))
    level_rates = [Decimal(str(r)) for r in rules.get_level_rates()]
    amount_cents = deposit.amount_cents

    # 1. Immediate Parent: Direct Referral Bonus (Level 0)
    if depositor.referrer_id:
        parent = db.query(models.User).filter(models.User.id == depositor.referrer_id).first()
        if parent and parent.status == "active":
            parent_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == parent.id).first()
            if not parent_wallet:
                parent_wallet = models.Wallet(user_id=parent.id)
                db.add(parent_wallet)
                db.flush()

            # Calculate direct bonus amount
            bonus_amount_cents = int((Decimal(amount_cents) * direct_bonus_percent / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
            idempotency_key = f"dep_{deposit.id}_direct_{parent.id}"

            existing = db.query(models.Commission).filter(models.Commission.idempotency_key == idempotency_key).first()
            if not existing and bonus_amount_cents > 0:
                parent_wallet.direct_bonus_cents += bonus_amount_cents

                comm = models.Commission(
                    id=generate_id("com"),
                    deposit_id=deposit.id,
                    source_user_id=depositor.id,
                    recipient_user_id=parent.id,
                    level=0,
                    commission_type="direct_bonus",
                    rate_percent=float(direct_bonus_percent),
                    base_cents=amount_cents,
                    amount_cents=bonus_amount_cents,
                    idempotency_key=idempotency_key,
                    status="credited"
                )
                db.add(comm)
                created_commissions.append(comm)

                # Double-entry ledger posting
                accounting.post_direct_bonus_journal(
                    db=db,
                    deposit_id=deposit.id,
                    recipient_id=parent.id,
                    bonus_amount_cents=bonus_amount_cents,
                    idempotency_key=idempotency_key
                )

                # Legacy single-entry statement ledger entry
                ledger = models.LedgerEntry(
                    id=generate_id("led"),
                    user_id=parent.id,
                    entry_type="direct_bonus",
                    amount_cents=bonus_amount_cents,
                    balance_after_cents=parent_wallet.total_balance_cents,
                    description=f"Direct referral bonus ({direct_bonus_percent}%) from {depositor.name}",
                    reference_id=deposit.id,
                    idempotency_key=idempotency_key
                )
                db.add(ledger)

                # Notification
                notif = models.Notification(
                    id=generate_id("notif"),
                    user_id=parent.id,
                    title="Direct Referral Bonus Credited",
                    message=f"You earned a ${bonus_amount_cents/100:.2f} direct bonus from referral {depositor.name}.",
                    notif_type="commission"
                )
                db.add(notif)

    # 2. Multi-tier Ancestor Cascade (Levels 1 to 10)
    current_ancestor_id = depositor.referrer_id
    level = 1
    visited_ancestors = set()

    while current_ancestor_id and level <= 10:
        if current_ancestor_id in visited_ancestors:
            # Prevent circular loops in corrupt referral graphs
            break
        visited_ancestors.add(current_ancestor_id)

        ancestor = db.query(models.User).filter(models.User.id == current_ancestor_id).first()
        if not ancestor:
            break

        # Check qualification: must have >= 2 active funded direct referrals
        is_qualified = check_user_qualification(db, ancestor.id)

        if is_qualified and ancestor.status == "active" and level - 1 < len(level_rates):
            rate_percent = level_rates[level - 1]
            comm_amount_cents = int((Decimal(amount_cents) * rate_percent / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
            level_idempotency_key = f"dep_{deposit.id}_lvl{level}_{ancestor.id}"

            existing_comm = db.query(models.Commission).filter(models.Commission.idempotency_key == level_idempotency_key).first()
            if not existing_comm and comm_amount_cents > 0:
                ancestor_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == ancestor.id).first()
                if not ancestor_wallet:
                    ancestor_wallet = models.Wallet(user_id=ancestor.id)
                    db.add(ancestor_wallet)
                    db.flush()

                ancestor_wallet.level_commission_cents += comm_amount_cents

                comm = models.Commission(
                    id=generate_id("com"),
                    deposit_id=deposit.id,
                    source_user_id=depositor.id,
                    recipient_user_id=ancestor.id,
                    level=level,
                    commission_type="level_commission",
                    rate_percent=float(rate_percent),
                    base_cents=amount_cents,
                    amount_cents=comm_amount_cents,
                    idempotency_key=level_idempotency_key,
                    status="credited"
                )
                db.add(comm)
                created_commissions.append(comm)

                # Double-entry ledger posting
                accounting.post_level_commission_journal(
                    db=db,
                    deposit_id=deposit.id,
                    ancestor_id=ancestor.id,
                    level=level,
                    comm_amount_cents=comm_amount_cents,
                    idempotency_key=level_idempotency_key
                )

                # Legacy single-entry statement ledger entry
                ledger = models.LedgerEntry(
                    id=generate_id("led"),
                    user_id=ancestor.id,
                    entry_type="level_commission",
                    amount_cents=comm_amount_cents,
                    balance_after_cents=ancestor_wallet.total_balance_cents,
                    description=f"Level {level} referral commission ({rate_percent}%) from {depositor.name}",
                    reference_id=deposit.id,
                    idempotency_key=level_idempotency_key
                )
                db.add(ledger)

                # Notification
                notif = models.Notification(
                    id=generate_id("notif"),
                    user_id=ancestor.id,
                    title=f"Level {level} Commission Credited",
                    message=f"Received ${comm_amount_cents/100:.2f} (Tier {level}) from {depositor.name}.",
                    notif_type="commission"
                )
                db.add(notif)

        current_ancestor_id = ancestor.referrer_id
        level += 1

    return created_commissions
