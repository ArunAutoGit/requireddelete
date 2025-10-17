"""Added location, latitude, longitude to usermaster

Revision ID: 5f75b3be504c
Revises: 990ec5a9a727
Create Date: 2025-09-12 10:08:45.385167

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '5f75b3be504c'
down_revision: Union[str, Sequence[str], None] = '990ec5a9a727'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade():
    # Add new columns
    op.add_column('usermaster', sa.Column('location', sa.String(length=150), nullable=True))
    op.add_column('usermaster', sa.Column('latitude', sa.Float(), nullable=True))
    op.add_column('usermaster', sa.Column('longitude', sa.Float(), nullable=True))


def downgrade():
    # Drop new columns in case of rollback
    op.drop_column('usermaster', 'longitude')
    op.drop_column('usermaster', 'latitude')
    op.drop_column('usermaster', 'location')