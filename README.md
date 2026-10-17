# ROYAL BULL CAPITAL — Institutional Multi-Tier Forex Referral Platform

![Royal Bull Capital](/frontend/public/royal_bull_logo.png)

> **TRADE | GROW | TOGETHER**  
> An enterprise-grade, server-authoritative 10-tier referral network, double-entry wallet accounting system, and automated forex simulation engine.

---

## 1. Executive Architecture Overview

Royal Bull Capital replaces traditional client-side demo scripts with a robust, production-oriented multi-tier financial architecture:

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router 6, Recharts, Lucide React.
  - Bespoke luxury dark theme (obsidian `#0A0B0E`, metallic gold `#D97706` / `#FDE047`, and restrained charcoal accents).
  - 11 dedicated public pages (Home, About, Features, How It Works, Referral Program, FAQ, Contact, Risk Disclosure, Terms, Privacy Policy, Login/Register).
  - Protected Customer Portal (Overview, Demo Deposit, 10-Tier Downline Lineage, Wallet & Ledger Explorer, Withdrawals, Notifications Center, Support Desk, Settings).
  - Protected Administrator Console (KPI Counters, User Management & Status Toggles, Deposit Review Desk, Withdrawal State Machine, Rule Configuration, Monthly Allocation Simulator, Audit Logs).
- **Backend**: Python 3.11, FastAPI, Pydantic V2, SQLAlchemy 2.0.
  - Salted Argon2id / bcrypt password hashing (no plain text passwords).
  - OAuth2 Password Bearer with short-lived JWT Access Tokens and rotatable Refresh Tokens.
  - Role-Based Access Control (`superadmin`, `admin`, `customer`).
  - Server-authoritative calculations using integer minor units (cents) and explicit `Decimal` rounding.
  - Strict idempotency keys on deposits, commissions, and monthly cycle executions.
- **Persistence**: PostgreSQL 16 (with SQLite zero-config fallback for seamless local offline development).
- **Infrastructure**: Multi-stage Docker Compose (PostgreSQL, FastAPI Backend, React/Nginx Frontend).

---

## 2. Default Seed Credentials (Demo Baseline)

| Role | Name | Email | Password | Referral Code | Notes |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | Royal Bull Admin | `admin@royalbull.com` | `Admin123!` | `ROYALADMIN` | Full console access, reviews, rule editing |
| **Leader (Qualified)** | Alex Morgan | `alex@royalbull.com` | `Demo123!` | `ALEX100` | Has 2 funded direct referrals (Jamie & Taylor) |
| **Direct Referral 1** | Jamie Lee | `jamie@royalbull.com` | `Demo123!` | `JAMIE20` | Referred by Alex, deposit confirmed |
| **Direct Referral 2** | Taylor Reed | `taylor@royalbull.com` | `Demo123!` | `TAYLOR5` | Referred by Alex, deposit confirmed |

> [!NOTE]  
> All 4 accounts are pre-seeded in the database. 1-click credential fill buttons are provided on the login page for effortless evaluation.

---

## 3. Quick Start (Local Development)

### Prerequisites
- Python 3.11+
- Node.js 18+ and npm 9+

### Option A: One-Click Startup (Windows)
Run the included launcher in PowerShell or Command Prompt:
```powershell
.\start_royal_bull.ps1
```
or
```cmd
start_royal_bull.bat
```

### Option B: Manual Step-by-Step

#### 1. Backend Service
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
- API Endpoint: `http://localhost:8000`
- Interactive OpenAPI Swagger Docs: `http://localhost:8000/docs`

#### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 4. Docker Compose Deployment

To spin up the entire isolated stack (PostgreSQL 16 + FastAPI + Nginx React Frontend):

```bash
docker compose up --build -d
```
- Public Web Application: `http://localhost` (Port 80)
- Backend REST API: `http://localhost:8000` (Port 8000)
- PostgreSQL: `localhost:5432`

---

## 5. Automated Test Suite

A comprehensive Pytest test suite covering authentication, authorization boundaries, self-referral prevention, 10-tier commission cascades, qualification rules, monthly cycle idempotency, and withdrawal workflows is included in `backend/tests/test_full_suite.py`.

Run backend tests:
```bash
python -m pytest backend/tests/test_full_suite.py -v
```

Run frontend production build verification:
```bash
cd frontend
npm run build
```

---

## 6. Commission & Business Logic Rules

### 10-Level Hierarchy (80% Total Distribution)
- **Level 1**: 20.00%
- **Level 2**: 15.00%
- **Level 3**: 10.00%
- **Level 4**: 8.00%
- **Level 5**: 7.00%
- **Level 6**: 6.00%
- **Level 7**: 5.00%
- **Level 8**: 4.00%
- **Level 9**: 3.00%
- **Level 10**: 2.00%

### Direct Sponsor Bonus (5.00%)
- Paid directly to the immediate referring sponsor upon deposit confirmation, credited directly to the ledger.

### Qualification Criteria
- To receive commissions from downline levels 1 through 10, an account must have at least **two (2) direct active referrals with confirmed deposits**.
- Direct sponsor bonuses (5%) are paid regardless of qualification status.

### Monthly Portfolio Allocation Simulation
- **5.00% Monthly ROI** simulation credited to `roi_balance_cents`.
- **5.00% Additional Principal Credit** simulation credited to `principal_credits_cents`.
- Duplicate runs within the same calendar month are rejected via compound keys (`{deposit_id}_{month_key}`).

### Withdrawal Policy
- Minimum withdrawal: **$20.00 USD**. Maximum: **$50,000.00 USD**.
- Limit: **One (1) active withdrawal request per calendar month**.
- State machine: `pending` → `approved` (atomically debits wallet buckets) or `rejected` (with mandatory recorded reason).
- Accounts younger than 3 months are flagged for administrative review as early withdrawals.

---

## 7. Production Launch Checklist & Regulatory Compliance

Before activating any live money processing:
1. **Legal & Regulatory Approval**: Retain legal counsel in operating jurisdictions to verify compliance with direct-selling, anti-pyramid, and broker-dealer regulations.
2. **KYC / AML Integration**: Connect authorized identity verification providers (e.g. SumSub, Onfido) and verify sanctions screening.
3. **Payment Processor Gateway**: Replace demo simulated wire endpoints with licensed institutional payment gateways (e.g. regulated clearing partners or crypto rails).
4. **Secret Key Rotation**: Change default `JWT_SECRET_KEY` and database passwords in production environment configuration.
5. **Cold Storage & Backups**: Implement automated daily PostgreSQL pg_dump backups with offsite S3 retention.
