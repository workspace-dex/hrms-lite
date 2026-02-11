from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routers import employees, attendance
from app import crud, schemas
from sqlalchemy.orm import Session
from app.database import SessionLocal
import os

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HRMS Lite API",
    description="Human Resource Management System API",
    version="1.0.0"
)

# CORS middleware
allowed_origins = [
    "https://hrms-lite-eight-peach.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
]

if os.getenv("ALLOWED_ORIGINS"):
    allowed_origins.extend(os.getenv("ALLOWED_ORIGINS").split(","))

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)
app.include_router(attendance.router)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to HRMS Lite API",
        "docs": "/docs",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/dashboard/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats():
    """Get dashboard statistics"""
    db = SessionLocal()
    try:
        stats = crud.get_dashboard_stats(db)
        return stats
    finally:
        db.close()
