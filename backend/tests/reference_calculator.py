from dataclasses import dataclass, field
from decimal import Decimal, ROUND_HALF_UP
from typing import Dict, List, Optional, Set

@dataclass
class RefUser:
    id: str
    name: str
    email: str
    referrer_id: Optional[str] = None
    status: str = "active"

@dataclass
class RefDeposit:
    id: str
    user_id: str
    amount_cents: int
    status: str = "confirmed"
    confirmed_month: Optional[str] = None

@dataclass
class RefCommission:
    deposit_id: str
    source_user_id: str
    recipient_user_id: str
    level: int
    commission_type: str  # 'direct_bonus' or 'level_commission'
    rate_percent: Decimal
    base_cents: int
    amount_cents: int
    idempotency_key: str

@dataclass
class RefMonthReturn:
    deposit_id: str
    user_id: str
    month_key: str
    roi_cents: int
    principal_cents: int
    cycle_key: str

@dataclass
class RefWallet:
    user_id: str
    original_principal_cents: int = 0
    principal_credits_cents: int = 0
    roi_balance_cents: int = 0
    direct_bonus_cents: int = 0
    level_commission_cents: int = 0
    withdrawn_total_cents: int = 0

    @property
    def total_balance_cents(self) -> int:
        return (
            self.original_principal_cents
            + self.principal_credits_cents
            + self.roi_balance_cents
            + self.direct_bonus_cents
            + self.level_commission_cents
        )

