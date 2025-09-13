"""
Authentication service layer.
"""
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any, Optional, Union

from fastapi import HTTPException, status
from jose import ExpiredSignatureError, JWSError, JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from src.auth.models import User
from src.auth.schemas import UserCreate, UserUpdate
from src.config import settings


class AuthService:
    """
    Authentication service for user management.
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    def get_password_hash(self, password: str) -> str:
        """
        Generate password hash from plain password.
        
        Args:
            password: Plain text password.
            
        Returns:
            str: Hashed password.
        """
        return self.pwd_context.hash(password)
    
    def verify_password(self, plain_password: str, hashed_password: str) -> bool:
        """
        Verify plain password against hashed password.
        
        Args:
            plain_password: Plain text password.
            hashed_password: Hashed password.
            
        Returns:
            bool: True if password matches.
        """
        return self.pwd_context.verify(plain_password, hashed_password)
    
    def create_access_token(
        self,
        subject: Union[str, Any],
        expires_delta: Optional[timedelta] = None
    ) -> str:
        """
        Create JWT access token.
        
        Args:
            subject: Token subject (user ID).
            expires_delta: Token expiration time.
            
        Returns:
            str: JWT token.
        """
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        to_encode = {"exp": expire, "sub": str(subject)}
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    def verify_token(self, token: str) -> Optional[str]:
        """
        Verify JWT token and return the subject if valid.
        
        Args:
            token: JWT token.
            
        Returns:
            str: User ID if valid, None otherwise.
        """
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=[settings.ALGORITHM]
            )
            user_id: str = payload.get("sub")
            return user_id
        except (JWTError, ExpiredSignatureError):
            return None
    
    def get_user_by_id(self, user_id: uuid.UUID) -> Optional[User]:
        """
        Get user by ID.
        
        Args:
            user_id: User ID.
            
        Returns:
            User: User object or None.
        """
        return self.db.query(User).filter(User.user_id == user_id).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """
        Get user by email.
        
        Args:
            email: User email.
            
        Returns:
            User: User object or None.
        """
        return self.db.query(User).filter(User.email == email).first()
    
    def create_user(self, user_data: UserCreate) -> User:
        """
        Create new user.
        
        Args:
            user_data: User creation data.
            
        Returns:
            User: Created user object.
        """
        user_dict = user_data.model_dump(exclude={"password"})
        hashed_password = self.get_password_hash(user_data.password)
        user = User(**user_dict, password_hash=hashed_password)
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def update_user(self, user: User, user_data: UserUpdate) -> User:
        """
        Update user.
        
        Args:
            user: User object to update.
            user_data: User update data.
            
        Returns:
            User: Updated user object.
        """
        update_data = user_data.model_dump(exclude_unset=True)
        
        for field, value in update_data.items():
            setattr(user, field, value)
        
        self.db.commit()
        self.db.refresh(user)
        
        return user
    
    def authenticate_user(self, email: str, password: str) -> Optional[User]:
        """
        Authenticate user with email and password.
        
        Args:
            email: User email.
            password: User password.
            
        Returns:
            User: Authenticated user object or None.
        """
        user = self.get_user_by_email(email)
        if not user:
            return None
        
        if not self.verify_password(password, user.password_hash):
            return None
        
        return user
