import uuid
from decimal import Decimal, ROUND_HALF_UP
from sqlalchemy.orm import Session
import models
import accounting

# Centralized Commission Rate Configuration (Section 2)
# Level L commission rate as a Decimal fraction of eligible downline ROI
LEVEL_RATES: dict[int, Decimal] = {
    1: Decimal("0.20"),  # 20%
    2: Decimal("0.15"),  # 15%
    3: Decimal("0.10"),  # 10%
    4: Decimal("0.08"),  # 8%
    5: Decimal("0.07"),  # 7%
    6: Decimal("0.06"),  # 6%
    7: Decimal("0.05"),  # 5%
    8: Decimal("0.04"),  # 4%
    9: Decimal("0.03"),  # 3%
    10: Decimal("0.02"), # 2%
}

def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

def get_user_funded_directs_count(db: Session, user_id: str, min_deposit_cents: int = 10000) -> int:
    """
    Returns the count of distinct, active direct referrals who have at least one
    confirmed/verified deposit meeting the configured minimum deposit requirement.
    Directs are counted only once, regardless of number of deposits.
    """
    directs = db.query(models.User).filter(
        models.User.referrer_id == user_id,
        models.User.status == "active"
    ).all()

    funded_count = 0
    for child in directs:
        has_funded_deposit = db.query(models.Deposit).filter(
            models.Deposit.user_id == child.id,
            models.Deposit.status == "confirmed",
            models.Deposit.amount_cents >= min_deposit_cents
        ).first() is not None
        if has_funded_deposit:
            funded_count += 1

    return funded_count

def check_user_level_qualification(db: Session, user_id: str, level: int, min_deposit_cents: int = 10000) -> bool:
    """
    Option A — Incremental Direct Qualification (Section 3):
    Each ancestor must independently satisfy the direct-referral requirement for the specific
    level at which they are receiving commission:
    - Level 1 requires at least 1 verified funded direct referral.
    - Level 2 requires at least 2 verified funded direct referrals.
    ...
    - Level L requires at least L verified funded direct referrals (up to Level 10 requiring 10).
    """
    if level < 1:
        return True
    funded_count = get_user_funded_directs_count(db, user_id, min_deposit_cents)
    return funded_count >= level

def check_user_qualification(db: Session, user_id: str, level: int = 1, min_deposit_cents: int = 10000) -> bool:
    """
    General qualification check. Defaults to Level 1 qualification check (>= 1 direct).
    """
    return check_user_level_qualification(db, user_id, level, min_deposit_cents)

# ----------------- Direct Sponsor Bonus (Isolated) -----------------

