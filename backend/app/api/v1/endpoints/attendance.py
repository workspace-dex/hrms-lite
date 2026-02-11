"""
Attendance API endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.employee import AttendanceCreate, AttendanceResponse
from app.services.employee import AttendanceService

router = APIRouter()


@router.get("/employee/{employee_id}", response_model=List[AttendanceResponse])
def get_employee_attendance(
    employee_id: int,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get attendance records for a specific employee.
    
    Args:
        employee_id: Employee database ID
        skip: Number of records to skip
        limit: Maximum number of records to return
    
    Returns:
        List of attendance records
    """
    service = AttendanceService(db)
    return service.get_employee_attendance(employee_id, skip=skip, limit=limit)


@router.post("/", response_model=AttendanceResponse, status_code=status.HTTP_201_CREATED)
def mark_attendance(
    data: AttendanceCreate,
    db: Session = Depends(get_db)
):
    """
    Mark attendance for an employee.
    
    Args:
        data: Attendance data
    
    Returns:
        Created attendance record
    """
    service = AttendanceService(db)
    return service.mark_attendance(data)
