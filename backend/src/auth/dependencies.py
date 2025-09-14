"""
Authentication dependencies.
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.auth.models import User
from src.auth.service import AuthService
from src.database import get_db


security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user.
    
    Args:
        credentials: Bearer token credentials.
        db: Database session.
        
    Returns:
        User: Current authenticated user.
        
    Raises:
        HTTPException: If credentials are invalid or user not found.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    
    auth_service = AuthService(db)
    user_id = auth_service.verify_token(credentials.credentials)
    
    if user_id is None:
        raise credentials_exception
    
    user = auth_service.get_user_by_id(user_id)
    
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current active user.
    
    Args:
        current_user: Current authenticated user.
        
    Returns:
        User: Current active user.
        
    Raises:
        HTTPException: If user is inactive.
    """
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    return current_user


async def get_current_user_from_token(token: str, db: Session) -> User | None:
    """
    Get current user from raw token string (for WebSocket authentication).
    
    Args:
        token: JWT token string.
        db: Database session.
        
    Returns:
        User: Authenticated user or None if invalid.
    """
    try:
        auth_service = AuthService(db)
        user_id = auth_service.verify_token(token)
        
        if user_id is None:
            return None
        
        user = auth_service.get_user_by_id(user_id)
        
        if user is None or not user.is_active:
            return None
        
        return user
    
    except Exception:
        return None
