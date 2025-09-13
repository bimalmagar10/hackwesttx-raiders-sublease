"""
Property images dependencies.
"""
from fastapi import Depends
from sqlalchemy.orm import Session

from src.database import get_db
from src.propertyimages.service import PropertyImageService


def get_property_image_service(db: Session = Depends(get_db)) -> PropertyImageService:
    """Get property image service instance."""
    return PropertyImageService(db)
