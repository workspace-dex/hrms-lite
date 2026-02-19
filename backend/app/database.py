"""
HRMS Lite - Database Configuration

Database session management and SQLAlchemy setup for PostgreSQL.
"""

import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

# Database configuration - defaults to SQLite for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./hrms.db")

# Debug: Print the DATABASE_URL to check if it's loaded (mask password for security)
debug_url = DATABASE_URL
if "://" in debug_url and "@" in debug_url:
    parts = debug_url.split("://")
    scheme = parts[0]
    rest = parts[1]
    if "@" in rest:
        creds_host = rest.split("@")
        if ":" in creds_host[0]:
            user = creds_host[0].split(":")[0]
            debug_url = f"{scheme}://{user}:****@{creds_host[1]}"
print(f"DEBUG DATABASE_URL: {debug_url}")

# Create database engine with database-specific settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL with psycopg2 and SSL for Supabase
    # Add sslmode to URL if not present
    if "sslmode" not in DATABASE_URL:
        separator = "?" if "?" not in DATABASE_URL else "&"
        DATABASE_URL = f"{DATABASE_URL}{separator}sslmode=require"
    print(f"DEBUG Final DATABASE_URL: {DATABASE_URL.split('@')[0].rsplit(':', 1)[0]}@****")
    
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_recycle=300,
    )

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency for getting database sessions.
    
    Yields:
        Session: SQLAlchemy database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
