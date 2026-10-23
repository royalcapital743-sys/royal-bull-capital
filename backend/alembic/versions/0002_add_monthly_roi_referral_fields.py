"""0002_add_monthly_roi_referral_fields

Revision ID: 0002_add_monthly_roi_referral_fields
Revises: 0001_initial_schema
Create Date: 2026-10-23 15:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = '0002_add_monthly_roi_referral_fields'
down_revision: Union[str, Sequence[str], None] = '0001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Add month_key to commissions
    with op.batch_alter_table('commissions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('month_key', sa.String(length=32), nullable=True))
        batch_op.create_index(batch_op.f('ix_commissions_month_key'), ['month_key'], unique=False)

    # Add total_commissions_cents to monthly_cycle_runs
    with op.batch_alter_table('monthly_cycle_runs', schema=None) as batch_op:
        batch_op.add_column(sa.Column('total_commissions_cents', sa.BigInteger(), server_default='0', nullable=False))

def downgrade() -> None:
    with op.batch_alter_table('monthly_cycle_runs', schema=None) as batch_op:
        batch_op.drop_column('total_commissions_cents')

    with op.batch_alter_table('commissions', schema=None) as batch_op:
        batch_op.drop_index(batch_op.f('ix_commissions_month_key'))
        batch_op.drop_column('month_key')
