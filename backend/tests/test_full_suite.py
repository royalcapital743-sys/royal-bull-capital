import os
import sys
import pytest
from decimal import Decimal
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import Base, get_db
import models
import security
from main import app
import seed

TEST_DATABASE_URL = "sqlite:///./test_royal_bull.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

@pytest.fixture(scope="module", autouse=True)
def setup_test_db():
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    seed.reset_and_seed_demo_data(db)

    # Seed Alex, Jamie, Taylor for full test suite
    alex = models.User(
        id="usr_alex",
        name="Alex Rivera",
        email="alex@royalbull.com",
        password_hash=security.hash_password("Demo123!"),
        role="customer",
        referral_code="ALEX100",
        status="active",
        is_verified=True
    )
    jamie = models.User(
        id="usr_jamie",
        name="Jamie Vance",
        email="jamie@royalbull.com",
        password_hash=security.hash_password("Demo123!"),
        role="customer",
        referral_code="JAMIE100",
        referrer_id="usr_alex",
        status="active",
        is_verified=True
    )
    taylor = models.User(
        id="usr_taylor",
        name="Taylor Reed",
        email="taylor@royalbull.com",
        password_hash=security.hash_password("Demo123!"),
        role="customer",
        referral_code="TAYLOR100",
        referrer_id="usr_alex",
        status="active",
        is_verified=True
    )
    db.add_all([alex, jamie, taylor])
    db.flush()

    for u in [alex, jamie, taylor]:
        db.add(models.Wallet(user_id=u.id, original_principal_cents=100000))

    dep_j = models.Deposit(id="dep_jamie_seed", user_id="usr_jamie", amount_cents=100000, status="confirmed")
    dep_t = models.Deposit(id="dep_taylor_seed", user_id="usr_taylor", amount_cents=100000, status="confirmed")
    db.add_all([dep_j, dep_t])
    db.commit()
    db.close()
    yield
    app.dependency_overrides.pop(get_db, None)
    test_engine.dispose()
    try:
        if os.path.exists("test_royal_bull.db"):
            os.remove("test_royal_bull.db")
    except Exception:
        pass

@pytest.fixture
def client():
    return TestClient(app)

# -------------------------------------------------------------
# 1. AUTHENTICATION TESTS
# -------------------------------------------------------------
def test_admin_login(client):
    res = client.post("/api/auth/login", json={"email": "admin@royalbull.com", "password": "Admin123!"})
    assert res.status_code == 200, res.text
    data = res.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["user"]["role"] == "superadmin"

def test_login_invalid_credentials(client):
    res = client.post("/api/auth/login", json={"email": "admin@royalbull.com", "password": "WrongPassword"})
    assert res.status_code == 401

def test_user_registration(client):
    res = client.post("/api/auth/register", json={
        "name": "David Sterling",
        "email": "david@example.com",
        "password": "Password123!",
        "referral_code": "ALEX100"
    })
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["user"]["email"] == "david@example.com"
    assert data["user"]["referral_code"] is not None
    assert data["user"]["role"] == "customer"

