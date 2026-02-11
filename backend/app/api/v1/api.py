"""
API router configuration.
"""

from fastapi import APIRouter

from app.api.v1.endpoints import employees, attendance, dashboard

api_router = APIRouter()

api_router.include_router(employees.router, prefix="/employees", tags=["employees"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])