class IndependentReferenceCalculator:
    """
    Independent Reference Calculation Engine (Oracle).
    This engine does NOT import or call production calculation code.
    It executes calculations according to approved business rules:
      - Direct referral bonus: 5% (Level 0) to immediate active parent.
      - Multi-tier levels 1 to 10: [20%, 15%, 10%, 8%, 7%, 6%, 5%, 4%, 3%, 2%].
      - Qualification requirement: Ancestor must have >= 2 active funded direct referrals.
      - Monthly ROI simulation: 5% per confirmed deposit per calendar month.
      - Monthly Principal simulation: 5% per confirmed deposit per calendar month.
      - Rounding rule: ROUND_HALF_UP to nearest whole cent.
    """

    def __init__(
        self,
        direct_bonus_rate: Decimal = Decimal("5.0"),
        level_rates: Optional[List[Decimal]] = None,
        monthly_roi_rate: Decimal = Decimal("5.0"),
        monthly_principal_rate: Decimal = Decimal("5.0")
    ):
        self.direct_bonus_rate = direct_bonus_rate
        self.level_rates = level_rates or [
            Decimal("20.0"), Decimal("15.0"), Decimal("10.0"),
            Decimal("8.0"), Decimal("7.0"), Decimal("6.0"),
            Decimal("5.0"), Decimal("4.0"), Decimal("3.0"), Decimal("2.0")
        ]
        self.monthly_roi_rate = monthly_roi_rate
        self.monthly_principal_rate = monthly_principal_rate

        self.users: Dict[str, RefUser] = {}
        self.wallets: Dict[str, RefWallet] = {}
        self.deposits: Dict[str, RefDeposit] = {}
        self.commissions: List[RefCommission] = []
        self.month_returns: List[RefMonthReturn] = []
        self.commission_keys: Set[str] = set()
        self.cycle_keys: Set[str] = set()

    def add_user(self, user_id: str, name: str, email: str, referrer_id: Optional[str] = None, status: str = "active") -> RefUser:
        u = RefUser(id=user_id, name=name, email=email, referrer_id=referrer_id, status=status)
        self.users[user_id] = u
        self.wallets[user_id] = RefWallet(user_id=user_id)
        return u

    def is_user_qualified(self, user_id: str) -> bool:
        """
        Qualification check: Count of active direct referrals who have >= 1 confirmed deposit.
        """
        directs = [u for u in self.users.values() if u.referrer_id == user_id and u.status == "active"]
        funded_count = 0
        for d in directs:
            has_dep = any(dep.user_id == d.id and dep.status == "confirmed" for dep in self.deposits.values())
            if has_dep:
                funded_count += 1
        return funded_count >= 2

    def process_deposit(self, deposit_id: str, user_id: str, amount_cents: int, status: str = "confirmed", confirmed_month: Optional[str] = None) -> List[RefCommission]:
        dep = RefDeposit(id=deposit_id, user_id=user_id, amount_cents=amount_cents, status=status, confirmed_month=confirmed_month)
        self.deposits[deposit_id] = dep

        if status != "confirmed":
            return []

        # Credit depositor wallet principal
        depositor_wallet = self.wallets[user_id]
        depositor_wallet.original_principal_cents += amount_cents

        created: List[RefCommission] = []
        depositor = self.users.get(user_id)
        if not depositor or not depositor.referrer_id:
            return created

        # 1. Direct Bonus (Level 0) to immediate active parent
        parent = self.users.get(depositor.referrer_id)
        if parent and parent.status == "active":
            bonus_cents = int((Decimal(amount_cents) * self.direct_bonus_rate / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
            idem_key = f"dep_{deposit_id}_direct_{parent.id}"
            if idem_key not in self.commission_keys and bonus_cents > 0:
                self.commission_keys.add(idem_key)
                self.wallets[parent.id].direct_bonus_cents += bonus_cents
                comm = RefCommission(
                    deposit_id=deposit_id,
                    source_user_id=depositor.id,
                    recipient_user_id=parent.id,
                    level=0,
                    commission_type="direct_bonus",
                    rate_percent=self.direct_bonus_rate,
                    base_cents=amount_cents,
                    amount_cents=bonus_cents,
                    idempotency_key=idem_key
                )
                self.commissions.append(comm)
                created.append(comm)

        # 2. Multi-tier Ancestor Cascade (Levels 1 to 10)
        curr_ancestor_id = depositor.referrer_id
        level = 1
        visited = set()

        while curr_ancestor_id and level <= 10:
            if curr_ancestor_id in visited:
                break
            visited.add(curr_ancestor_id)

            ancestor = self.users.get(curr_ancestor_id)
            if not ancestor:
                break

            # Must be active and meet qualification (>= 2 active funded directs)
            if ancestor.status == "active" and self.is_user_qualified(ancestor.id):
                rate = self.level_rates[level - 1]
                comm_cents = int((Decimal(amount_cents) * rate / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
                lvl_key = f"dep_{deposit_id}_lvl{level}_{ancestor.id}"
                if lvl_key not in self.commission_keys and comm_cents > 0:
                    self.commission_keys.add(lvl_key)
                    self.wallets[ancestor.id].level_commission_cents += comm_cents
                    comm = RefCommission(
                        deposit_id=deposit_id,
                        source_user_id=depositor.id,
                        recipient_user_id=ancestor.id,
                        level=level,
                        commission_type="level_commission",
                        rate_percent=rate,
                        base_cents=amount_cents,
                        amount_cents=comm_cents,
                        idempotency_key=lvl_key
                    )
                    self.commissions.append(comm)
                    created.append(comm)

            curr_ancestor_id = ancestor.referrer_id
            level += 1

        return created

    def process_monthly_cycle(self, month_key: str) -> List[RefMonthReturn]:
        """
        Executes reference monthly performance allocation for confirmed deposits in month_key.
        Strict idempotency: 1 cycle allocation per deposit per calendar month.
        """
        created: List[RefMonthReturn] = []
        for dep in self.deposits.values():
            if dep.status != "confirmed":
                continue

            cycle_key = f"{dep.id}_{month_key}"
            if cycle_key in self.cycle_keys:
                # Already processed for this month
                continue

            self.cycle_keys.add(cycle_key)
            dep_amt = Decimal(dep.amount_cents)
            roi_cents = int((dep_amt * self.monthly_roi_rate / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
            prn_cents = int((dep_amt * self.monthly_principal_rate / Decimal(100)).quantize(Decimal("1"), rounding=ROUND_HALF_UP))

            wallet = self.wallets[dep.user_id]
            wallet.roi_balance_cents += roi_cents
            wallet.principal_credits_cents += prn_cents

            entry = RefMonthReturn(
                deposit_id=dep.id,
                user_id=dep.user_id,
                month_key=month_key,
                roi_cents=roi_cents,
                principal_cents=prn_cents,
                cycle_key=cycle_key
            )
            self.month_returns.append(entry)
            created.append(entry)

        return created

    def process_withdrawal(self, user_id: str, amount_cents: int) -> bool:
        """
        Simulates withdrawal execution adhering to bucket deduction hierarchy.
        """
        wallet = self.wallets.get(user_id)
        if not wallet or wallet.total_balance_cents < amount_cents:
            return False

        remaining = amount_cents
        for bucket in ["direct_bonus_cents", "level_commission_cents", "roi_balance_cents", "principal_credits_cents", "original_principal_cents"]:
            curr = getattr(wallet, bucket)
            deduct = min(curr, remaining)
            setattr(wallet, bucket, curr - deduct)
            remaining -= deduct
            if remaining <= 0:
                break

        wallet.withdrawn_total_cents += amount_cents
        return True
