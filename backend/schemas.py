from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# ----------------- Auth Schemas -----------------
class UserRegisterRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=128)
    referral_code: Optional[str] = Field(None, max_length=64)

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: "UserResponse"

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=6, max_length=128)

# ----------------- User & Wallet Schemas -----------------
class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    email: str
    role: str
    referral_code: str
    referrer_id: Optional[str] = None
    status: str
    is_verified: bool
    created_at: datetime

class WalletResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user_id: str
    original_principal_cents: int
    principal_credits_cents: int
    roi_balance_cents: int
    direct_bonus_cents: int
    level_commission_cents: int
    withdrawn_total_cents: int
    total_balance_cents: int
    withdrawable_balance_cents: int

class ProfileResponse(BaseModel):
    user: UserResponse
    wallet: WalletResponse
    direct_referrals_count: int
    qualified_referrals_count: int
    is_qualified: bool
    total_network_count: int

# ----------------- Deposit Schemas -----------------
class DepositCreateRequest(BaseModel):
    amount_usd: float = Field(..., gt=0)
    note: Optional[str] = None
    idempotency_key: Optional[str] = None

class DepositResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    amount_cents: int
    amount_usd: float
    status: str
    note: Optional[str]
    created_at: datetime
    confirmed_at: Optional[datetime]

class DepositReviewRequest(BaseModel):
    success: bool
    rejection_reason: Optional[str] = None

# ----------------- Commission & Referral Schemas -----------------
class CommissionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    deposit_id: str
    source_user_id: str
    source_user_name: Optional[str] = None
    recipient_user_id: str
    level: int
    commission_type: str
    rate_percent: float
    base_cents: int
    amount_cents: int
    status: str
    month_key: Optional[str] = None
    created_at: datetime

class ReferralNode(BaseModel):
    id: str
    name: str
    email: str
    referral_code: str
    level: int
    status: str
    has_funded_deposit: bool
    funded_amount_cents: int
    created_at: datetime

class ReferralLevelSummary(BaseModel):
    level: int
    rate_percent: float
    members_count: int
    funded_members_count: int
    total_commissions_cents: int
    required_directs: int = 0
    your_directs: int = 0
    is_level_qualified: bool = False

class ReferralNetworkResponse(BaseModel):
    referral_code: str
    referral_link: str
    total_direct_count: int
    qualified_direct_count: int
    is_qualified: bool
    total_network_count: int
    levels_summary: List[ReferralLevelSummary]
    members: List[ReferralNode]

# ----------------- Ledger Schemas -----------------
class LedgerEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    entry_type: str
    amount_cents: int
    balance_after_cents: int
    description: str
    reference_id: Optional[str]
    created_at: datetime

# ----------------- Withdrawal Schemas -----------------
class WithdrawalCreateRequest(BaseModel):
    amount_usd: float = Field(..., gt=0)
    payout_method: Optional[str] = "SWIFT_WIRE"
    payout_details: Optional[str] = None

class WithdrawalResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    amount_cents: int
    amount_usd: float
    principal_portion_cents: int
    roi_portion_cents: int
    commission_portion_cents: int
    is_early_withdrawal: bool
    month_key: str
    status: str
    payout_method: str
    payout_details: Optional[str]
    rejection_reason: Optional[str]
    created_at: datetime
    reviewed_at: Optional[datetime]

class WithdrawalReviewRequest(BaseModel):
    approve: bool
    rejection_reason: Optional[str] = None

# ----------------- Monthly Cycle Schemas -----------------
class MonthlyCycleRequest(BaseModel):
    month_key: Optional[str] = None

class MonthlyCycleRunResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    month_key: str
    total_eligible_deposits: int
    total_roi_cents: int
    total_principal_cents: int
    status: str
    executed_at: datetime

# ----------------- Notification Schemas -----------------
class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    title: str
    message: str
    notif_type: str
    is_read: bool
    created_at: datetime

# ----------------- Support Ticket Schemas -----------------
class SupportTicketCreateRequest(BaseModel):
    subject: str = Field(..., min_length=3, max_length=255)
    category: str = "general"
    priority: str = "normal"
    initial_message: str = Field(..., min_length=5)

class SupportMessageCreateRequest(BaseModel):
    message: str = Field(..., min_length=1)

class SupportMessageResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    ticket_id: str
    sender_id: str
    sender_name: Optional[str] = None
    sender_role: str
    message: str
    created_at: datetime

class SupportTicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    user_id: str
    user_name: Optional[str] = None
    subject: str
    category: str
    priority: str
    status: str
    created_at: datetime
    updated_at: datetime
    messages: List[SupportMessageResponse] = []

# ----------------- System Rules & Admin Schemas -----------------
class SystemRuleResponse(BaseModel):
    direct_bonus: float
    level_rates: List[float]
    monthly_roi: float
    monthly_principal: float
    minimum_deposit: float
    min_withdrawal: float
    max_withdrawal: float
    demo_mode_active: bool
    last_monthly_run: Optional[datetime]

class SystemRuleUpdate(BaseModel):
    direct_bonus: Optional[float] = None
    level_rates: Optional[List[float]] = None
    monthly_roi: Optional[float] = None
    monthly_principal: Optional[float] = None
    minimum_deposit: Optional[float] = None
    min_withdrawal: Optional[float] = None
    max_withdrawal: Optional[float] = None

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    admin_id: Optional[str]
    action: str
    entity_type: str
    entity_id: str
    detail: Optional[str]
    created_at: datetime

class AdminUserStatusUpdate(BaseModel):
    status: str  # 'active', 'suspended'

# ----------------- Public Schemas -----------------
class ContactInquiryRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    subject: str = Field(..., min_length=3)
    message: str = Field(..., min_length=10)

class PublicStatsResponse(BaseModel):
    platform_name: str = "Royal Bull Capital"
    tagline: str = "TRADE | GROW | TOGETHER"
    demo_mode: bool = False
    total_registered_users: int
    total_deposits_usd: float = 0.0
    total_commissions_usd: float = 0.0
    total_withdrawals_usd: float = 0.0
    total_demo_deposits_usd: float = 0.0
    total_demo_commissions_usd: float = 0.0
    total_demo_withdrawals_usd: float = 0.0
    level_commission_total_rate: float
    direct_bonus_rate: float
