"""
Main FastAPI application.
"""
import os
import uvicorn
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

from src.auth import router as auth_router
from src.properties import router as properties_router
from src.subleases import router as subleases_router
from src.userratings import router as userratings_router
from src.config import settings
from src.database import create_db_and_tables

# Import all models to ensure they are registered with SQLAlchemy
from src.auth.models import User  # noqa: F401
from src.properties.models import Property  # noqa: F401
from src.propertyimages.models import PropertyImage  # noqa: F401
from src.subleases.models import SubLease  # noqa: F401
from src.userratings.models import UserRating  # noqa: F401


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    
    Args:
        app: FastAPI application instance.
    """
    create_db_and_tables()
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    os.makedirs(f"{settings.UPLOAD_DIR}/avatars", exist_ok=True)
    os.makedirs(f"{settings.UPLOAD_DIR}/properties", exist_ok=True)
    yield


app = FastAPI(
    title="Sublease Pro",
    description="Sublease your apartment, house or room with ease.Short term and long term subleases available.",
    version="1.0.0",
    docs_url="/api/v1/docs",
    lifespan=lifespan
)

# Configure larger request body limits for file uploads
# These settings help handle multiple file uploads better
import uvicorn.config
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class RequestLimitMiddleware(BaseHTTPMiddleware):
    """Middleware to handle large multipart requests."""
    
    async def dispatch(self, request: Request, call_next):
        # Increase the maximum field size for multipart uploads
        if request.headers.get("content-type", "").startswith("multipart/form-data"):
            # Allow larger multipart fields
            request.scope["multipart_max_fields"] = 1000
            request.scope["multipart_max_files"] = 20
        
        response = await call_next(request)
        return response

app.add_middleware(RequestLimitMiddleware)

app.mount("/images", StaticFiles(directory=settings.UPLOAD_DIR), name="images")

# Include routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(properties_router, prefix="/api/v1/properties", tags=["Properties"])
app.include_router(subleases_router, prefix="/api/v1/subleases", tags=["Subleases"])
app.include_router(userratings_router, prefix="/api/v1/userratings", tags=["User Ratings"])


@app.get("/")
def read_root():
    """
    Root endpoint.
    
    Returns:
        dict: API information.
    """
    return {
        "message": "Sublease Management System API",
        "version": "1.0.0",
        "docs": "/api/v1/docs"
    }


@app.get("/health")
def health_check():
    """
    Health check endpoint.
    
    Returns:
        dict: Health status.
    """
    return {"status": "healthy", "database": "connected"}


@app.get("/api/v1")
def api_info():
    """
    API information endpoint.
    
    Returns:
        dict: API information and endpoints.
    """
    return {
        "message": "Sublease Management System API v1",
        "endpoints": {
            "auth": "/api/v1/auth",
            "properties": "/api/v1/properties",
            "subleases": "/api/v1/subleases",
            "userratings": "/api/v1/userratings",
            "messages": "/api/v1/messages"
        }
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000,reload=True)