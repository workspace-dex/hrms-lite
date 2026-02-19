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

# Create database engine with database-specific settings
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False}
    )
else:
    # PostgreSQL with psycopg2 and SSL for Supabase
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,  # Verify connection before using
        pool_recycle=300,    # Recycle connections after 5 minutes
        connect_args={
            "sslmode": "require"  # Required for Supabase
        }
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
