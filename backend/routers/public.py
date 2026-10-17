import uuid
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas

router = APIRouter(prefix="/api/public", tags=["Public Portal"])

def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

@router.get("/stats", response_model=schemas.PublicStatsResponse)
def get_public_stats(db: Session = Depends(get_db)):
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    rates = rules.get_level_rates() if rules else [20, 15, 10, 8, 7, 6, 5, 4, 3, 2]
    direct_rate = float(rules.direct_bonus) if rules else 5.0

    user_count = db.query(models.User).filter(models.User.role == "customer").count()

    deposits = db.query(models.Deposit).filter(models.Deposit.status == "confirmed").all()
    dep_usd = sum(d.amount_cents for d in deposits) / 100.0

    comms = db.query(models.Commission).filter(models.Commission.status == "credited").all()
    comm_usd = sum(c.amount_cents for c in comms) / 100.0

    wds = db.query(models.Withdrawal).filter(models.Withdrawal.status == "approved").all()
    wd_usd = sum(w.amount_cents for w in wds) / 100.0

    return {
        "platform_name": "Royal Bull Capital",
        "tagline": "TRADE | GROW | TOGETHER",
        "demo_mode": rules.demo_mode_active if rules else False,
        "total_registered_users": user_count,
        "total_deposits_usd": dep_usd,
        "total_commissions_usd": comm_usd,
        "total_withdrawals_usd": wd_usd,
        "total_demo_deposits_usd": dep_usd,
        "total_demo_commissions_usd": comm_usd,
        "total_demo_withdrawals_usd": wd_usd,
        "level_commission_total_rate": sum(rates),
        "direct_bonus_rate": direct_rate
    }

@router.get("/rules")
def get_public_rules(db: Session = Depends(get_db)):
    rules = db.query(models.SystemRule).filter(models.SystemRule.id == "global").first()
    rates = rules.get_level_rates() if rules else [20, 15, 10, 8, 7, 6, 5, 4, 3, 2]
    return {
        "direct_bonus_percent": float(rules.direct_bonus) if rules else 5.0,
        "level_rates": rates,
        "level_rates_total": sum(rates),
        "monthly_roi_percent": float(rules.monthly_roi) if rules else 5.0,
        "monthly_principal_percent": float(rules.monthly_principal) if rules else 5.0,
        "minimum_deposit_usd": float(rules.minimum_deposit) if rules else 100.0,
        "qualification_criteria": "Active qualification requires at least 2 direct referrals with verified deposits."
    }

@router.post("/contact")
def submit_contact_inquiry(req: schemas.ContactInquiryRequest, db: Session = Depends(get_db)):
    # Persist as audit log or system support entry
    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=None,
        action="CONTACT_FORM_SUBMITTED",
        entity_type="inquiries",
        entity_id=req.email,
        detail=f"From: {req.name} ({req.email}) | Subject: {req.subject} | Message: {req.message}"
    )
    db.add(audit)
    db.commit()
    return {"message": "Thank you for contacting Royal Bull Capital. Our team will review your inquiry shortly."}
