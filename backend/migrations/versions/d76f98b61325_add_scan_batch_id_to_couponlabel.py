"""add_scan_batch_id_to_couponlabel

Revision ID: d76f98b61325
Revises: d3e3b768f0ac
Create Date: 2025-09-03 08:58:30.499344

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd76f98b61325'
down_revision: Union[str, Sequence[str], None] = 'd3e3b768f0ac'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('couponlabel', sa.Column('scan_batch_id', sa.Integer(), nullable=True))

def downgrade():
    op.drop_column('couponlabel', 'scan_batch_id')