# ROYAL BULL CAPITAL — DEPLOYMENT, ENVIRONMENT ISOLATION & DISASTER RECOVERY

## 1. Environment Isolation (Staging vs Production)

Staging and Production environments must never share databases, credentials, or encryption keys.

| Component | Staging Environment | Production Environment |
| :--- | :--- | :--- |
| **Branch** | `feature/production-hardening` / `staging` | `main` |
| **Database** | Isolated staging PostgreSQL instance | Dedicated production PostgreSQL cluster |
| **Demo Mode** | Allowed for simulated end-to-end testing | `demo_mode_active = false` |
| **Real Money Operations**| Disabled | **DISABLED** (Pending regulatory clearance) |
| **JWT Secrets** | Staging rotation keys | Cryptographically randomized 256-bit secret |
| **Logging** | DEBUG / INFO with structured JSON | INFO / WARN / ERROR with structured JSON |

---

## 2. Managed Secrets & Environment Variables

Environment variables must be supplied via cloud secret managers (e.g., Render Environment Variables, AWS Secrets Manager, or HashiCorp Vault):

```bash
# Application Environment
ENVIRONMENT=production
PORT=8000
ALLOWED_ORIGINS=https://royal-bull-frontend.onrender.com,https://app.royalbullcapital.com

# Persistence
DATABASE_URL=postgresql+psycopg2://user:secret@postgres-cluster:5432/royal_bull_production

# Authentication & Encryption
JWT_SECRET=<MINIMUM_64_CHAR_CRYPTOGRAPHIC_SECRET>
JWT_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=30
INITIAL_ADMIN_PASSWORD=<COMPLEX_BOOTSTRAP_PASSWORD>

# Monitoring & Build Metadata
GIT_COMMIT=c5d92c1
GIT_BRANCH=feature/production-hardening
```

---

## 3. Health Monitoring & Operational Readiness Probes

The application provides standardized observability endpoints:

### Liveness Probe
`GET /health/liveness`
- Purpose: Kubernetes / Cloud health check verifying that the Python ASGI worker is running.
- Response: `{"status": "alive"}` (HTTP 200).

### Readiness Probe
`GET /health/readiness`
- Purpose: Verifies whether the container is ready to accept user traffic.
- Checks:
  1. Live database query (`SELECT 1`).
  2. Double-entry general ledger trial balance verification ($\sum \text{Debits} == \sum \text{Credits}$).
- Returns HTTP 503 if database connection fails or trial balance has a non-zero difference.

### Version & Persistence Metadata Probe
`GET /health/version`
- Purpose: Confirms deployed commit hash, environment, database dialect, and persistent storage status.

---

## 4. Rollback & Disaster Recovery Procedures

### Scenario A: Migration Defect or Broken Release
1. Revert deployment to previous stable Git commit.
2. Revert the database migration:
   ```bash
   python -m alembic downgrade -1
   ```
3. Call `/health/readiness` to verify system stability.

### Scenario B: Database Corruption or Catastrophic Data Loss
1. Stop inbound traffic (set web service to maintenance mode).
2. Restore the latest verified snapshot using `backup_restore.py`:
   ```bash
   python scripts/backup_restore.py restore --file backups/backup_postgres_<TIMESTAMP>.dump
   ```
3. Run institutional double-entry reconciliation:
   ```bash
   python -c "import database, accounting; db = database.SessionLocal(); res = accounting.reconcile_system_wide(db); print('Reconciled:', res['is_fully_reconciled']); db.close()"
   ```
4. Re-enable traffic upon receiving `reconciled == true`.
