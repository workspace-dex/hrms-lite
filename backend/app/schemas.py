"""
HRMS Lite - Pydantic Schemas

Request/response models for API validation and serialization.
"""

from datetime import date, datetime
from pydantic import BaseModel, EmailStr


class AttendanceStatus(str):
    """Attendance status string type."""
    PRESENT = "Present"
    ABSENT = "Absent"


# =============================================================================
# Employee Schemas
# =============================================================================


class EmployeeBase(BaseModel):
    """Base employee schema with common fields."""
    
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    hire_date: date
    
    class Config:
        orm_mode = True


class EmployeeCreate(EmployeeBase):
    """Schema for creating a new employee."""
    pass


class EmployeeResponse(EmployeeBase):
    """Schema for employee response data."""
    
    id: int
    created_at: datetime


# =============================================================================
# Attendance Schemas
# =============================================================================


class AttendanceCreate(BaseModel):
    """Schema for creating attendance record."""
    
    employee_id: int
    date: date
    status: str


class AttendanceResponse(BaseModel):
    """Schema for attendance response data."""
    
    id: int
    employee_id: int
    date: date
    status: str
    created_at: datetime
    
    class Config:
        orm_mode = True


class AttendanceWithEmployee(AttendanceResponse):
    """Attendance record with full employee details."""
    
    employee: EmployeeResponse


# =============================================================================
# Dashboard Schema
# =============================================================================


class DashboardStats(BaseModel):
    """Dashboard statistics response."""
    
    total_employees: int
    present_today: int
    absent_today: int
