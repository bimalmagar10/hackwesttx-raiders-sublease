"""
Authentication routers and endpoints.
"""
from datetime import timedelta
from typing import Any

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.auth.schemas import UserLogin, UserCreate, UserRead, UserProfile, UserUpdate
from src.auth.service import AuthService
from src.config import settings
from src.database import get_db
from src.exceptions import ValidationError
from src.utils.file_upload import upload_user_avatar
from src.utils.responses import error_response, success_response


router = APIRouter()


class Token(BaseModel):
    """
    JWT token response schema.
    """
    access_token: str
    token_type: str = "bearer"


class AvatarUploadResponse(BaseModel):
    """
    Avatar upload response schema.
    """
    profile_image_url: str


@router.post("/register", response_model=Any)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Register new user.
    
    Args:
        user_data: User registration data.
        db: Database session.
        
    Returns:
        Success response with user data.
        
    Raises:
        HTTPException: If user already exists.
    """
    auth_service = AuthService(db)
    
    existing_user = auth_service.get_user_by_email(user_data.email)
    if existing_user:
        raise ValidationError("User with this email already exists.")

    user = auth_service.create_user(user_data)
    
    user_response = UserRead.model_validate(user)
    
    return success_response(
        data=user_response,
        message="User registered successfully."
    )


@router.post("/login", response_model=Any)
def login(
    form_data: UserLogin,
    db: Session = Depends(get_db)
) -> Any:
    """
    User login and token generation.
    
    Args:
        form_data: User login credentials.
        db: Database session.
        
    Returns:
        Success response with access token.
        
    Raises:
        HTTPException: If credentials are invalid.
    """
    auth_service = AuthService(db)
    
    user = auth_service.get_user_by_email(form_data.email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User is not registered. Please register first."
        )
    
    authenticated_user = auth_service.authenticate_user(form_data.email, form_data.password)
    if not authenticated_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    access_token = auth_service.create_access_token(authenticated_user.user_id)
    
    token_data = Token(access_token=access_token)
    
    return success_response(
        data=token_data,
        message="Login successful!"
    )


@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user profile.
    
    Args:
        current_user: Current authenticated user.
        
    Returns:
        UserProfile: Current user profile.
    """
    return UserProfile.model_validate(current_user)


@router.patch("/me", response_model=UserProfile)
def update_current_user_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Update current user profile.
    
    Args:
        user_update: User update data.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        UserProfile: Updated user profile.
    """
    auth_service = AuthService(db)
    updated_user = auth_service.update_user(current_user, user_update)
    
    return UserProfile.model_validate(updated_user)


@router.post("/me/avatar", response_model=Any)
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """
    Upload user avatar image.
    
    Args:
        file: Avatar image file to upload.
        current_user: Current authenticated user.
        db: Database session.
        
    Returns:
        Success response with avatar URL.
    """
    # Upload and process the avatar
    avatar_url = await upload_user_avatar(current_user.user_id, file)

    # Update user's profile image URL in database
    _ = AuthService(db)
    current_user.profile_image_url = avatar_url
    db.commit()
    db.refresh(current_user)

    upload_data = AvatarUploadResponse(profile_image_url=avatar_url)

    return success_response(
        data=upload_data,
        message="Avatar uploaded successfully."
    )
