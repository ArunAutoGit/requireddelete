"""make_address_not_nullable

Revision ID: a00d67b4f14f
Revises: a80d6f396113
Create Date: 2025-08-29 07:44:46.768744

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a00d67b4f14f'
down_revision: Union[str, Sequence[str], None] = 'a80d6f396113'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    op.alter_column('usermaster', 'address', nullable=False)

def downgrade():
    op.alter_column('usermaster', 'address', nullable=True)
