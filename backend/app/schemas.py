from pydantic import BaseModel, EmailStr, validator
from typing import Optional, List
from datetime import date, datetime
from app.models import AttendanceStatus

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str

class EmployeeCreate(EmployeeBase):
    @validator('employee_id')
    def validate_employee_id(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Employee ID cannot be empty')
        return v.strip()
    
    @validator('full_name')
    def validate_full_name(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Full name cannot be empty')
        return v.strip()
    
    @validator('department')
    def validate_department(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Department cannot be empty')
        return v.strip()

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Attendance Schemas
class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: AttendanceStatus

class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: AttendanceStatus

class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: AttendanceStatus
    created_at: datetime
    
    class Config:
        from_attributes = True

class AttendanceWithEmployee(AttendanceResponse):
    employee: EmployeeResponse
    
    class Config:
        from_attributes = True

# Dashboard Schema
class DashboardStats(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
