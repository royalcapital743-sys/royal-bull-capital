"""
Royal Bull Capital — Database Migration & Persistence Test Suite

Validates:
1. Alembic upgrade to head creates all 16 production tables
2. Alembic downgrade drops schema cleanly
3. SQLite to PostgreSQL data migration script transfers records with parity
4. Target database double-entry ledger trial balance verifies after migration
"""

import os
import sys
import pytest
from sqlalchemy import create_engine, inspect
from alembic.config import Config
from alembic import command

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from scripts.migrate_sqlite_to_pg import migrate_database

EXPECTED_TABLES = {
    "system_rules", "users", "refresh_tokens", "wallets", "deposits",
    "commissions", "ledger", "monthly_cycle_runs", "monthly_cycle_entries",
    "withdrawals", "notifications", "support_tickets", "support_messages",
    "audit_logs", "journal_entries", "journal_lines"
}

def test_alembic_upgrade_and_downgrade(tmp_path):
    """Proves Alembic can build and tear down full schema on clean database."""
    test_db_path = tmp_path / "alembic_test.db"
    db_url = f"sqlite:///{test_db_path.as_posix()}"

    alembic_cfg = Config(os.path.join(backend_dir, "alembic.ini"))
    alembic_cfg.set_main_option("sqlalchemy.url", db_url)
    alembic_cfg.set_main_option("script_location", os.path.join(backend_dir, "alembic"))

    # 1. Upgrade to head
    command.upgrade(alembic_cfg, "head")

    engine = create_engine(db_url)
    inspector = inspect(engine)
    tables = set(inspector.get_table_names())

    for t in EXPECTED_TABLES:
        assert t in tables, f"Table {t} missing after alembic upgrade head."

    # 2. Downgrade to base
    command.downgrade(alembic_cfg, "base")
    inspector_down = inspect(engine)
    tables_down = set(inspector_down.get_table_names())
    # All application tables should be dropped (only alembic_version might remain)
    app_tables = tables_down.intersection(EXPECTED_TABLES)
    assert len(app_tables) == 0, f"Tables still present after downgrade: {app_tables}"

def test_data_migration_and_reconciliation(tmp_path):
    """
    Tests data migration utility:
    Copies data from a populated source DB to clean target DB and asserts parity and trial balance.
    """
    import models, database, accounting
    src_path = tmp_path / "src.db"
    tgt_path = tmp_path / "tgt.db"

    src_url = f"sqlite:///{src_path.as_posix()}"
    tgt_url = f"sqlite:///{tgt_path.as_posix()}"

    # Setup source DB with 1 user and 1 deposit
    src_engine = create_engine(src_url)
    models.Base.metadata.create_all(bind=src_engine)
    from sqlalchemy.orm import sessionmaker
    SrcSession = sessionmaker(bind=src_engine)
    src_db = SrcSession()

    user = models.User(id="u_mig", name="Mig", email="mig@test.com", password_hash="h", referral_code="MIG")
    wallet = models.Wallet(user_id="u_mig", original_principal_cents=50000)
    dep = models.Deposit(id="dep_mig", user_id="u_mig", amount_cents=50000, status="confirmed")
    rules = models.SystemRule(id="global")
    src_db.add_all([user, wallet, dep, rules])
    src_db.flush()

    # Post double-entry journal entry in source
    accounting.post_deposit_journal(src_db, dep)
    src_db.commit()
    src_db.close()

    # Run migration script to target
    report = migrate_database(source_url=src_url, target_url=tgt_url, dry_run=False)

    assert report["all_tables_verified"] is True
    assert report["target_trial_balance_balanced"] is True
    assert report["target_total_debits_cents"] == 50000
    assert report["target_total_credits_cents"] == 50000
    assert report["target_fully_reconciled"] is True
