import os
import sys

# Ensure backend root is on sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, backend_dir)

from alembic.migration import MigrationContext
from alembic.autogenerate import produce_migrations, render_python_code
import database
import models
from sqlalchemy import create_engine

def generate():
    empty_engine = create_engine('sqlite:///:memory:')
    mc = MigrationContext.configure(empty_engine.connect())
    diff = produce_migrations(mc, database.Base.metadata)

    upgrade_code = render_python_code(diff.upgrade_ops)
    downgrade_code = render_python_code(diff.downgrade_ops)

    # Indent codes properly
    def indent_code(code_str: str, spaces: int = 4) -> str:
        pad = " " * spaces
        return "\n".join(pad + line if line.strip() else line for line in code_str.split("\n"))

    content = f'''"""0001_initial_schema

Revision ID: 0001_initial_schema
Revises: None
Create Date: 2026-10-21 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0001_initial_schema'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
{indent_code(upgrade_code)}

def downgrade() -> None:
{indent_code(downgrade_code)}
'''

    versions_dir = os.path.join(backend_dir, 'alembic', 'versions')
    os.makedirs(versions_dir, exist_ok=True)
    target_path = os.path.join(versions_dir, '0001_initial_schema.py')
    with open(target_path, 'w', encoding='utf-8') as f:
        f.write(content)

    print(f"Generated {target_path} successfully!")

if __name__ == "__main__":
    generate()
