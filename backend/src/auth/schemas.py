"""
Authentication schemas using Pydantic.
"""
import uuid
from datetime import datetime
from decimal import Decimal
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserLogin(BaseModel):
    """
    User login schema.
    """
    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., min_length=8, description="User password")


class Token(BaseModel):
    """
    JWT token response schema.
    """
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """
    Token payload data schema.
    """
    user_id: str


class UserBase(BaseModel):
    """
    Base user schema.
    """
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: Optional[str] = None
    profile_image_url: Optional[str] = None
    date_of_birth: Optional[datetime] = None


class UserCreate(UserBase):
    """
    User creation schema.
    """
    password: str = Field(min_length=8)


class UserUpdate(BaseModel):
    """
    User update schema.
    """
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone_number: Optional[str] = None
    profile_image_url: Optional[str] = None
    date_of_birth: Optional[datetime] = None


class UserRead(UserBase):
    """
    User read schema.
    """
    model_config = ConfigDict(from_attributes=True)
    
    user_id: uuid.UUID
    is_active: bool = True
    email_verified: bool = False
    created_at: datetime


class UserProfile(UserBase):
    """
    User profile schema.
    """
    model_config = ConfigDict(from_attributes=True)
    
    user_id: uuid.UUID
    average_rating: Optional[Decimal] = None
    total_ratings: int = 0
    is_active: bool = True
    email_verified: bool = False
    created_at: datetime
