import json
from datetime import datetime
from sqlalchemy import (
    Column, String, Boolean, BigInteger, Numeric, DateTime,
    ForeignKey, Text, Integer, Index
)
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(32), nullable=False, default="customer")  # 'superadmin', 'admin', 'customer'
    referral_code = Column(String(64), unique=True, index=True, nullable=False)
    referrer_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    status = Column(String(32), nullable=False, default="active")  # 'active', 'suspended'
    is_verified = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    referrer = relationship("User", remote_side=[id], backref="direct_referrals")
    wallet = relationship("Wallet", back_populates="user", uselist=False, cascade="all, delete-orphan")
    deposits = relationship("Deposit", back_populates="user", cascade="all, delete-orphan")
    withdrawals = relationship("Withdrawal", back_populates="user", foreign_keys="Withdrawal.user_id", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    ledger_entries = relationship("LedgerEntry", back_populates="user", cascade="all, delete-orphan")
    support_tickets = relationship("SupportTicket", back_populates="user", cascade="all, delete-orphan")


class Wallet(Base):
    __tablename__ = "wallets"

    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    original_principal_cents = Column(BigInteger, default=0, nullable=False)
    principal_credits_cents = Column(BigInteger, default=0, nullable=False)
    roi_balance_cents = Column(BigInteger, default=0, nullable=False)
    direct_bonus_cents = Column(BigInteger, default=0, nullable=False)
    level_commission_cents = Column(BigInteger, default=0, nullable=False)
    withdrawn_total_cents = Column(BigInteger, default=0, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="wallet")

    @property
    def total_balance_cents(self) -> int:
        return (
            self.original_principal_cents
            + self.principal_credits_cents
            + self.roi_balance_cents
            + self.direct_bonus_cents
            + self.level_commission_cents
        )

    @property
    def withdrawable_balance_cents(self) -> int:
        return self.total_balance_cents


class Deposit(Base):
    __tablename__ = "deposits"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount_cents = Column(BigInteger, nullable=False)
    status = Column(String(32), default="pending", nullable=False)  # 'pending', 'confirmed', 'failed', 'cancelled'
    idempotency_key = Column(String(128), unique=True, nullable=True, index=True)
    note = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    confirmed_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="deposits")
    commissions = relationship("Commission", back_populates="deposit", cascade="all, delete-orphan")


class Commission(Base):
    __tablename__ = "commissions"

    id = Column(String(64), primary_key=True, index=True)
    deposit_id = Column(String(64), ForeignKey("deposits.id", ondelete="CASCADE"), nullable=False, index=True)
    source_user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    recipient_user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    level = Column(Integer, nullable=False)  # 0 for direct bonus, 1-10 for level commissions
    commission_type = Column(String(32), nullable=False)  # 'direct_bonus', 'level_commission'
    rate_percent = Column(Numeric(5, 2), nullable=False)
    base_cents = Column(BigInteger, nullable=False)
    amount_cents = Column(BigInteger, nullable=False)
    idempotency_key = Column(String(128), unique=True, nullable=False, index=True)
    status = Column(String(32), default="credited", nullable=False)  # 'credited', 'reversed'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    deposit = relationship("Deposit", back_populates="commissions")
    source_user = relationship("User", foreign_keys=[source_user_id])
    recipient_user = relationship("User", foreign_keys=[recipient_user_id])


class LedgerEntry(Base):
    __tablename__ = "ledger"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    entry_type = Column(String(64), nullable=False)  # 'deposit', 'direct_bonus', 'level_commission', 'roi_credit', 'principal_credit', 'withdrawal'
    amount_cents = Column(BigInteger, nullable=False)  # Positive for credit, negative for debit
    balance_after_cents = Column(BigInteger, nullable=False, default=0)
    description = Column(Text, nullable=False)
    reference_id = Column(String(64), nullable=True, index=True)
    idempotency_key = Column(String(128), nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="ledger_entries")


class MonthlyCycleRun(Base):
    __tablename__ = "monthly_cycle_runs"

    id = Column(String(64), primary_key=True, index=True)
    month_key = Column(String(32), unique=True, nullable=False, index=True)  # e.g. '2026-10'
    admin_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    total_eligible_deposits = Column(Integer, default=0, nullable=False)
    total_roi_cents = Column(BigInteger, default=0, nullable=False)
    total_principal_cents = Column(BigInteger, default=0, nullable=False)
    status = Column(String(32), default="completed", nullable=False)
    executed_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    entries = relationship("MonthlyCycleEntry", back_populates="run", cascade="all, delete-orphan")


