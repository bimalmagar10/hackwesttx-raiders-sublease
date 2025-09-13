"""
Properties domain schemas.
"""
import uuid
from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict


class PropertyBase(BaseModel):
    """
    Base property schema.
    """
    title: str
    description: str
    property_type: Optional[str] = None
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    country: str
    square_feet: Optional[int] = None


class PropertyCreate(PropertyBase):
    """
    Property creation schema.
    """
    amenities: Optional[List[str]] = None


class PropertyUpdate(BaseModel):
    """
    Property update schema.
    """
    title: Optional[str] = None
    description: Optional[str] = None
    property_type: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    square_feet: Optional[int] = None
    amenities: Optional[List[str]] = None


class PropertyRead(PropertyBase):
    """
    Property read schema.
    """
    model_config = ConfigDict(from_attributes=True)
    
    property_id: uuid.UUID
    owner_id: uuid.UUID
    amenities: Optional[Dict[str, Any]] = None
    created_at: datetime
    images: Optional[List[Dict[str, Any]]] = None
