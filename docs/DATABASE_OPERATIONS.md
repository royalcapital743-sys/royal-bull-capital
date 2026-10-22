# ROYAL BULL CAPITAL — DATABASE OPERATIONS & PERSISTENCE RUNBOOK

## 1. Overview
This runbook details production database management for Royal Bull Capital, migrating from ephemeral hosting storage to managed PostgreSQL with Alembic schema versioning, strict data preservation, backup/restore procedures, and persistent volume guarantees.

---

## 2. PostgreSQL Configuration & Connection Strings

### Managed Connection Strings
The application supports standard PostgreSQL connection URIs via the `DATABASE_URL` environment variable:
```bash
# Direct PostgreSQL connection
DATABASE_URL=postgresql+psycopg2://royalbull_user:<MANAGED_SECRET_PASSWORD>@db-host.internal.render.com:5432/royal_bull_capital_db?sslmode=require
```

The database adapter in [`backend/database.py`](file:///d:/Downloads/FX_Nexus_Functional_Referral_Demo/backend/database.py) automatically standardizes legacy `postgres://` prefixes to `postgresql+psycopg2://` with `pool_pre_ping=True` connection health pooling.

### Persistent PostgreSQL Hosting
When running on cloud providers (e.g., Render, AWS RDS, GCP Cloud SQL, or DigitalOcean Managed Databases):
- The database is decoupled from ephemeral app container lifecycles.
- Restarting or redeploying the backend web service maintains 100% data retention.
- Automated daily snapshots and point-in-time recovery (PITR) must be enabled on the managed cloud database.

---

## 3. Alembic Migrations

Alembic is configured in [`backend/alembic/`](file:///d:/Downloads/FX_Nexus_Functional_Referral_Demo/backend/alembic/) to manage schema evolution.

### Executing Migrations in Production
Before starting the backend service, execute:
```bash
cd backend
python -m alembic upgrade head
```

### Inspecting Current Revision
```bash
cd backend
python -m alembic current
```

### Reverting Last Migration (Rollback)
```bash
cd backend
python -m alembic downgrade -1
```

---

## 4. Backup & Restoration Procedures

The repository includes a dedicated CLI utility at [`backend/scripts/backup_restore.py`](file:///d:/Downloads/FX_Nexus_Functional_Referral_Demo/backend/scripts/backup_restore.py).

### Automated Backup Command
```bash
cd backend
python scripts/backup_restore.py backup
```
- For PostgreSQL: executes `pg_dump -F c` generating an atomic compressed archive in `backend/backups/`.
- For SQLite (test/development): executes the native SQLite backup API with WAL flush.

### Database Restoration Command
```bash
cd backend
python scripts/backup_restore.py restore --file backups/backup_postgres_<TIMESTAMP>.dump
```
- Restores database schema and records.
- Verifies integrity before committing replacement.

---

## 5. Persistence Verification Checklist
Post-deployment verification requires:
1. Call `/health/readiness` to verify database connectivity (`SELECT 1`) and trial balance status.
2. Confirm that user registrations and deposits persist after container restarts:
   ```bash
   curl -s http://127.0.0.1:8000/health/readiness
   ```
3. Verify table presence and record counts:
   ```bash
   python -c "import database, models; db = database.SessionLocal(); print('Users count:', db.query(models.User).count()); db.close()"
   ```
