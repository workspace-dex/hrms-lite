"""
Repository layer for database operations.

Follows Repository Pattern to abstract database access.
"""

from typing import List, Optional
from datetime import date
from sqlalchemy.orm import Session
from sqlalchemy import func, and_

from app.models.employee import Employee, Attendance, AttendanceStatus


class EmployeeRepository:
    """Repository for Employee entity operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, employee_id: int) -> Optional[Employee]:
        """Get employee by database ID."""
        return self.db.query(Employee).filter(Employee.id == employee_id).first()
    
    def get_by_employee_id(self, employee_id: str) -> Optional[Employee]:
        """Get employee by employee_id field."""
        return self.db.query(Employee).filter(Employee.employee_id == employee_id).first()
    
    def get_by_email(self, email: str) -> Optional[Employee]:
        """Get employee by email."""
        return self.db.query(Employee).filter(Employee.email == email).first()
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[Employee]:
        """Get all employees with pagination."""
        return self.db.query(Employee).offset(skip).limit(limit).all()
    
    def create(self, employee: Employee) -> Employee:
        """Create new employee."""
        self.db.add(employee)
        self.db.flush()
        return employee
    
    def delete(self, employee: Employee) -> None:
        """Delete employee."""
        self.db.delete(employee)
    
    def count(self) -> int:
        """Get total employee count."""
        return self.db.query(func.count(Employee.id)).scalar()


class AttendanceRepository:
    """Repository for Attendance entity operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_id(self, attendance_id: int) -> Optional[Attendance]:
        """Get attendance by ID."""
        return self.db.query(Attendance).filter(Attendance.id == attendance_id).first()
    
    def get_by_employee(self, employee_id: int, skip: int = 0, limit: int = 100) -> List[Attendance]:
        """Get attendance records for an employee."""
        return (
            self.db.query(Attendance)
            .filter(Attendance.employee_id == employee_id)
            .order_by(Attendance.date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_by_employee_and_date(self, employee_id: int, attendance_date: date) -> Optional[Attendance]:
        """Get attendance record for specific employee and date."""
        return (
            self.db.query(Attendance)
            .filter(
                and_(
                    Attendance.employee_id == employee_id,
                    Attendance.date == attendance_date
                )
            )
            .first()
        )
    
    def create(self, attendance: Attendance) -> Attendance:
        """Create attendance record."""
        self.db.add(attendance)
        self.db.flush()
        return attendance
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[Attendance]:
        """Get all attendance records."""
        return (
            self.db.query(Attendance)
            .order_by(Attendance.date.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def count_by_status_and_date(self, status: AttendanceStatus, attendance_date: date) -> int:
        """Count attendance records by status and date."""
        return (
            self.db.query(func.count(Attendance.id))
            .filter(
                and_(
                    Attendance.date == attendance_date,
                    Attendance.status == status
                )
            )
            .scalar()
        )
