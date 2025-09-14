"""
Properties domain router.
"""
import json
import logging
import uuid
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.properties.dependencies import get_property_by_id, get_user_property
from src.properties.models import Property
from src.properties.schemas import PropertyCreate, PropertyRead, PropertyUpdate
from src.properties.service import PropertiesService
from src.utils.responses import success_response

logger = logging.getLogger(__name__)


router = APIRouter()


@router.get("/", response_model=List[PropertyRead])
def get_properties(
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[PropertyRead]:
    """
    Get current user's properties with pagination.
    
    Args:
        skip: Number of records to skip.
        limit: Maximum number of records to return.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        List[PropertyRead]: List of current user's properties.
    """
    logger.info(f"Getting properties for user: {current_user.user_id} - skip: {skip}, limit: {limit}")
    properties_service = PropertiesService(db)
    properties = properties_service.get_properties_by_owner(current_user.user_id, skip=skip, limit=limit)
    
    property_list = [properties_service.convert_property_to_read(prop) for prop in properties]
    logger.debug(f"Retrieved {len(property_list)} properties")
    return property_list


@router.get("/me", response_model=List[PropertyRead])
def get_my_properties(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[PropertyRead]:
    """
    Get current user's properties.
    
    Args:
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        List[PropertyRead]: List of user's properties.
    """
    logger.info(f"Getting properties for user: {current_user.user_id}")
    properties_service = PropertiesService(db)
    properties = properties_service.get_properties_by_owner(current_user.user_id)
    
    property_list = [properties_service.convert_property_to_read(prop) for prop in properties]
    logger.debug(f"Retrieved {len(property_list)} properties for user")
    return property_list


@router.get("/{property_id}", response_model=PropertyRead)
def get_property(
    property_obj: Property = Depends(get_property_by_id),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> PropertyRead:
    """
    Get property by ID.
    
    Args:
        property_obj: Property object from dependency.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        PropertyRead: Property data.
    """
    logger.info(f"Getting property by ID: {property_obj.property_id}")
    properties_service = PropertiesService(db)
    return properties_service.convert_property_to_read(property_obj)


@router.post("/", response_model=Any)
async def create_property(
    # Property data as form fields
    title: str = Form(...),
    description: str = Form(...),
    property_type: Optional[str] = Form(None),
    address_line1: str = Form(...),
    address_line2: Optional[str] = Form(None),
    city: str = Form(...),
    state: str = Form(...),
    country: str = Form(...),
    square_feet: Optional[int] = Form(None),
    amenities: Optional[str] = Form(None),  # JSON string of amenities
    images: Optional[List[UploadFile]] = File(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Create new property with optional images.
    
    Args:
        title: Property title.
        description: Property description.
        property_type: Type of property.
        address_line1: Primary address line.
        address_line2: Secondary address line.
        city: City.
        state: State.
        country: Country.
        square_feet: Square footage.
        amenities: JSON string of amenities list.
        images: Optional list of property images.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        Success response with property data.
    """
    logger.info(f"Creating property request received from user: {current_user.user_id}")
    logger.debug(f"Property data - Title: {title}, City: {city}")
    
    # Log images info and validate
    if images:
        from src.config import settings
        
        logger.debug(f"Images count: {len(images)}")
        logger.debug(f"Images received: {[img.filename for img in images if img.filename]}")
        
        # Validate number of files
        if len(images) > settings.MAX_FILES_PER_UPLOAD:
            logger.error(f"Too many files uploaded: {len(images)}, max allowed: {settings.MAX_FILES_PER_UPLOAD}")
            from fastapi import HTTPException
            raise HTTPException(
                status_code=400, 
                detail=f"Too many files. Maximum {settings.MAX_FILES_PER_UPLOAD} files allowed per upload."
            )
        
        # Calculate total size
        total_size = 0
        for img in images:
            if hasattr(img, 'size') and img.size:
                total_size += img.size
        
        if total_size > settings.MAX_TOTAL_UPLOAD_SIZE:
            logger.error(f"Total upload size too large: {total_size} bytes, max allowed: {settings.MAX_TOTAL_UPLOAD_SIZE}")
            from fastapi import HTTPException
            raise HTTPException(
                status_code=400, 
                detail=f"Total upload size too large. Maximum {settings.MAX_TOTAL_UPLOAD_SIZE / (1024 * 1024):.1f} MB allowed."
            )
        
        logger.debug(f"Total upload size: {total_size / (1024 * 1024):.2f} MB")
    else:
        logger.debug("No images provided")
    
    try:
        properties_service = PropertiesService(db)
        property_response = await properties_service.create_property(
            title=title,
            description=description,
            property_type=property_type,
            address_line1=address_line1,
            address_line2=address_line2,
            city=city,
            state=state,
            country=country,
            square_feet=square_feet,
            amenities=amenities,
            images=images,
            current_user_id=current_user.user_id
        )
        logger.info(f"Property creation completed successfully for ID: {property_response.property_id}")
        
        return success_response(
            data=property_response,
            message="Property created successfully"
        )
    except Exception as e:
        logger.error(f"Failed to create property: {str(e)}")
        raise


@router.put("/{property_id}", response_model=PropertyRead)
def update_property(
    property_data: PropertyUpdate,
    property_obj: Property = Depends(get_user_property),
    db: Session = Depends(get_db)
) -> PropertyRead:
    """
    Update property.
    
    Args:
        property_data: Property update data.
        property_obj: Property object from dependency.
        db: Database session.
        
    Returns:
        PropertyRead: Updated property data.
    """
    logger.info(f"Updating property ID: {property_obj.property_id}")
    properties_service = PropertiesService(db)
    updated_property = properties_service.update_property(property_obj, property_data)
    
    return properties_service.convert_property_to_read(updated_property)


@router.delete("/{property_id}", response_model=Any)
def delete_property(
    property_obj: Property = Depends(get_user_property),
    db: Session = Depends(get_db)
) -> Any:
    """
    Delete property.
    
    Args:
        property_obj: Property object from dependency.
        db: Database session.
        
    Returns:
        Success response.
    """
    logger.info(f"Deleting property ID: {property_obj.property_id}")
    properties_service = PropertiesService(db)
    properties_service.delete_property(property_obj)
    
    return success_response(
        data=None,
        message="Property deleted successfully"
    )
