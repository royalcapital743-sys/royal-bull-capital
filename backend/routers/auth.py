import uuid
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
import security

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

def generate_id(prefix: str) -> str:
    return f"{prefix}_{uuid.uuid4().hex[:12]}"

@router.post("/register", response_model=schemas.TokenResponse)
def register_user(req: schemas.UserRegisterRequest, db: Session = Depends(get_db)):
    # Check if email is already taken
    existing = db.query(models.User).filter(models.User.email == req.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists."
        )

    # Check referrer if provided
    referrer_id = None
    if req.referral_code:
        clean_code = req.referral_code.strip().upper()
        referrer = db.query(models.User).filter(
            models.User.referral_code == clean_code,
            models.User.status == "active"
        ).first()
        if not referrer:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Referral code '{clean_code}' was not found. Please verify and try again."
            )
        referrer_id = referrer.id

    # Generate unique user id and referral code
    user_id = generate_id("usr")
    prefix = "".join(filter(str.isalnum, req.name))[:4].upper() or "ROYAL"
    rand_suffix = uuid.uuid4().hex[:4].upper()
    new_referral_code = f"{prefix}{rand_suffix}"

    # Ensure referral code is unique
    while db.query(models.User).filter(models.User.referral_code == new_referral_code).first():
        new_referral_code = f"{prefix}{uuid.uuid4().hex[:4].upper()}"

    hashed_pw = security.hash_password(req.password)

    new_user = models.User(
        id=user_id,
        name=req.name.strip(),
        email=req.email.lower().strip(),
        password_hash=hashed_pw,
        role="customer",
        referral_code=new_referral_code,
        referrer_id=referrer_id,
        status="active",
        is_verified=True,
        created_at=datetime.utcnow()
    )
    db.add(new_user)
    db.flush()

    # Create associated wallet
    wallet = models.Wallet(user_id=new_user.id)
    db.add(wallet)

    # Create welcome notification
    welcome_notif = models.Notification(
        id=generate_id("notif"),
        user_id=new_user.id,
        title="Welcome to Royal Bull Capital",
        message="Your account is active. Explore your dashboard and wallet.",
        notif_type="system"
    )
    db.add(welcome_notif)

    # Audit log
    audit = models.AuditLog(
        id=generate_id("aud"),
        admin_id=new_user.id,
        action="USER_REGISTERED",
        entity_type="users",
        entity_id=new_user.id,
        detail=f"Registered with referral code '{req.referral_code or 'Direct'}'"
    )
    db.add(audit)

    # Issue JWT tokens
    access_token = security.create_access_token({"sub": new_user.id, "role": new_user.role})
    raw_refresh, refresh_hash = security.generate_refresh_token_pair()

    refresh_entry = models.RefreshToken(
        id=generate_id("rft"),
        user_id=new_user.id,
        token_hash=refresh_hash,
        expires_at=datetime.utcnow() + timedelta(days=security.REFRESH_TOKEN_EXPIRE_DAYS),
        is_revoked=False
    )
    db.add(refresh_entry)

    db.commit()
    db.refresh(new_user)

    return {
        "access_token": access_token,
        "refresh_token": raw_refresh,
        "token_type": "bearer",
        "user": new_user
    }

@router.post("/login", response_model=schemas.TokenResponse)
def login_user(req: schemas.UserLoginRequest, db: Session = Depends(get_db)):
    clean_email = req.email.lower().strip()
    user = db.query(models.User).filter(models.User.email == clean_email).first()

    if not user or not security.verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    if user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support."
        )

    # Issue JWT tokens
    access_token = security.create_access_token({"sub": user.id, "role": user.role})
    raw_refresh, refresh_hash = security.generate_refresh_token_pair()

    refresh_entry = models.RefreshToken(
        id=generate_id("rft"),
        user_id=user.id,
        token_hash=refresh_hash,
        expires_at=datetime.utcnow() + timedelta(days=security.REFRESH_TOKEN_EXPIRE_DAYS),
        is_revoked=False
    )
    db.add(refresh_entry)
    db.commit()

    return {
        "access_token": access_token,
        "refresh_token": raw_refresh,
        "token_type": "bearer",
        "user": user
    }

@router.post("/refresh")
def refresh_token(req: schemas.RefreshTokenRequest, db: Session = Depends(get_db)):
    import hashlib
    token_hash = hashlib.sha256(req.refresh_token.encode("utf-8")).hexdigest()

    token_record = db.query(models.RefreshToken).filter(
        models.RefreshToken.token_hash == token_hash,
        models.RefreshToken.is_revoked == False
    ).first()

    if not token_record or token_record.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token is expired or revoked. Please sign in again."
        )

    user = db.query(models.User).filter(models.User.id == token_record.user_id).first()
    if not user or user.status != "active":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is inactive."
        )

    # Rotate refresh token
    token_record.is_revoked = True
    new_raw_refresh, new_refresh_hash = security.generate_refresh_token_pair()
    new_refresh_entry = models.RefreshToken(
        id=generate_id("rft"),
        user_id=user.id,
        token_hash=new_refresh_hash,
        expires_at=datetime.utcnow() + timedelta(days=security.REFRESH_TOKEN_EXPIRE_DAYS),
        is_revoked=False
    )
    db.add(new_refresh_entry)

    new_access_token = security.create_access_token({"sub": user.id, "role": user.role})
    db.commit()

    return {
        "access_token": new_access_token,
        "refresh_token": new_raw_refresh,
        "token_type": "bearer"
    }

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(security.get_current_user)):
    return current_user

@router.post("/change-password")
def change_password(
    req: schemas.PasswordChangeRequest,
    current_user: models.User = Depends(security.get_current_user),
    db: Session = Depends(get_db)
):
    if not security.verify_password(req.current_password, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is not correct."
        )

    current_user.password_hash = security.hash_password(req.new_password)
    db.commit()
    return {"message": "Password updated successfully."}
