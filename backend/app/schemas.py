from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime
from app.models import AttendanceStatus

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    hire_date: date

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

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
        orm_mode = True

class AttendanceWithEmployee(AttendanceResponse):
    employee: EmployeeResponse
    
    class Config:
        orm_mode = True

# Dashboard Schema
class DashboardStats(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
