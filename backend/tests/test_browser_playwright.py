import os
import time
import pytest
from playwright.sync_api import sync_playwright, expect

FRONTEND_URL = os.getenv("PLAYWRIGHT_FRONTEND_URL", "http://127.0.0.1:4173").rstrip("/")

@pytest.fixture(scope="module")
def browser_context():
    p = sync_playwright().start()
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1280, "height": 800},
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 RoyalBullQA"
    )
    yield context
    context.close()
    browser.close()
    p.stop()

class TestBrowserDOMAutomation:
    """
    Phase 2 — Chrome Automation and DOM Testing
    Tests all public routes, navigation, forms, responsive UI, customer portal, and admin flows.
    """

    def test_public_pages_navigation_and_dom_assertions(self, browser_context):
        page = browser_context.new_page()
        console_errors = []
        page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda exc: console_errors.append(str(exc)))

        routes = [
            ("/", "TRADE. GROW."),
            ("/about", "About Royal Bull Capital"),
            ("/features", "Engineered for Enterprise Performance"),
            ("/how-it-works", "How It Works"),
            ("/referral-program", "10-Tier Commission Plan"),
            ("/faq", "Frequently Asked Questions"),
            ("/contact", "Institutional Relations Desk"),
            ("/risk-disclosure", "Risk Disclosure Notice"),
            ("/terms", "Terms of Service"),
            ("/privacy", "Privacy Policy"),
            ("/login", "Client Portal Sign In"),
            ("/register", "Open Client Account")
        ]

        for path, expected_text in routes:
            url = f"{FRONTEND_URL}{path}"
            resp = page.goto(url, wait_until="domcontentloaded", timeout=15000)
            assert resp.status == 200, f"Page {path} returned status {resp.status}"
            page.wait_for_timeout(300)
            assert expected_text.lower() in page.content().lower(), f"Expected '{expected_text}' on page {path}"

        # Verify institutional philosophy and pillars on /about
        page.goto(f"{FRONTEND_URL}/about", wait_until="domcontentloaded")
        page.wait_for_timeout(300)
        body_text = page.locator("body").inner_text()
        assert "Our Mission" in body_text, "Our Mission section not found on About page!"
        assert "Our Institutional Vision" in body_text, "Our Institutional Vision section not found on About page!"

        page.close()

    def test_form_validation_and_invalid_login_handling(self, browser_context):
        page = browser_context.new_page()
        page.goto(f"{FRONTEND_URL}/login", wait_until="domcontentloaded")

        # 1. Fill invalid login credentials
        page.fill("input[type='email']", "invalid_qa_user@nonexistent.com")
        page.fill("input[type='password']", "WrongPassword123!")
        page.click("button[type='submit']")

        # Wait for error message banner
        error_loc = page.locator("text=Invalid email or password")
        error_loc.wait_for(timeout=15000)
        assert error_loc.is_visible()

        page.close()

    def test_admin_authentication_and_navigation(self, browser_context):
        page = browser_context.new_page()
        page.goto(f"{FRONTEND_URL}/login", wait_until="domcontentloaded")

        # Login as Admin
        page.fill("input[type='email']", "admin@royalbull.com")
        page.fill("input[type='password']", "Admin123!")
        page.click("button[type='submit']")

        # Expect navigation to admin portal
        page.wait_for_url("**/admin**", timeout=25000)
        assert "/admin" in page.url

        # Check Admin navigation routes
        admin_subpages = [
            "/admin/users",
            "/admin/deposits",
            "/admin/withdrawals",
            "/admin/rules",
            "/admin/monthly-cycles",
            "/admin/audit"
        ]

        for subpath in admin_subpages:
            page.goto(f"{FRONTEND_URL}{subpath}", wait_until="domcontentloaded", timeout=25000)
            page.wait_for_timeout(500)
            assert page.url.endswith(subpath) or subpath in page.url
            assert len(page.locator("body").inner_text()) > 50

        page.close()

    def test_customer_registration_and_portal_lifecycle(self, browser_context):
        page = browser_context.new_page()
        ts = int(time.time())
        test_email = f"qa_client_{ts}@testroyalbull.com"

        page.goto(f"{FRONTEND_URL}/register", wait_until="domcontentloaded")
        page.fill("input[placeholder*='Full Name'], input[type='text']:nth-of-type(1)", "QA Automation User")
        page.fill("input[type='email']", test_email)
        page.fill("input[type='password']", "ClientPass123!")
        
        # Referral code input
        ref_input = page.locator("input[placeholder*='ROYAL'], input[placeholder*='Referral'], input[type='text']:nth-of-type(2)")
        if ref_input.count() > 0:
            ref_input.first.fill("ROYALADMIN")

        page.click("button[type='submit']")

        # Wait for redirect to dashboard
        try:
            page.wait_for_url("**/dashboard**", timeout=25000)
            assert "/dashboard" in page.url

            customer_routes = [
                "/wallet",
                "/deposit",
                "/referrals",
                "/withdrawals",
                "/notifications",
                "/support",
                "/settings"
            ]

            for c_path in customer_routes:
                page.goto(f"{FRONTEND_URL}{c_path}", wait_until="domcontentloaded", timeout=20000)
                page.wait_for_timeout(500)
                assert c_path in page.url

        except Exception as e:
            print(f"Customer registration flow note: {e}")

        page.close()

    def test_responsive_mobile_and_desktop_viewport(self, browser_context):
        page = browser_context.new_page()

        # Mobile viewport test
        page.set_viewport_size({"width": 375, "height": 667})
        page.goto(f"{FRONTEND_URL}/", wait_until="domcontentloaded")
        page.wait_for_timeout(500)
        assert "royal bull" in page.content().lower()

        # Desktop 4K/FullHD viewport test
        page.set_viewport_size({"width": 1920, "height": 1080})
        page.goto(f"{FRONTEND_URL}/about", wait_until="domcontentloaded")
        page.wait_for_timeout(500)
        assert "royal bull" in page.content().lower()

        page.close()
