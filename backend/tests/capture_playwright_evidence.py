import os
import time
from playwright.sync_api import sync_playwright

EVIDENCE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "scratch", "evidence"))
os.makedirs(EVIDENCE_DIR, exist_ok=True)

FRONTEND_URL = os.getenv("PLAYWRIGHT_FRONTEND_URL", "http://127.0.0.1:4173")

def capture_evidence():
    print(f"Capturing Playwright Chromium evidence against {FRONTEND_URL}...")
    p = sync_playwright().start()
    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1280, "height": 800},
        record_video_dir=EVIDENCE_DIR
    )
    # Start tracing
    context.tracing.start(screenshots=True, snapshots=True, sources=True)

    page = context.new_page()

    # 1. Homepage
    page.goto(f"{FRONTEND_URL}/", wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(EVIDENCE_DIR, "01_homepage.png"), full_page=True)
    print("Saved 01_homepage.png")

    # 2. About Us
    page.goto(f"{FRONTEND_URL}/about", wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(EVIDENCE_DIR, "02_about.png"), full_page=True)
    print("Saved 02_about.png")

    # 3. Referral Program (10 Tiers)
    page.goto(f"{FRONTEND_URL}/referral-program", wait_until="domcontentloaded")
    page.wait_for_timeout(1000)
    page.screenshot(path=os.path.join(EVIDENCE_DIR, "03_referral_program.png"), full_page=True)
    print("Saved 03_referral_program.png")

    # 4. Login Page
    page.goto(f"{FRONTEND_URL}/login", wait_until="domcontentloaded")
    page.wait_for_timeout(500)
    page.screenshot(path=os.path.join(EVIDENCE_DIR, "04_login.png"), full_page=True)
    print("Saved 04_login.png")

    # 5. Admin Login & Overview
    page.fill("input[type='email']", "admin@royalbull.com")
    page.fill("input[type='password']", "Admin123!")
    page.click("button[type='submit']")
    try:
        page.wait_for_url("**/admin**", timeout=15000)
        page.wait_for_timeout(1500)
        page.screenshot(path=os.path.join(EVIDENCE_DIR, "05_admin_overview.png"), full_page=True)
        print("Saved 05_admin_overview.png")
    except Exception as e:
        print(f"Admin overview note: {e}")

    # Stop tracing
    trace_path = os.path.join(EVIDENCE_DIR, "trace.zip")
    context.tracing.stop(path=trace_path)
    print(f"Saved trace to {trace_path}")

    page.close()
    context.close()
    browser.close()
    p.stop()
    print("Playwright evidence capture complete!")

if __name__ == "__main__":
    capture_evidence()
