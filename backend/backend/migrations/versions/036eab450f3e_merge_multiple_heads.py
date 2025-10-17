"""merge multiple heads

Revision ID: 036eab450f3e
Revises: 15ac74098596, 5f75b3be504c
Create Date: 2025-09-13 07:01:04.594053

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '036eab450f3e'
down_revision: Union[str, Sequence[str], None] = ('15ac74098596', '5f75b3be504c')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
