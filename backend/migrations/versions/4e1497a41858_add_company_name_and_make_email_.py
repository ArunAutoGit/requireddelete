"""add_company_name_and_make_email_password_nullable

Revision ID: 4e1497a41858
Revises: a00d67b4f14f
Create Date: 2025-08-30 13:34:23.177616

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4e1497a41858'
down_revision: Union[str, Sequence[str], None] = 'a00d67b4f14f'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add company_name column
    op.add_column('usermaster', sa.Column('company_name', sa.String(length=150), nullable=True))
    
    # Make email and password_hash nullable
    op.alter_column('usermaster', 'email', nullable=True)
    op.alter_column('usermaster', 'password_hash', nullable=True)

def downgrade():
    op.drop_column('usermaster', 'company_name')
    op.alter_column('usermaster', 'email', nullable=False)
    op.alter_column('usermaster', 'password_hash', nullable=False)