"""add_address_and_bank_details

Revision ID: a80d6f396113
Revises: 7156da120d72
Create Date: 2025-08-29 06:41:52.678268

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a80d6f396113'
down_revision: Union[str, Sequence[str], None] = '7156da120d72'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.add_column('usermaster', sa.Column('address', sa.Text(), nullable=True))
    op.add_column('usermaster', sa.Column('bank_account_holder', sa.String(length=150), nullable=True))
    op.add_column('usermaster', sa.Column('bank_name', sa.String(length=100), nullable=True))
    op.add_column('usermaster', sa.Column('bank_account_number', sa.String(length=50), nullable=True))
    op.add_column('usermaster', sa.Column('bank_ifsc_code', sa.String(length=20), nullable=True))

def downgrade():
    op.drop_column('usermaster', 'address')
    op.drop_column('usermaster', 'bank_account_holder')
    op.drop_column('usermaster', 'bank_name')
    op.drop_column('usermaster', 'bank_account_number')
    op.drop_column('usermaster', 'bank_ifsc_code')