class MonthlyCycleEntry(Base):
    __tablename__ = "monthly_cycle_entries"

    id = Column(String(64), primary_key=True, index=True)
    run_id = Column(String(64), ForeignKey("monthly_cycle_runs.id", ondelete="CASCADE"), nullable=False, index=True)
    cycle_key = Column(String(128), unique=True, nullable=False, index=True)  # depositId_monthKey
    deposit_id = Column(String(64), ForeignKey("deposits.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    roi_cents = Column(BigInteger, nullable=False)
    principal_cents = Column(BigInteger, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    run = relationship("MonthlyCycleRun", back_populates="entries")


class Withdrawal(Base):
    __tablename__ = "withdrawals"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    amount_cents = Column(BigInteger, nullable=False)
    principal_portion_cents = Column(BigInteger, default=0, nullable=False)
    roi_portion_cents = Column(BigInteger, default=0, nullable=False)
    commission_portion_cents = Column(BigInteger, default=0, nullable=False)
    is_early_withdrawal = Column(Boolean, default=False, nullable=False)
    month_key = Column(String(32), nullable=False)
    status = Column(String(32), default="pending", nullable=False)  # 'pending', 'approved', 'rejected', 'cancelled'
    payout_method = Column(String(64), default="SWIFT_WIRE", nullable=False)
    payout_details = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    reviewed_by = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", foreign_keys=[user_id], back_populates="withdrawals")
    reviewer = relationship("User", foreign_keys=[reviewed_by])


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notif_type = Column(String(64), default="system", nullable=False)  # 'referral', 'deposit', 'commission', 'cycle', 'withdrawal', 'system'
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="notifications")


class SupportTicket(Base):
    __tablename__ = "support_tickets"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    subject = Column(String(255), nullable=False)
    category = Column(String(64), default="general", nullable=False)  # 'general', 'deposit', 'withdrawal', 'referral', 'tech'
    priority = Column(String(32), default="normal", nullable=False)  # 'low', 'normal', 'high'
    status = Column(String(32), default="open", nullable=False)  # 'open', 'in_progress', 'resolved', 'closed'
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="support_tickets")
    messages = relationship("SupportMessage", back_populates="ticket", cascade="all, delete-orphan", order_by="SupportMessage.created_at.asc()")


class SupportMessage(Base):
    __tablename__ = "support_messages"

    id = Column(String(64), primary_key=True, index=True)
    ticket_id = Column(String(64), ForeignKey("support_tickets.id", ondelete="CASCADE"), nullable=False, index=True)
    sender_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    sender_role = Column(String(32), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    ticket = relationship("SupportTicket", back_populates="messages")
    sender = relationship("User")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(64), primary_key=True, index=True)
    admin_id = Column(String(64), nullable=True, index=True)
    action = Column(String(64), nullable=False)
    entity_type = Column(String(64), nullable=False)
    entity_id = Column(String(64), nullable=False)
    detail = Column(Text, nullable=True)
    ip_address = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class SystemRule(Base):
    __tablename__ = "system_rules"

    id = Column(String(32), primary_key=True, default="global")
    direct_bonus = Column(Numeric(5, 2), default=5.00, nullable=False)
    level_rates = Column(Text, default="[20, 15, 10, 8, 7, 6, 5, 4, 3, 2]", nullable=False)
    monthly_roi = Column(Numeric(5, 2), default=5.00, nullable=False)
    monthly_principal = Column(Numeric(5, 2), default=5.00, nullable=False)
    minimum_deposit = Column(Numeric(10, 2), default=100.00, nullable=False)
    min_withdrawal = Column(Numeric(10, 2), default=20.00, nullable=False)
    max_withdrawal = Column(Numeric(10, 2), default=50000.00, nullable=False)
    demo_mode_active = Column(Boolean, default=False, nullable=False)
    last_monthly_run = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    def get_level_rates(self):
        try:
            return json.loads(self.level_rates)
        except Exception:
            return [20, 15, 10, 8, 7, 6, 5, 4, 3, 2]


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    id = Column(String(64), primary_key=True, index=True)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token_hash = Column(String(255), unique=True, index=True, nullable=False)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