def process_deposit_direct_bonus(db: Session, deposit: models.Deposit) -> models.Commission | None:
    """
    Direct Sponsor Bonus — Isolated from the 10-level monthly ROI engine (Section 5).
    Calculates and credits the 5% Direct Sponsor Bonus upon deposit confirmation.
    Does NOT trigger any 10-level cascade.
    """
    depositor = db.query(models.User).filter(models.User.id == deposit.user_id).first()
    if not depositor or not depositor.referrer_id:
        return None

    parent = db.query(models.User).filter(models.User.id == depositor.referrer_id).first()
    if not parent or parent.status != "active":
        return None

    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    direct_bonus_percent = Decimal(str(rules.direct_bonus)) if rules else Decimal("5.00")
    amount_cents = deposit.amount_cents

    parent_wallet = db.query(models.Wallet).filter(models.Wallet.user_id == parent.id).first()
    if not parent_wallet:
        parent_wallet = models.Wallet(user_id=parent.id)
        db.add(parent_wallet)
        db.flush()

    bonus_amount_cents = int((Decimal(amount_cents) * direct_bonus_percent / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
    idempotency_key = f"dep_{deposit.id}_direct_{parent.id}"

    existing = db.query(models.Commission).filter(models.Commission.idempotency_key == idempotency_key).first()
    if existing or bonus_amount_cents <= 0:
        return existing

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
        month_key=None,
        status="credited"
    )
    db.add(comm)

    # Double-entry ledger posting
    accounting.post_direct_bonus_journal(
        db=db,
        deposit_id=deposit.id,
        recipient_id=parent.id,
        bonus_amount_cents=bonus_amount_cents,
        idempotency_key=idempotency_key
    )

    # Statement ledger entry
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

    return comm

def process_deposit_commissions(db: Session, deposit: models.Deposit) -> list[models.Commission]:
    """
    Deprecated for 10-level commissions (Section 1 & 5).
    Deposits DO NOT trigger 10-level referral commissions.
    This function isolates and executes ONLY the 5% direct sponsor bonus upon deposit confirmation.
    """
    direct_comm = process_deposit_direct_bonus(db, deposit)
    return [direct_comm] if direct_comm else []

# ----------------- Monthly ROI-Based 10-Level Referral Engine -----------------

def process_monthly_roi_commissions(
    db: Session,
    deposit: models.Deposit,
    downline_user: models.User,
    roi_cents: int,
    month_key: str,
    cycle_entry_id: str | None = None
) -> list[models.Commission]:
    """
    Executes the 10-level referral commission calculations from the referred user's eligible monthly ROI:
    - Calculation Basis: Finalized downline monthly ROI (roi_cents > 0)
    - Depth: Traverses up to 10 ancestral generations
    - Qualification: Enforces Option A incremental qualification (Level L requires >= L verified funded directs)
    - Non-Compression Rule: If an ancestor fails qualification for a level, that level pays $0. No compression or transfer.
    - Idempotency: f"roi_comm_{month_key}_{deposit.id}_{ancestor.id}_lvl{level}"
    - Ledger: Posts balanced double-entry journal (Debit 5020_LEVEL_COMMISSION_EXPENSE, Credit 2030_MEMBER_LEVEL_COMMISSION_PAYABLE)
    """
    created_commissions: list[models.Commission] = []

    # If ROI is non-positive or missing, do not generate positive commission
    if roi_cents <= 0 or not downline_user.referrer_id:
        return created_commissions

    # Fetch min deposit rule for qualification verification
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    min_deposit_cents = int(round(float(rules.minimum_deposit) * 100)) if rules else 10000

    current_ancestor_id = downline_user.referrer_id
    level = 1
    visited_ancestors: set[str] = set()

    while current_ancestor_id and level <= 10:
        if current_ancestor_id in visited_ancestors:
            # Referral Tree Safety: Prevent circular loops
            break
        visited_ancestors.add(current_ancestor_id)

        ancestor = db.query(models.User).filter(models.User.id == current_ancestor_id).first()
        if not ancestor:
            break

        # Check Option A qualification independently for this ancestor at this specific level
        is_level_qualified = check_user_level_qualification(
            db=db,
            user_id=ancestor.id,
            level=level,
            min_deposit_cents=min_deposit_cents
        )

        if is_level_qualified and ancestor.status == "active" and level in LEVEL_RATES:
            rate = LEVEL_RATES[level]
            comm_amount_cents = int((Decimal(roi_cents) * rate).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
            level_idempotency_key = f"roi_comm_{month_key}_{deposit.id}_{ancestor.id}_lvl{level}"

            existing_comm = db.query(models.Commission).filter(
                models.Commission.idempotency_key == level_idempotency_key
            ).first()

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
                    source_user_id=downline_user.id,
                    recipient_user_id=ancestor.id,
                    level=level,
                    commission_type="roi_level_commission",
                    rate_percent=float(rate * Decimal("100")),
                    base_cents=roi_cents,
                    amount_cents=comm_amount_cents,
                    idempotency_key=level_idempotency_key,
                    month_key=month_key,
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

                # Statement ledger entry
                ledger = models.LedgerEntry(
                    id=generate_id("led"),
                    user_id=ancestor.id,
                    entry_type="level_commission",
                    amount_cents=comm_amount_cents,
                    balance_after_cents=ancestor_wallet.total_balance_cents,
                    description=f"Level {level} ROI commission ({float(rate*100):.1f}%) from {downline_user.name} ({month_key})",
                    reference_id=deposit.id,
                    idempotency_key=level_idempotency_key
                )
                db.add(ledger)

                # User notification
                notif = models.Notification(
                    id=generate_id("notif"),
                    user_id=ancestor.id,
                    title=f"Level {level} Monthly ROI Commission Credited",
                    message=f"Received ${comm_amount_cents/100:.2f} (Tier {level} at {float(rate*100):.1f}%) based on downline ROI for {month_key}.",
                    notif_type="commission"
                )
                db.add(notif)
        # Non-compression: if ancestor fails qualification, they receive $0.
        # Tree does NOT compress; next ancestor is at level + 1.

        current_ancestor_id = ancestor.referrer_id
        level += 1

    return created_commissions
