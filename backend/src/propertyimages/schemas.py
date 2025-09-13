"""
Property images domain schemas.
"""
import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field, ConfigDict


class PropertyImageBase(BaseModel):
    """Base property image schema."""
    image_name: str = Field(description="Original filename")
    alt_text: Optional[str] = Field(None, description="Alt text for accessibility")
    image_order: int = Field(default=0, description="Display order")
    is_primary: bool = Field(default=False, description="Whether this is the primary image")


class PropertyImageCreate(PropertyImageBase):
    """Schema for creating a property image."""
    pass  # Additional fields will be set by the service


class PropertyImageUpdate(BaseModel):
    """Schema for updating a property image."""
    alt_text: Optional[str] = Field(None, description="Alt text for accessibility")
    image_order: Optional[int] = Field(None, description="Display order")
    is_primary: Optional[bool] = Field(None, description="Whether this is the primary image")


class PropertyImageRead(PropertyImageBase):
    """Schema for reading a property image."""
    model_config = ConfigDict(from_attributes=True)
    
    image_id: uuid.UUID
    property_id: uuid.UUID
    image_url: str
    image_size: Optional[int]
    created_at: datetime


class PropertyImageUploadResponse(BaseModel):
    """Response schema for image upload."""
    uploaded_images: List[PropertyImageRead]
    total_uploaded: int
    errors: List[str] = []


class PropertyImageReorderRequest(BaseModel):
    """Schema for reordering property images."""
    image_orders: List[dict] = Field(description="List of {image_id: str, order: int}")
    
    class Config:
        schema_extra = {
            "example": {
                "image_orders": [
                    {"image_id": "uuid1", "order": 0},
                    {"image_id": "uuid2", "order": 1}
                ]
            }
        }
