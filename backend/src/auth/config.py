"""
Authentication configuration.
"""
from datetime import timedelta
from pydantic import ConfigDict
from pydantic_settings import BaseSettings


class AuthConfig(BaseSettings):
    """
    Authentication configuration settings.
    """
    model_config = ConfigDict(env_file=".env", env_prefix="AUTH_")
    
    JWT_ALG: str = "HS256"
    JWT_SECRET: str
    JWT_EXP: int = 30  # minutes
    REFRESH_TOKEN_EXP: timedelta = timedelta(days=30)
    SECURE_COOKIES: bool = True


auth_config = AuthConfig()
