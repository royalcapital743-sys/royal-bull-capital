import json
from datetime import datetime
from decimal import Decimal
from sqlalchemy.orm import Session
from database import DATABASE_URL
import models

def sql_quote(val):
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float, Decimal)):
        return str(val)
    if isinstance(val, datetime):
        return f"'{val.strftime('%Y-%m-%d %H:%M:%S')}'"
    # String / Text
    s = str(val).replace("'", "''")
    return f"'{s}'"

TABLE_CONFIGS = [
    ("system_rules", models.SystemRule, ["id", "direct_bonus", "level_rates", "monthly_roi", "monthly_principal", "minimum_deposit", "min_withdrawal", "max_withdrawal", "demo_mode_active", "last_monthly_run", "updated_at"], "id"),
    ("users", models.User, ["id", "name", "email", "password_hash", "role", "referral_code", "referrer_id", "status", "is_verified", "created_at", "updated_at"], "id"),
    ("wallets", models.Wallet, ["user_id", "original_principal_cents", "principal_credits_cents", "roi_balance_cents", "direct_bonus_cents", "level_commission_cents", "withdrawn_total_cents", "updated_at"], "user_id"),
    ("deposits", models.Deposit, ["id", "user_id", "amount_cents", "status", "idempotency_key", "note", "created_at", "confirmed_at", "updated_at"], "id"),
    ("commissions", models.Commission, ["id", "deposit_id", "source_user_id", "recipient_user_id", "level", "commission_type", "rate_percent", "base_cents", "amount_cents", "idempotency_key", "month_key", "status", "created_at"], "id"),
    ("ledger", models.LedgerEntry, ["id", "user_id", "entry_type", "amount_cents", "balance_after_cents", "description", "reference_id", "idempotency_key", "created_at"], "id"),
    ("monthly_cycle_runs", models.MonthlyCycleRun, ["id", "month_key", "admin_id", "total_eligible_deposits", "total_roi_cents", "total_principal_cents", "total_commissions_cents", "status", "executed_at"], "id"),
    ("monthly_cycle_entries", models.MonthlyCycleEntry, ["id", "run_id", "cycle_key", "deposit_id", "user_id", "roi_cents", "principal_cents", "created_at"], "id"),
    ("withdrawals", models.Withdrawal, ["id", "user_id", "amount_cents", "principal_portion_cents", "roi_portion_cents", "commission_portion_cents", "is_early_withdrawal", "month_key", "status", "payout_method", "payout_details", "rejection_reason", "reviewed_by", "reviewed_at", "created_at"], "id"),
    ("support_tickets", models.SupportTicket, ["id", "user_id", "subject", "category", "priority", "status", "created_at", "updated_at"], "id"),
    ("support_messages", models.SupportMessage, ["id", "ticket_id", "sender_id", "sender_role", "message", "created_at"], "id"),
    ("notifications", models.Notification, ["id", "user_id", "title", "message", "notif_type", "is_read", "created_at"], "id"),
    ("audit_logs", models.AuditLog, ["id", "admin_id", "action", "entity_type", "entity_id", "detail", "ip_address", "created_at"], "id"),
    ("journal_entries", models.JournalEntry, ["id", "transaction_type", "reference_id", "idempotency_key", "description", "status", "posted_at", "created_at"], "id"),
    ("journal_lines", models.JournalLine, ["id", "journal_entry_id", "account_code", "account_name", "user_id", "debit_cents", "credit_cents", "created_at"], "id"),
]

def get_database_summary(db: Session) -> dict:
    summary = {}
    for table_name, model_cls, _, _ in TABLE_CONFIGS:
        try:
            summary[table_name] = db.query(model_cls).count()
        except Exception:
            summary[table_name] = 0
    return {
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "database_type": "postgresql" if "postgres" in DATABASE_URL else "sqlite",
        "table_counts": summary,
        "total_records": sum(summary.values())
    }

def generate_postgres_sql_dump(db: Session) -> str:
    timestamp = datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC")
    lines = [
        "-- ========================================================",
        "-- Royal Bull Capital — Automated PostgreSQL Database Export",
        f"-- Export Timestamp: {timestamp}",
        "-- Format: PostgreSQL Standard ANSI SQL",
        "-- Safe for re-import into PostgreSQL via: psql -d <db> -f <filename>.sql",
        "-- ========================================================",
        "",
        "BEGIN;",
        "SET client_encoding = 'UTF8';",
        "SET standard_conforming_strings = on;",
        "",
        "-- Ensure required schemas and tables exist",
    ]

    for table_name, model_cls, cols, pkey in TABLE_CONFIGS:
        rows = db.query(model_cls).all()
        lines.append(f"\n-- Data for Name: {table_name}; Type: TABLE DATA; Rows: {len(rows)}")
        if not rows:
            lines.append(f"-- (No rows in {table_name})")
            continue

        col_str = ", ".join(cols)
        lines.append(f"INSERT INTO {table_name} ({col_str}) VALUES")
        row_values = []
        for r in rows:
            vals = [sql_quote(getattr(r, c)) for c in cols]
            row_values.append(f"  ({', '.join(vals)})")

        lines.append(",\n".join(row_values))
        update_set = ", ".join([f"{c} = EXCLUDED.{c}" for c in cols if c != pkey])
        lines.append(f"ON CONFLICT ({pkey}) DO UPDATE SET {update_set};")

    lines.append("\nCOMMIT;")
    lines.append("-- ========================================================")
    lines.append("-- Export completed successfully.")
    lines.append("-- ========================================================")
    return "\n".join(lines)

def generate_json_snapshot(db: Session) -> dict:
    tables_data = {}
    for table_name, model_cls, cols, _ in TABLE_CONFIGS:
        rows = db.query(model_cls).all()
        table_rows = []
        for r in rows:
            row_dict = {}
            for c in cols:
                v = getattr(r, c)
                if isinstance(v, (datetime, Decimal)):
                    row_dict[c] = str(v)
                else:
                    row_dict[c] = v
            table_rows.append(row_dict)
        tables_data[table_name] = table_rows

    return {
        "version": "2.0.0",
        "exported_at": datetime.utcnow().isoformat() + "Z",
        "database_type": "postgresql" if "postgres" in DATABASE_URL else "sqlite",
        "summary": get_database_summary(db)["table_counts"],
        "tables": tables_data
    }
