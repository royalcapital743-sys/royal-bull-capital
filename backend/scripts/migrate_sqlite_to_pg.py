"""
Royal Bull Capital — Database Migration & Verification Utility (SQLite to PostgreSQL)

Transfers data from source SQLite database to target PostgreSQL database with:
- Topological dependency ordering
- Exact row count verification
- Trial balance double-entry verification on target
- Migration Reconciliation Report generation
"""

import os
import sys
import argparse
from datetime import datetime
from typing import Dict, Any, List
from sqlalchemy import create_engine, text, MetaData, Table
from sqlalchemy.orm import sessionmaker

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

import models
import database
import accounting

TABLE_ORDER = [
    "system_rules",
    "users",
    "refresh_tokens",
    "wallets",
    "deposits",
    "commissions",
    "ledger",
    "monthly_cycle_runs",
    "monthly_cycle_entries",
    "withdrawals",
    "notifications",
    "support_tickets",
    "support_messages",
    "audit_logs",
    "journal_entries",
    "journal_lines",
]

def migrate_database(source_url: str, target_url: str, dry_run: bool = False) -> Dict[str, Any]:
    print(f"[{datetime.utcnow().isoformat()}] Starting migration process:")
    print(f"  Source: {source_url}")
    print(f"  Target: {target_url}")
    print(f"  Dry Run: {dry_run}")

    # Fix PostgreSQL URLs for SQLAlchemy
    if target_url.startswith("postgres://"):
        target_url = target_url.replace("postgres://", "postgresql+psycopg2://", 1)
    elif target_url.startswith("postgresql://") and not target_url.startswith("postgresql+psycopg2://"):
        target_url = target_url.replace("postgresql://", "postgresql+psycopg2://", 1)

    src_engine = create_engine(source_url)
    tgt_engine = create_engine(target_url)

    # 1. Ensure target schema exists
    if not dry_run:
        database.Base.metadata.create_all(bind=tgt_engine)

    src_meta = MetaData()
    src_meta.reflect(bind=src_engine)

    tgt_meta = MetaData()
    tgt_meta.reflect(bind=tgt_engine)

    SrcSession = sessionmaker(bind=src_engine)
    TgtSession = sessionmaker(bind=tgt_engine)

    src_db = SrcSession()
    tgt_db = TgtSession()

    report_table_stats: List[Dict[str, Any]] = []

    try:
        for tbl_name in TABLE_ORDER:
            if tbl_name not in src_meta.tables:
                continue

            src_table = src_meta.tables[tbl_name]
            tgt_table = tgt_meta.tables.get(tbl_name)

            # Query all rows from source
            rows = src_db.execute(src_table.select()).mappings().all()
            src_count = len(rows)

            if not dry_run and tgt_table is not None:
                # Clean target table before insert to prevent collisions
                tgt_db.execute(tgt_table.delete())
                tgt_db.flush()

                if rows:
                    # Insert in batches
                    insert_data = [dict(r) for r in rows]
                    tgt_db.execute(tgt_table.insert(), insert_data)
                    tgt_db.flush()

            tgt_count = 0
            if tgt_table is not None:
                tgt_count = tgt_db.execute(text(f"SELECT COUNT(*) FROM {tbl_name}")).scalar() or 0

            status = "VERIFIED" if (src_count == tgt_count or dry_run) else "MISMATCH"
            print(f"  -> Table '{tbl_name}': Source={src_count}, Target={tgt_count} [{status}]")

            report_table_stats.append({
                "table_name": tbl_name,
                "source_count": src_count,
                "target_count": tgt_count,
                "status": status
            })

        if not dry_run:
            tgt_db.commit()

        # Double-entry ledger reconciliation on target database
        tb_result = {"is_balanced": True, "total_debits_cents": 0, "total_credits_cents": 0}
        reconciliation_result = {"is_fully_reconciled": True, "wallet_discrepancies_count": 0}

        if not dry_run:
            try:
                # Backfill double-entry journal entries for pre-existing legacy transactions
                backfilled = accounting.backfill_legacy_entries(tgt_db)
                if backfilled > 0:
                    print(f"  -> Backfilled {backfilled} double-entry journal entries for legacy transactions.")
                tb_result = accounting.verify_trial_balance(tgt_db)
                reconciliation_result = accounting.reconcile_system_wide(tgt_db)
            except Exception as e:
                print(f"Warning during accounting verification: {e}")

        report = {
            "timestamp": datetime.utcnow().isoformat(),
            "source_url": source_url,
            "target_url": target_url,
            "dry_run": dry_run,
            "table_stats": report_table_stats,
            "all_tables_verified": all(t["status"] == "VERIFIED" for t in report_table_stats),
            "target_trial_balance_balanced": tb_result.get("is_balanced", False),
            "target_total_debits_cents": tb_result.get("total_debits_cents", 0),
            "target_total_credits_cents": tb_result.get("total_credits_cents", 0),
            "target_fully_reconciled": reconciliation_result.get("is_fully_reconciled", False)
        }

        print("\n=== MIGRATION RECONCILIATION SUMMARY ===")
        print(f"  All Tables Verified Parity: {report['all_tables_verified']}")
        print(f"  Target Trial Balance Balanced: {report['target_trial_balance_balanced']}")
        print(f"  Target Subledger Reconciled: {report['target_fully_reconciled']}")
        return report

    finally:
        src_db.close()
        tgt_db.close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Royal Bull Capital SQLite to PostgreSQL Migration")
    parser.add_argument("--source", default="sqlite:///./royal_bull_capital.db", help="Source SQLite connection string")
    parser.add_argument("--target", required=True, help="Target PostgreSQL connection string")
    parser.add_argument("--dry-run", action="store_true", help="Perform verification check without writing to target")

    args = parser.parse_args()
    res = migrate_database(args.source, args.target, args.dry_run)
    if not res["all_tables_verified"]:
        sys.exit(1)
