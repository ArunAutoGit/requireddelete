"""added otp columns to loginsession

Revision ID: cf4e68394a17
Revises: 4e1497a41858
Create Date: 2025-09-01 15:32:46.948489
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'cf4e68394a17'
down_revision = '4e1497a41858'
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Upgrade schema."""
    op.add_column('loginsession', sa.Column('otp', sa.String(length=6), nullable=True))
    op.add_column('loginsession', sa.Column('otp_expires_at', sa.DateTime(), nullable=True))


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_column('loginsession', 'otp')
    op.drop_column('loginsession', 'otp_expires_at')