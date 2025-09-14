"""merge_heads

Revision ID: 5b0f762d9eed
Revises: 5e00f7061702, dbc73c8bb3f7
Create Date: 2025-09-13 19:51:02.452567

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5b0f762d9eed'
down_revision: Union[str, None] = ('5e00f7061702', 'dbc73c8bb3f7')
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
