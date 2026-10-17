import os
from datetime import datetime
from sqlalchemy.orm import Session
from database import Base, engine, SessionLocal
import models
import security

def reset_and_seed_production_data(db: Session):
    """
    Initializes a clean production environment for manual UAT:
    - Creates database tables
    - Cleans all demo transactions, mock deposits, mock ledger entries, and test users
    - Seeds default system rule with demo_mode_active = False
    - Seeds ONLY the root superadmin account (admin@royalbull.com)
    - Zero fake customer accounts, zero mock transactions
    """
    Base.metadata.create_all(bind=engine)

    # Purge all previous data cleanly
    db.query(models.Commission).delete()
    db.query(models.LedgerEntry).delete()
    db.query(models.MonthlyCycleEntry).delete()
    db.query(models.MonthlyCycleRun).delete()
    db.query(models.Withdrawal).delete()
    db.query(models.Deposit).delete()
    db.query(models.SupportMessage).delete()
    db.query(models.SupportTicket).delete()
    db.query(models.Notification).delete()
    db.query(models.AuditLog).delete()
    db.query(models.RefreshToken).delete()
    db.query(models.Wallet).delete()
    db.query(models.User).delete()
    db.query(models.SystemRule).delete()
    db.commit()

    # 1. System Rule Configuration (Production Baseline)
    rule = models.SystemRule(
        id="global",
        direct_bonus=5.00,
        level_rates="[20, 15, 10, 8, 7, 6, 5, 4, 3, 2]",
        monthly_roi=5.00,
        monthly_principal=5.00,
        minimum_deposit=100.00,
        min_withdrawal=20.00,
        max_withdrawal=50000.00,
        demo_mode_active=False
    )
    db.add(rule)
    db.commit()

    # 2. Seed Single Root Superadmin Account for manual administration
    admin_password = os.getenv("INITIAL_ADMIN_PASSWORD", "Admin123!")

    admin_user = models.User(
        id="usr_admin",
        name="Royal Bull Admin",
        email="admin@royalbull.com",
        password_hash=security.hash_password(admin_password),
        role="superadmin",
        referral_code="ROYALADMIN",
        referrer_id=None,
        status="active",
        is_verified=True,
        created_at=datetime.utcnow()
    )
    db.add(admin_user)
    db.flush()

    # Create empty wallet for admin
    db.add(models.Wallet(user_id=admin_user.id, original_principal_cents=0))
    
    # Audit log of initialization
    audit = models.AuditLog(
        id="aud_init_clean",
        admin_id=admin_user.id,
        action="SYSTEM_INITIALIZED",
        entity_type="system",
        entity_id="global",
        detail="Production-ready database initialized with zero demo data and root administrator."
    )
    db.add(audit)

    db.commit()
    print("Royal Bull Capital clean production database initialized successfully.")

# Alias for backward compatibility if called elsewhere
reset_and_seed_demo_data = reset_and_seed_production_data

if __name__ == "__main__":
    db = SessionLocal()
    try:
        reset_and_seed_production_data(db)
    finally:
        db.close()
