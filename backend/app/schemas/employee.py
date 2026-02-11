"""
Pydantic schemas for request/response validation and serialization.
"""

from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.employee import AttendanceStatus


class EmployeeBase(BaseModel):
    """Base employee schema with common fields."""
    employee_id: str = Field(..., min_length=1, max_length=50, description="Unique employee identifier")
    full_name: str = Field(..., min_length=1, max_length=100, description="Employee full name")
    email: EmailStr = Field(..., description="Employee email address")
    department: str = Field(..., min_length=1, max_length=50, description="Department name")
    hire_date: date = Field(..., description="Employee hire date")


class EmployeeCreate(EmployeeBase):
    """Schema for creating a new employee."""
    pass


class EmployeeResponse(EmployeeBase):
    """Schema for employee response data."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int = Field(..., description="Database ID")
    created_at: datetime = Field(..., description="Record creation timestamp")


class AttendanceBase(BaseModel):
    """Base attendance schema with common fields."""
    employee_id: int = Field(..., gt=0, description="Employee database ID")
    date: date = Field(..., description="Attendance date")
    status: AttendanceStatus = Field(..., description="Attendance status")


class AttendanceCreate(BaseModel):
    """Schema for creating attendance record."""
    employee_id: int = Field(..., gt=0, description="Employee database ID")
    date: date = Field(..., description="Attendance date")
    status: AttendanceStatus = Field(..., description="Attendance status")


class AttendanceResponse(AttendanceBase):
    """Schema for attendance response data."""
    model_config = ConfigDict(from_attributes=True)
    
    id: int = Field(..., description="Database ID")
    created_at: datetime = Field(..., description="Record creation timestamp")


class AttendanceWithEmployee(AttendanceResponse):
    """Attendance record with full employee details."""
    employee: EmployeeResponse = Field(..., description="Employee details")


class DashboardStats(BaseModel):
    """Dashboard statistics response."""
    total_employees: int = Field(..., ge=0, description="Total number of employees")
    present_today: int = Field(..., ge=0, description="Number of employees present today")
    absent_today: int = Field(..., ge=0, description="Number of employees absent today")


class PaginatedResponse(BaseModel):
    """Generic paginated response wrapper."""
    items: list
    total: int
    page: int
    page_size: int
    pages: int
