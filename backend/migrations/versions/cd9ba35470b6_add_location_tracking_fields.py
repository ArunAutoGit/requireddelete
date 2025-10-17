"""add_location_tracking_fields

Revision ID: cd9ba35470b6
Revises: 036eab450f3e
Create Date: 2025-09-13 07:03:39.517427

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cd9ba35470b6'
down_revision: Union[str, Sequence[str], None] = '036eab450f3e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add columns to draft_sessions table
    op.add_column('draft_sessions', sa.Column('scan_latitude', sa.Numeric(precision=10, scale=8), nullable=True))
    op.add_column('draft_sessions', sa.Column('scan_longitude', sa.Numeric(precision=11, scale=8), nullable=True))
    op.add_column('draft_sessions', sa.Column('scan_address', sa.Text(), nullable=True))
    op.add_column('draft_sessions', sa.Column('location_verified', sa.Boolean(), server_default='false', nullable=True))
    op.add_column('draft_sessions', sa.Column('scan_timestamp', sa.DateTime(), server_default=sa.text('now()'), nullable=True))
    
    # Add columns to couponlabel table
    op.add_column('couponlabel', sa.Column('scan_latitude', sa.Numeric(precision=10, scale=8), nullable=True))
    op.add_column('couponlabel', sa.Column('scan_longitude', sa.Numeric(precision=11, scale=8), nullable=True))
    op.add_column('couponlabel', sa.Column('scan_address', sa.Text(), nullable=True))
    op.add_column('couponlabel', sa.Column('location_verified', sa.Boolean(), server_default='false', nullable=True))
    op.add_column('couponlabel', sa.Column('mechanic_id_at_scan', sa.Integer(), nullable=True))

def downgrade():
    # Remove columns from couponlabel table
    op.drop_column('couponlabel', 'mechanic_id_at_scan')
    op.drop_column('couponlabel', 'location_verified')
    op.drop_column('couponlabel', 'scan_address')
    op.drop_column('couponlabel', 'scan_longitude')
    op.drop_column('couponlabel', 'scan_latitude')
    
    # Remove columns from draft_sessions table
    op.drop_column('draft_sessions', 'scan_timestamp')
    op.drop_column('draft_sessions', 'location_verified')
    op.drop_column('draft_sessions', 'scan_address')
    op.drop_column('draft_sessions', 'scan_longitude')
    op.drop_column('draft_sessions', 'scan_latitude')
