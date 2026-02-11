"""
Dashboard API endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.employee import DashboardStats
from app.services.employee import AttendanceService

router = APIRouter()


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db)
):
    """
    Get dashboard statistics.
    
    Returns:
        Dashboard statistics including total employees, present today, absent today
    """
    service = AttendanceService(db)
    return service.get_dashboard_stats()
