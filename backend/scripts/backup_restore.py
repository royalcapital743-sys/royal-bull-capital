"""
Royal Bull Capital — Database Backup & Restore Utility

Supports automated backup, restoration, and integrity checks for:
- PostgreSQL (via pg_dump / pg_restore / psql)
- SQLite (via atomic sqlite3 backup API)
"""

import os
import sys
import shutil
import sqlite3
import argparse
import subprocess
from datetime import datetime
from urllib.parse import urlparse

# Add backend directory to sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

import database

BACKUP_DIR = os.path.join(backend_dir, "backups")
os.makedirs(BACKUP_DIR, exist_ok=True)

def parse_pg_url(url: str):
    # Normalize
    if url.startswith("postgresql+psycopg2://"):
        url = url.replace("postgresql+psycopg2://", "postgresql://", 1)
    p = urlparse(url)
    return {
        "host": p.hostname or "localhost",
        "port": str(p.port or 5432),
        "user": p.username or "postgres",
        "password": p.password or "",
        "dbname": p.path.lstrip("/")
    }

def backup_sqlite(src_path: str, dest_path: str) -> str:
    print(f"Creating atomic SQLite backup from {src_path} -> {dest_path}")
    src_conn = sqlite3.connect(src_path)
    dest_conn = sqlite3.connect(dest_path)
    try:
        src_conn.backup(dest_conn)
        dest_conn.commit()
    finally:
        dest_conn.close()
        src_conn.close()
    print(f"Backup completed successfully: {dest_path}")
    return dest_path

def restore_sqlite(backup_path: str, target_path: str):
    print(f"Restoring SQLite database from {backup_path} -> {target_path}")
    if not os.path.exists(backup_path):
        raise FileNotFoundError(f"Backup file not found: {backup_path}")

    # Verify backup integrity first
    conn = sqlite3.connect(backup_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA integrity_check;")
    check = cursor.fetchone()
    conn.close()

    if not check or check[0] != "ok":
        raise ValueError(f"Backup file failed SQLite integrity check: {check}")

    # Copy safely
    temp_target = target_path + ".tmp"
    shutil.copy2(backup_path, temp_target)
    if os.path.exists(target_path):
        os.replace(temp_target, target_path)
    else:
        os.rename(temp_target, target_path)
    print(f"Restoration completed successfully to {target_path}")

def backup_postgres(db_url: str, dest_path: str) -> str:
    conn_info = parse_pg_url(db_url)
    print(f"Creating PostgreSQL backup for {conn_info['dbname']}@{conn_info['host']}:{conn_info['port']} -> {dest_path}")

    env = os.environ.copy()
    if conn_info["password"]:
        env["PGPASSWORD"] = conn_info["password"]

    cmd = [
        "pg_dump",
        "-h", conn_info["host"],
        "-p", conn_info["port"],
        "-U", conn_info["user"],
        "-F", "c",  # Custom format
        "-b",       # Include blobs
        "-v",
        "-f", dest_path,
        conn_info["dbname"]
    ]

    try:
        subprocess.run(cmd, env=env, check=True)
        print(f"PostgreSQL backup completed: {dest_path}")
        return dest_path
    except FileNotFoundError:
        # Fallback to python script or alert pg_dump installation
        print("Note: 'pg_dump' utility not found on PATH. Ensure PostgreSQL client tools are installed.")
        raise

def restore_postgres(backup_path: str, db_url: str):
    conn_info = parse_pg_url(db_url)
    print(f"Restoring PostgreSQL database {conn_info['dbname']} from {backup_path}")

    env = os.environ.copy()
    if conn_info["password"]:
        env["PGPASSWORD"] = conn_info["password"]

    cmd = [
        "pg_restore",
        "-h", conn_info["host"],
        "-p", conn_info["port"],
        "-U", conn_info["user"],
        "-d", conn_info["dbname"],
        "-v",
        "--clean",
        "--if-exists",
        backup_path
    ]

    subprocess.run(cmd, env=env, check=True)
    print(f"PostgreSQL restoration completed successfully.")

def execute_backup(custom_url: str = None) -> str:
    url = custom_url or str(database.DATABASE_URL)
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")

    if "sqlite" in url:
        src = url.replace("sqlite:///", "").replace("sqlite://", "")
        if not os.path.isabs(src):
            src = os.path.join(backend_dir, src)
        dest = os.path.join(BACKUP_DIR, f"backup_sqlite_{timestamp}.db")
        return backup_sqlite(src, dest)
    else:
        dest = os.path.join(BACKUP_DIR, f"backup_postgres_{timestamp}.dump")
        return backup_postgres(url, dest)

def execute_restore(backup_path: str, custom_url: str = None):
    url = custom_url or str(database.DATABASE_URL)
    if "sqlite" in url:
        target = url.replace("sqlite:///", "").replace("sqlite://", "")
        if not os.path.isabs(target):
            target = os.path.join(backend_dir, target)
        restore_sqlite(backup_path, target)
    else:
        restore_postgres(backup_path, url)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Royal Bull Capital Database Backup & Restore")
    subparsers = parser.add_subparsers(dest="command", required=True)

    backup_parser = subparsers.add_parser("backup", help="Run database backup")
    backup_parser.add_argument("--url", help="Database URL (default: current DATABASE_URL)")

    restore_parser = subparsers.add_parser("restore", help="Restore database from backup")
    restore_parser.add_argument("--file", required=True, help="Path to backup file")
    restore_parser.add_argument("--url", help="Database URL (default: current DATABASE_URL)")

    args = parser.parse_args()

    if args.command == "backup":
        execute_backup(args.url)
    elif args.command == "restore":
        execute_restore(args.file, args.url)
