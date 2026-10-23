import os
import sys
from logging.config import fileConfig

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import engine_from_config, pool
from alembic import context

import database
import models

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Set dynamic database URL from database module if not provided or placeholder
current_url = config.get_main_option("sqlalchemy.url")
if not current_url or "driver://user:pass" in current_url:
    config.set_main_option("sqlalchemy.url", str(database.DATABASE_URL))

target_metadata = database.Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    from sqlalchemy import create_engine
    url = config.get_main_option("sqlalchemy.url") or str(database.DATABASE_URL)
    connect_args = {}
    if "sqlite" in url:
        connect_args = {"check_same_thread": False}
    connectable = create_engine(url, connect_args=connect_args)

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

