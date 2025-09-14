"""
Subleases domain router.
"""
import uuid
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.database import get_db
from src.subleases.dependencies import get_sublease_by_id, get_user_sublease
from src.subleases.models import SubLease, SubLeaseStatus
from src.subleases.schemas import (
    SubLeaseCreate, SubLeaseRead, SubLeaseUpdate, SubLeaseDetail, SubLeaseMyRead,
    PropertyImageRead, LessorRead
)
from src.subleases.service import SubLeaseService
from src.utils.responses import success_response


router = APIRouter()


def _convert_sublease_to_read(sublease: SubLease) -> SubLeaseRead:
    """Convert SubLease model to SubLeaseRead schema with property images and lessor details."""
    sublease_dict = {
        "sublease_id": sublease.sublease_id,
        "property_id": sublease.property_id,
        "lessor_id": sublease.lessor_id,
        "title": sublease.title,
        "description": sublease.description,
        "rate": sublease.rate,
        "minimum_stay_days": sublease.minimum_stay_days,
        "maximum_stay_days": sublease.maximum_stay_days,
        "available_from": sublease.available_from,
        "available_until": sublease.available_until,
        "status": sublease.status,
        "created_at": sublease.created_at,
        "property_images": [
            PropertyImageRead.model_validate(image) 
            for image in (sublease.property.images if sublease.property else [])
        ],
        "lessor": LessorRead.model_validate(sublease.lessor) if sublease.lessor else None
    }
    return SubLeaseRead.model_validate(sublease_dict)


def _convert_sublease_to_my_read(sublease: SubLease) -> SubLeaseMyRead:
    """Convert SubLease model to SubLeaseMyRead schema with property images."""
    sublease_dict = {
        "sublease_id": sublease.sublease_id,
        "property_id": sublease.property_id,
        "title": sublease.title,
        "description": sublease.description,
        "rate": sublease.rate,
        "minimum_stay_days": sublease.minimum_stay_days,
        "maximum_stay_days": sublease.maximum_stay_days,
        "available_from": sublease.available_from,
        "available_until": sublease.available_until,
        "status": sublease.status,
        "created_at": sublease.created_at,
        "property_images": [
            PropertyImageRead.model_validate(image) 
            for image in (sublease.property.images if sublease.property else [])
        ]
    }
    return SubLeaseMyRead.model_validate(sublease_dict)


@router.get("/", response_model=List[SubLeaseRead])
def get_subleases(
    skip: int = 0,
    limit: int = 100,
    status: Optional[SubLeaseStatus] = Query(None, description="Filter by status"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[SubLeaseRead]:
    """
    Get all subleases with pagination and optional status filter.
    
    Args:
        skip: Number of records to skip.
        limit: Maximum number of records to return.
        status: Optional status filter.
        db: Database session.
        
    Returns:
        List[SubLeaseRead]: List of subleases.
    """
    sublease_service = SubLeaseService(db)
    subleases = sublease_service.get_all_subleases(skip=skip, limit=limit, status=status)
    return [_convert_sublease_to_read(sublease) for sublease in subleases]


@router.get("/me", response_model=List[SubLeaseMyRead])
def get_my_subleases(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> List[SubLeaseMyRead]:
    """
    Get current user's subleases.
    
    Args:
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        List[SubLeaseMyRead]: List of user's subleases.
    """
    sublease_service = SubLeaseService(db)
    subleases = sublease_service.get_subleases_by_lessor(current_user.user_id)
    return [_convert_sublease_to_my_read(sublease) for sublease in subleases]


@router.get("/{sublease_id}", response_model=SubLeaseRead)
def get_sublease(
    sublease_obj: SubLease = Depends(get_sublease_by_id),
    current_user: User = Depends(get_current_user)
) -> SubLeaseRead:
    """
    Get sublease by ID.
    
    Args:
        sublease_obj: Sublease object from dependency.
        
    Returns:
        SubLeaseRead: Sublease data.
    """
    return _convert_sublease_to_read(sublease_obj)


@router.post("/", response_model=Any)
def create_sublease(
    sublease_data: SubLeaseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Create new sublease.
    
    Args:
        sublease_data: Sublease creation data.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        Success response with sublease data.
    """
    sublease_service = SubLeaseService(db)
    sublease = sublease_service.create_sublease(sublease_data, current_user.user_id)
    
    # Refresh the sublease to get the lessor details
    created_sublease = sublease_service.get_sublease_by_id(sublease.sublease_id)
    sublease_response = _convert_sublease_to_read(created_sublease)
    
    return success_response(
        data=sublease_response,
        message="Sublease created successfully"
    )


@router.put("/{sublease_id}", response_model=SubLeaseRead)
def update_sublease(
    sublease_data: SubLeaseUpdate,
    sublease_obj: SubLease = Depends(get_user_sublease)
) -> SubLeaseRead:
    """
    Update sublease.
    
    Args:
        sublease_data: Sublease update data.
        sublease_obj: Sublease object from dependency.
        
    Returns:
        SubLeaseRead: Updated sublease data.
    """
    db = sublease_obj.__dict__['_sa_instance_state'].session
    sublease_service = SubLeaseService(db)
    updated_sublease = sublease_service.update_sublease(sublease_obj, sublease_data)
    
    # Refresh the sublease to get the lessor details
    refreshed_sublease = sublease_service.get_sublease_by_id(updated_sublease.sublease_id)
    return _convert_sublease_to_read(refreshed_sublease)


@router.delete("/{sublease_id}", response_model=Any)
def delete_sublease(
    sublease_obj: SubLease = Depends(get_user_sublease)
) -> Any:
    """
    Delete sublease.
    
    Args:
        sublease_obj: Sublease object from dependency.
        
    Returns:
        Success response.
    """
    db = sublease_obj.__dict__['_sa_instance_state'].session
    sublease_service = SubLeaseService(db)
    sublease_service.delete_sublease(sublease_obj)
    
    return success_response(
        data=None,
        message="Sublease deleted successfully"
    )
