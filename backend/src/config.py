"""
Global configuration settings for the application.
"""
from pydantic import ConfigDict, PostgresDsn
from pydantic_settings import BaseSettings


class Config(BaseSettings):
    """
    Global application configuration.
    """
    model_config = ConfigDict(env_file=".env")
    
    DATABASE_URL: PostgresDsn
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1000
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 1440
    DEBUG: bool = False
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB per file
    MAX_TOTAL_UPLOAD_SIZE: int = 50 * 1024 * 1024  # 50 MB total
    MAX_FILES_PER_UPLOAD: int = 10  # Maximum number of files per upload
    UPLOAD_DIR: str = "uploads"


settings = Config()
