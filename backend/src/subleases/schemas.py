"""
Subleases domain schemas.
"""
import uuid
from datetime import datetime, date
from decimal import Decimal
from typing import Optional, List

from pydantic import BaseModel, Field, ConfigDict

from src.subleases.models import SubLeaseStatus


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
    """Schema for reading a sublease."""
    model_config = ConfigDict(from_attributes=True)
    
    sublease_id: uuid.UUID
    property_id: uuid.UUID
    lessor_id: uuid.UUID
    created_at: datetime


class SubLeaseMyRead(SubLeaseBase):
    """Schema for reading current user's own subleases (without lessor_id)."""
    model_config = ConfigDict(from_attributes=True)
    
    sublease_id: uuid.UUID
    property_id: uuid.UUID
    created_at: datetime


class SubLeaseDetail(SubLeaseRead):
    """Schema for detailed sublease information."""
    updated_at: Optional[datetime] = None
    
    # Nested property and lessor information
    property_title: Optional[str] = None
    property_address: Optional[str] = None
    lessor_name: Optional[str] = None
    lessor_rating: Optional[float] = None
