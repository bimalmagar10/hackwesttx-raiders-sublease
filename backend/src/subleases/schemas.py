"""
Subleases domain schemas.
"""
import uuid
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict

from src.subleases.models import SubLeaseStatus


class LessorRead(BaseModel):
    """Schema for reading lessor information."""
    model_config = ConfigDict(from_attributes=True)
    
    user_id: uuid.UUID
    first_name: str
    last_name: str
    email: str
    phone_number: Optional[str] = None
    profile_image_url: Optional[str] = None
    average_rating: Optional[float] = None
    total_ratings: int = 0


class PropertyImageRead(BaseModel):
    """Schema for reading property images."""
    model_config = ConfigDict(from_attributes=True)
    
    image_id: uuid.UUID
    image_url: str
    image_name: str
    is_primary: bool
    alt_text: Optional[str] = None
    image_size: Optional[int] = None
    created_at: datetime


class SubLeaseBase(BaseModel):
    """Base sublease schema."""
    title: str = Field(max_length=200)
    description: Optional[str] = None
    rate: Decimal = Field(max_digits=10, decimal_places=2)
    minimum_stay_days: int = Field(default=1, ge=1)
    maximum_stay_days: Optional[int] = Field(default=None, ge=1)
    available_from: date
    available_until: date
    status: SubLeaseStatus = SubLeaseStatus.ACTIVE


class SubLeaseCreate(SubLeaseBase):
    """Schema for creating a sublease."""
    property_id: uuid.UUID


class SubLeaseUpdate(BaseModel):
    """Schema for updating a sublease."""
    title: Optional[str] = Field(None, max_length=200)
    description: Optional[str] = None
    rate: Optional[Decimal] = Field(None, max_digits=10, decimal_places=2)
    minimum_stay_days: Optional[int] = Field(None, ge=1)
    maximum_stay_days: Optional[int] = Field(None, ge=1)
    available_from: Optional[date] = None
    available_until: Optional[date] = None
    status: Optional[SubLeaseStatus] = None


class SubLeaseRead(SubLeaseBase):
    """Schema for reading a sublease with property images and lessor details."""
    model_config = ConfigDict(from_attributes=True)
    
    sublease_id: uuid.UUID
    property_id: uuid.UUID
    lessor_id: uuid.UUID
    created_at: datetime
    property_images: List[PropertyImageRead] = []
    lessor: Optional[LessorRead] = None


class SubLeaseMyRead(SubLeaseBase):
    """Schema for reading current user's own subleases (without lessor_id) with property images."""
    model_config = ConfigDict(from_attributes=True)
    
    sublease_id: uuid.UUID
    property_id: uuid.UUID
    created_at: datetime
    property_images: List[PropertyImageRead] = []


class SubLeaseDetail(SubLeaseRead):
    """Schema for detailed sublease information with property images and lessor details."""
    updated_at: Optional[datetime] = None
    
    # Nested property and lessor information
    property_title: Optional[str] = None
    property_address: Optional[str] = None
    lessor_name: Optional[str] = None
    lessor_rating: Optional[float] = None
