"""
User ratings domain schemas.
"""
import uuid
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class UserRatingBase(BaseModel):
    """Base user rating schema."""
    rating: int = Field(ge=1, le=5, description="Rating from 1 to 5")
    review: Optional[str] = Field(None, description="Optional review text")


class UserRatingCreate(UserRatingBase):
    """Schema for creating a user rating."""
    sublease_id: uuid.UUID
    rated_user_id: uuid.UUID


class UserRatingUpdate(BaseModel):
    """Schema for updating a user rating."""
    rating: Optional[int] = Field(None, ge=1, le=5, description="Rating from 1 to 5")
    review: Optional[str] = Field(None, description="Optional review text")


class UserRatingRead(UserRatingBase):
    """Schema for reading a user rating."""
    model_config = ConfigDict(from_attributes=True)
    
    rating_id: uuid.UUID
    sublease_id: uuid.UUID
    rater_id: uuid.UUID
    rated_user_id: uuid.UUID
    created_at: datetime


class UserRatingDetail(UserRatingRead):
    """Schema for detailed user rating with relationships."""
    # These will be populated by the service layer if needed
    rater_name: Optional[str] = None
    rated_user_name: Optional[str] = None
    sublease_title: Optional[str] = None
