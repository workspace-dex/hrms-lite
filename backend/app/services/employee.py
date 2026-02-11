"""
Service layer for business logic.

Contains business rules and orchestrates repository operations.
"""

from datetime import date
from typing import List, Optional
from sqlalchemy.orm import Session

from app.models.employee import Employee, Attendance, AttendanceStatus
from app.schemas.employee import EmployeeCreate, AttendanceCreate, DashboardStats
from app.repositories.employee import EmployeeRepository, AttendanceRepository
from app.exceptions.base import NotFoundException, DuplicateException, BusinessRuleException


class EmployeeService:
    """Service for employee-related business logic."""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = EmployeeRepository(db)
    
    def get_employee(self, employee_id: int) -> Employee:
        """Get employee by ID with validation."""
        employee = self.repo.get_by_id(employee_id)
        if not employee:
            raise NotFoundException("Employee", str(employee_id))
        return employee
    
    def list_employees(self, skip: int = 0, limit: int = 100) -> List[Employee]:
        """List all employees."""
        return self.repo.get_all(skip=skip, limit=limit)
    
    def create_employee(self, data: EmployeeCreate) -> Employee:
        """Create new employee with validation."""
        # Check for duplicate employee_id
        if self.repo.get_by_employee_id(data.employee_id):
            raise DuplicateException("Employee", "employee_id", data.employee_id)
        
        # Check for duplicate email
        if self.repo.get_by_email(data.email):
            raise DuplicateException("Employee", "email", data.email)
        
        employee = Employee(**data.model_dump())
        return self.repo.create(employee)
    
    def delete_employee(self, employee_id: int) -> None:
        """Delete employee."""
        employee = self.get_employee(employee_id)
        self.repo.delete(employee)
    
    def count_employees(self) -> int:
        """Get total employee count."""
        return self.repo.count()


class AttendanceService:
    """Service for attendance-related business logic."""
    
    def __init__(self, db: Session):
        self.db = db
        self.repo = AttendanceRepository(db)
        self.employee_repo = EmployeeRepository(db)
    
    def get_employee_attendance(self, employee_id: int, skip: int = 0, limit: int = 100) -> List[Attendance]:
        """Get attendance records for an employee."""
        # Verify employee exists
        if not self.employee_repo.get_by_id(employee_id):
            raise NotFoundException("Employee", str(employee_id))
        
        return self.repo.get_by_employee(employee_id, skip=skip, limit=limit)
    
    def mark_attendance(self, data: AttendanceCreate) -> Attendance:
        """Mark attendance with validation."""
        # Verify employee exists
        if not self.employee_repo.get_by_id(data.employee_id):
            raise NotFoundException("Employee", str(data.employee_id))
        
        # Check if attendance already marked for this date
        existing = self.repo.get_by_employee_and_date(data.employee_id, data.date)
        if existing:
            raise BusinessRuleException(
                f"Attendance already marked for employee {data.employee_id} on {data.date}"
            )
        
        attendance = Attendance(**data.model_dump())
        return self.repo.create(attendance)
    
    def get_dashboard_stats(self) -> DashboardStats:
        """Get dashboard statistics."""
        today = date.today()
        
        total = self.employee_repo.count()
        present = self.repo.count_by_status_and_date(AttendanceStatus.PRESENT, today)
        absent = self.repo.count_by_status_and_date(AttendanceStatus.ABSENT, today)
        
        return DashboardStats(
            total_employees=total,
            present_today=present,
            absent_today=absent
        )
