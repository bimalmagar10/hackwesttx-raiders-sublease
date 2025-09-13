# Sublease Platform Backend

A FastAPI-based backend for sublease management with social features. Built following the best practices from [fastapi-best-practices](https://github.com/zhanymkanov/fastapi-best-practices).

## Project Structure

```
backend/
├── src/                        # Main source directory
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Global configuration
│   ├── database.py             # Database connection and setup
│   ├── exceptions.py           # Global exception classes
│   ├── auth/                   # Authentication domain
│   │   ├── __init__.py
│   │   ├── config.py           # Auth-specific configuration
│   │   ├── dependencies.py     # Auth dependencies
│   │   ├── models.py           # User model
│   │   ├── router.py           # Auth routes
│   │   ├── schemas.py          # Auth schemas
│   │   └── service.py          # Auth business logic
│   ├── properties/             # Properties domain
│   │   ├── __init__.py
│   │   ├── dependencies.py     # Properties dependencies
│   │   ├── models.py           # Property model
│   │   ├── router.py           # Properties routes
│   │   ├── schemas.py          # Properties schemas
│   │   └── service.py          # Properties business logic
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       └── responses.py        # Response utilities
├── alembic/                    # Database migrations
├── tests/                      # Test files
├── uploads/                    # File uploads
├── alembic.ini                 # Alembic configuration
├── pyproject.toml              # Project configuration
└── README.md                   # This file
```

## Features

- **Domain-based Architecture**: Organized by business domains (auth, properties, etc.)
- **FastAPI Best Practices**: Following the recommended project structure
- **Authentication**: JWT-based authentication with secure token handling
- **User Management**: Complete user profile management with avatar upload
- **File Upload**: Image upload and processing with automatic resizing and optimization
- **Database**: SQLAlchemy ORM with PostgreSQL and Alembic migrations
- **Validation**: Pydantic v2 for request/response validation
- **Service Layer**: Business logic separated from API routes
- **Dependency Injection**: FastAPI's dependency system for clean architecture
- **Standardized Responses**: Consistent API response format
- **Error Handling**: Custom exception classes and standardized error responses

## Requirements

- Python 3.12+
- PostgreSQL
- uv (for dependency management)

## Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies with uv**

   ```bash
   uv sync
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:

   - `DATABASE_URL`: PostgreSQL connection string
   - `SECRET_KEY`: Secret key for JWT tokens
   - `ALGORITHM`: JWT algorithm (HS256)
   - `ACCESS_TOKEN_EXPIRE_MINUTES`: Token expiration time
   - `DEBUG`: Debug mode (True/False)

4. **Set up database**

   ```bash
   # Create database
   createdb sublease_db

   # Run migrations
   uv run alembic upgrade head
   ```

5. **Run the application**
   ```bash
   uv run fastapi dev src/main.py
   ```

## Database Configuration

The application uses PostgreSQL with SQLAlchemy ORM. Configure your database connection in the `.env` file:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/sublease_db
```

## API Documentation

Once the application is running, you can access:

- **Swagger UI**: http://localhost:8000/api/v1/docs
- **ReDoc**: http://localhost:8000/redoc

## Development

### Running Tests

```bash
uv run pytest
```

### Code Formatting

```bash
uv run ruff format .
```

### Type Checking

```bash
uv run pyright
```

### Database Migrations

```bash
# Create new migration
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1
```

## Architecture

The application follows a domain-driven design with clean architecture principles:

1. **Domain Layer** (`src/auth/`, `src/properties/`): Each domain contains:

   - `models.py`: Database models
   - `schemas.py`: Pydantic schemas for validation
   - `service.py`: Business logic
   - `router.py`: API routes
   - `dependencies.py`: Domain-specific dependencies
   - `config.py`: Domain-specific configuration (optional)

2. **Application Layer** (`src/main.py`): FastAPI app setup and route registration

3. **Infrastructure Layer** (`src/database.py`, `src/config.py`): Database setup and global configuration

4. **Utility Layer** (`src/utils/`): Shared utility functions

## License

This project is licensed under the GPL-3.0 License.