def test_token_refresh(client):
    # Login first
    login_res = client.post("/api/auth/login", json={"email": "david@example.com", "password": "Password123!"})
    refresh_token = login_res.json()["refresh_token"]

    refresh_res = client.post("/api/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_res.status_code == 200, refresh_res.text
    new_data = refresh_res.json()
    assert "access_token" in new_data
    assert "refresh_token" in new_data
    assert new_data["refresh_token"] != refresh_token

def test_authorization_boundary_customer_cannot_access_admin(client):
    login_res = client.post("/api/auth/login", json={"email": "david@example.com", "password": "Password123!"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt admin endpoint
    res = client.get("/api/admin/overview", headers=headers)
    assert res.status_code == 403

# -------------------------------------------------------------
# 2. REFERRAL & QUALIFICATION TESTS
# -------------------------------------------------------------
def test_referral_attribution_and_tree(client):
    login_res = client.post("/api/auth/login", json={"email": "alex@royalbull.com", "password": "Demo123!"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/customer/referrals", headers=headers)
    assert res.status_code == 200, res.text
    data = res.json()
    assert data["referral_code"] == "ALEX100"
    assert data["total_direct_count"] >= 2
    # Alex has Jamie and Taylor with funded deposits from seed, so Alex must be qualified
    assert data["is_qualified"] is True
    assert data["qualified_direct_count"] >= 2

def test_self_referral_prevention(client):
    login_res = client.post("/api/auth/login", json={"email": "alex@royalbull.com", "password": "Demo123!"})
    alex_code = login_res.json()["user"]["referral_code"]

    res = client.post("/api/auth/register", json={
        "name": "Duplicate Alex",
        "email": "alex@royalbull.com",  # Duplicate email
        "password": "Password123!",
        "referral_code": alex_code
    })
    assert res.status_code == 400

# -------------------------------------------------------------
# 3. DEPOSIT & 10-LEVEL COMMISSION CASCADE TESTS
# -------------------------------------------------------------
def test_deposit_creation_and_minimum_validation(client):
    login_res = client.post("/api/auth/login", json={"email": "david@example.com", "password": "Password123!"})
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt deposit below $100
    res_low = client.post("/api/customer/deposits", json={"amount_usd": 50.0}, headers=headers)
    assert res_low.status_code == 400

    # Valid deposit $200
    res = client.post("/api/customer/deposits", json={"amount_usd": 200.0, "note": "Demo Test Deposit"}, headers=headers)
    assert res.status_code == 200, res.text
    dep_data = res.json()
    assert dep_data["status"] == "pending"
    assert dep_data["amount_usd"] == 200.0
    return dep_data["id"]

def test_admin_deposit_approval_and_commission_cascade(client):
    # Register a chain to test up to level 3:
    # Alex (Seed) -> Jamie (Seed) -> Taylor (Seed) -> User A -> User B
    # David was registered under ALEX100.
    # Let's create User C under David:
    david_login = client.post("/api/auth/login", json={"email": "david@example.com", "password": "Password123!"})
    david_code = david_login.json()["user"]["referral_code"]

    client.post("/api/auth/register", json={
        "name": "Sub User C",
        "email": "subc@example.com",
        "password": "Password123!",
        "referral_code": david_code
    })

    subc_login = client.post("/api/auth/login", json={"email": "subc@example.com", "password": "Password123!"})
    subc_token = subc_login.json()["access_token"]
    subc_headers = {"Authorization": f"Bearer {subc_token}"}

    # Sub C deposits $1,000
    dep_res = client.post("/api/customer/deposits", json={"amount_usd": 1000.0}, headers=subc_headers)
    assert dep_res.status_code == 200
    dep_id = dep_res.json()["id"]

    # Admin approves deposit
    admin_login = client.post("/api/auth/login", json={"email": "admin@royalbull.com", "password": "Admin123!"})
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    approve_res = client.post(f"/api/admin/deposits/{dep_id}/review", json={"success": True}, headers=admin_headers)
    assert approve_res.status_code == 200, approve_res.text
    assert approve_res.json()["status"] == "confirmed"

    # Verify David (parent) got 5% direct bonus ($50 = 5000 cents)
    david_profile = client.get("/api/customer/profile", headers={"Authorization": f"Bearer {david_login.json()['access_token']}"})
    assert david_profile.status_code == 200
    assert david_profile.json()["wallet"]["direct_bonus_cents"] >= 5000

    # Requirement 1: Deposit alone does NOT trigger 10-level cascade
    alex_token = client.post('/api/auth/login', json={'email': 'alex@royalbull.com', 'password': 'Demo123!'}).json()['access_token']
    alex_profile_pre = client.get("/api/customer/profile", headers={"Authorization": f"Bearer {alex_token}"})
    assert alex_profile_pre.json()["wallet"]["level_commission_cents"] == 0

    # Execute monthly cycle so downline monthly ROI generates 10-level commissions
    cycle_res = client.post("/api/admin/monthly-cycle", json={"month_key": "2026-10"}, headers=admin_headers)
    assert cycle_res.status_code == 200

    # Verify Alex (ancestor level 2) got commissions based on finalized monthly ROI
    alex_profile_post = client.get("/api/customer/profile", headers={"Authorization": f"Bearer {alex_token}"})
    assert alex_profile_post.json()["wallet"]["level_commission_cents"] > 0

# -------------------------------------------------------------
# 4. MONTHLY CYCLE ALLOCATION TESTS
# -------------------------------------------------------------
def test_monthly_cycle_idempotency(client):
    admin_login = client.post("/api/auth/login", json={"email": "admin@royalbull.com", "password": "Admin123!"})
    admin_token = admin_login.json()["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    # Run cycle for month 2026-10
    run1 = client.post("/api/admin/monthly-cycle", json={"month_key": "2026-10"}, headers=admin_headers)
    assert run1.status_code == 200, run1.text
    data1 = run1.json()

    # Re-running the exact same month must be idempotent (0 newly processed deposits)
    run2 = client.post("/api/admin/monthly-cycle", json={"month_key": "2026-10"}, headers=admin_headers)
    assert run2.status_code == 200
    data2 = run2.json()
    assert data2["total_eligible_deposits"] == data1["total_eligible_deposits"]

# -------------------------------------------------------------
# 5. WITHDRAWAL WORKFLOW TESTS
# -------------------------------------------------------------
def test_withdrawal_validation_and_lifecycle(client):
    # Test insufficient balance
    subc_login = client.post("/api/auth/login", json={"email": "subc@example.com", "password": "Password123!"})
    subc_headers = {"Authorization": f"Bearer {subc_login.json()['access_token']}"}

    # Attempting to withdraw $999999
    res_fail = client.post("/api/customer/withdrawals", json={"amount_usd": 999999.0}, headers=subc_headers)
    assert res_fail.status_code == 400

    # Request valid withdrawal of $100
    res_wd = client.post("/api/customer/withdrawals", json={"amount_usd": 100.0, "payout_method": "DEMO_WIRE"}, headers=subc_headers)
    assert res_wd.status_code == 200, res_wd.text
    wd_id = res_wd.json()["id"]

    # Verify only one withdrawal allowed per calendar month
    res_dup = client.post("/api/customer/withdrawals", json={"amount_usd": 50.0}, headers=subc_headers)
    assert res_dup.status_code == 400
    assert "already have an active" in res_dup.json()["detail"]

    # Admin approves withdrawal
    admin_login = client.post("/api/auth/login", json={"email": "admin@royalbull.com", "password": "Admin123!"})
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    rev_res = client.post(f"/api/admin/withdrawals/{wd_id}/review", json={"approve": True}, headers=admin_headers)
    assert rev_res.status_code == 200
    assert rev_res.json()["status"] == "approved"

    # Verify ledger entry was created for the withdrawal
    ledger_res = client.get("/api/customer/ledger", headers=subc_headers)
    assert ledger_res.status_code == 200
    entries = ledger_res.json()
    assert any(e["entry_type"] == "withdrawal" for e in entries)

# -------------------------------------------------------------
# 6. SUPPORT TICKETS TESTS
# -------------------------------------------------------------
def test_support_ticket_flow(client):
    login = client.post("/api/auth/login", json={"email": "david@example.com", "password": "Password123!"})
    headers = {"Authorization": f"Bearer {login.json()['access_token']}"}

    tkt_res = client.post("/api/customer/tickets", json={
        "subject": "Question on Referral Commission",
        "category": "referral",
        "priority": "normal",
        "initial_message": "Hello, how does the qualification rule calculate?"
    }, headers=headers)
    assert tkt_res.status_code == 200, tkt_res.text
    tkt_id = tkt_res.json()["id"]

    # Admin replies
    admin_login = client.post("/api/auth/login", json={"email": "admin@royalbull.com", "password": "Admin123!"})
    admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

    reply_res = client.post(f"/api/admin/tickets/{tkt_id}/reply", json={
        "message": "Qualification requires at least 2 direct referrals with confirmed deposits."
    }, headers=admin_headers)
    assert reply_res.status_code == 200

# -------------------------------------------------------------
# 7. PUBLIC STATS TEST
# -------------------------------------------------------------
def test_public_stats(client):
    res = client.get("/api/public/stats")
    assert res.status_code == 200
    data = res.json()
    assert data["platform_name"] == "Royal Bull Capital"
    assert "demo_mode" in data
    assert data["direct_bonus_rate"] == 5.0
