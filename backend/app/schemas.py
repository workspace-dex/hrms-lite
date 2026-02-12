from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional

class AttendanceStatus(str):
    PRESENT = "Present"
    ABSENT = "Absent"

# Employee Schemas
class EmployeeBase(BaseModel):
    employee_id: str
    full_name: str
    email: EmailStr
    department: str
    hire_date: date
    
    class Config:
        orm_mode = True

class EmployeeCreate(EmployeeBase):
    pass

class EmployeeResponse(EmployeeBase):
    id: int
    created_at: datetime

# Attendance Schemas  
class AttendanceCreate(BaseModel):
    employee_id: int
    date: date
    status: str

class AttendanceResponse(BaseModel):
    id: int
    employee_id: int
    date: date
    status: str
    created_at: datetime
    
    class Config:
        orm_mode = True

class AttendanceWithEmployee(AttendanceResponse):
    employee: EmployeeResponse

# Dashboard
class DashboardStats(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
