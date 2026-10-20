import os
import sys
import pytest
from datetime import datetime
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from database import Base, get_db
import models
import security
import seed
from main import app

SEC_DB_URL = "sqlite:///./test_sec_royal_bull.db"
sec_engine = create_engine(SEC_DB_URL, connect_args={"check_same_thread": False})
SecSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=sec_engine)

@pytest.fixture(scope="module")
def sec_db():
    Base.metadata.drop_all(bind=sec_engine)
    Base.metadata.create_all(bind=sec_engine)
    db = SecSessionLocal()
    seed.reset_and_seed_production_data(db)

    def override_sec_get_db():
        session = SecSessionLocal()
        try:
            yield session
        finally:
            session.close()

    app.dependency_overrides[get_db] = override_sec_get_db
    yield db
    db.close()
    app.dependency_overrides.pop(get_db, None)
    sec_engine.dispose()
    try:
        if os.path.exists("test_sec_royal_bull.db"):
            os.remove("test_sec_royal_bull.db")
    except Exception:
        pass

@pytest.fixture(scope="module")
def sec_client():
    return TestClient(app)

class TestWalletSecurityAndIntegrity:
    """
    Phases 7, 8, 9:
    Wallet Lifecycle, Withdrawal Processing, Security Isolation, Token Rotation, and Ledger Integrity
    """

    def test_customer_registration_and_auth_isolation(self, sec_db, sec_client):
        # 1. Register Alice under ROYALADMIN
        res_a = sec_client.post("/api/auth/register", json={
            "name": "Alice Morgan",
            "email": "alice@security.com",
            "password": "Password123!",
            "referral_code": "ROYALADMIN"
        })
        assert res_a.status_code == 200, res_a.text
        token_a = res_a.json()["access_token"]
        refresh_a = res_a.json()["refresh_token"]

        # 2. Register Bob under Alice's referral code
        alice_code = res_a.json()["user"]["referral_code"]
        res_b = sec_client.post("/api/auth/register", json={
            "name": "Bob Vance",
            "email": "bob@security.com",
            "password": "Password123!",
            "referral_code": alice_code
        })
        assert res_b.status_code == 200, res_b.text
        token_b = res_b.json()["access_token"]

        # 3. Security Boundary: Customer cannot access Admin endpoints
        headers_a = {"Authorization": f"Bearer {token_a}"}
        res_admin = sec_client.get("/api/admin/overview", headers=headers_a)
        assert res_admin.status_code == 403, "Customer inappropriately allowed to access admin overview!"

        res_rules = sec_client.post("/api/admin/rules", headers=headers_a, json={"monthly_roi": 50.0})
        assert res_rules.status_code == 403, "Customer inappropriately allowed to modify system rules!"

        # 4. Refresh token rotation & single-use test
        res_ref1 = sec_client.post("/api/auth/refresh", json={"refresh_token": refresh_a})
        assert res_ref1.status_code == 200, res_ref1.text
        new_refresh = res_ref1.json()["refresh_token"]
        assert new_refresh != refresh_a, "Refresh token was not rotated!"

        # Attempt replay attack with old refresh token: must fail
        res_replay = sec_client.post("/api/auth/refresh", json={"refresh_token": refresh_a})
        assert res_replay.status_code == 401, "Revoked refresh token was inappropriately accepted!"

    def test_withdrawal_limits_and_validation(self, sec_db, sec_client):
        # Login Alice
        login = sec_client.post("/api/auth/login", json={"email": "alice@security.com", "password": "Password123!"})
        headers_a = {"Authorization": f"Bearer {login.json()['access_token']}"}

        # 1. Attempt withdrawal with zero balance
        res_fail_bal = sec_client.post("/api/customer/withdrawals", headers=headers_a, json={
            "amount_usd": 50.0,
            "payout_method": "SWIFT_WIRE",
            "payout_details": "IBAN123"
        })
        assert res_fail_bal.status_code == 400
        assert "Insufficient available balance" in res_fail_bal.text

        # 2. Below minimum ($20.00)
        res_min = sec_client.post("/api/customer/withdrawals", headers=headers_a, json={
            "amount_usd": 15.0,
            "payout_method": "SWIFT_WIRE"
        })
        assert res_min.status_code == 400
        assert "Minimum withdrawal is $20.00" in res_min.text

        # 3. Above maximum ($50,000.00)
        res_max = sec_client.post("/api/customer/withdrawals", headers=headers_a, json={
            "amount_usd": 60000.0,
            "payout_method": "SWIFT_WIRE"
        })
        assert res_max.status_code == 400
        assert "Maximum withdrawal per request is $50000.00" in res_max.text

    def test_deposit_and_withdrawal_lifecycle_and_ledger_debit(self, sec_db, sec_client):
        # Login Admin
        admin_login = sec_client.post("/api/auth/login", json={"email": "admin@royalbull.com", "password": "Admin123!"})
        admin_headers = {"Authorization": f"Bearer {admin_login.json()['access_token']}"}

        # Login Alice
        alice_login = sec_client.post("/api/auth/login", json={"email": "alice@security.com", "password": "Password123!"})
        alice_headers = {"Authorization": f"Bearer {alice_login.json()['access_token']}"}
        alice_id = alice_login.json()["user"]["id"]

        # Alice creates a $500 deposit
        dep_res = sec_client.post("/api/customer/deposits", headers=alice_headers, json={"amount_usd": 500.0, "note": "Initial Deposit"})
        assert dep_res.status_code == 200, dep_res.text
        dep_id = dep_res.json()["id"]

        # Admin approves deposit
        app_res = sec_client.post(f"/api/admin/deposits/{dep_id}/review", headers=admin_headers, json={"success": True})
        assert app_res.status_code == 200, app_res.text

        # Verify Alice's balance is now $500.00
        prof = sec_client.get("/api/customer/profile", headers=alice_headers).json()
        assert prof["wallet"]["total_balance_cents"] == 50000

        # Alice requests a $100 withdrawal
        wd_res = sec_client.post("/api/customer/withdrawals", headers=alice_headers, json={
            "amount_usd": 100.0,
            "payout_method": "SWIFT_WIRE",
            "payout_details": "AE070330000000001234567"
        })
        assert wd_res.status_code == 200, wd_res.text
        wd_id = wd_res.json()["id"]

        # Frequency rule: Alice cannot request a second withdrawal in the same month
        wd_dup = sec_client.post("/api/customer/withdrawals", headers=alice_headers, json={
            "amount_usd": 50.0,
            "payout_method": "SWIFT_WIRE"
        })
        assert wd_dup.status_code == 400
        assert "already have an active or approved withdrawal request" in wd_dup.text

        # Admin reviews and approves withdrawal
        rev_res = sec_client.post(f"/api/admin/withdrawals/{wd_id}/review", headers=admin_headers, json={"approve": True})
        assert rev_res.status_code == 200, rev_res.text

        # Alice's remaining balance must be exactly $400.00 (40,000 cents)
        prof_after = sec_client.get("/api/customer/profile", headers=alice_headers).json()
        assert prof_after["wallet"]["total_balance_cents"] == 40000
        assert prof_after["wallet"]["withdrawn_total_cents"] == 10000

        # Ledger entries check
        ledgers = sec_db.query(models.LedgerEntry).filter(models.LedgerEntry.user_id == alice_id).all()
        assert len(ledgers) >= 2
        wd_ledger = [l for l in ledgers if l.entry_type == "withdrawal"][0]
        assert wd_ledger.amount_cents == -10000  # Negative debit
        assert wd_ledger.balance_after_cents == 40000

    def test_support_ticket_isolation(self, sec_db, sec_client):
        # Alice creates a ticket
        alice_login = sec_client.post("/api/auth/login", json={"email": "alice@security.com", "password": "Password123!"})
        alice_headers = {"Authorization": f"Bearer {alice_login.json()['access_token']}"}

        t_res = sec_client.post("/api/customer/tickets", headers=alice_headers, json={
            "subject": "Private Query",
            "category": "deposit",
            "priority": "normal",
            "initial_message": "Confidential deposit questions"
        })
        assert t_res.status_code == 200, t_res.text
        ticket_id = t_res.json()["id"]

        # Bob logs in and verifies list of tickets only contains Bob's tickets (zero)
        bob_login = sec_client.post("/api/auth/login", json={"email": "bob@security.com", "password": "Password123!"})
        bob_headers = {"Authorization": f"Bearer {bob_login.json()['access_token']}"}

        t_bob = sec_client.get("/api/customer/tickets", headers=bob_headers)
        assert t_bob.status_code == 200
        assert len(t_bob.json()) == 0, "Customer Bob was able to see Alice's support tickets in ticket list!"
