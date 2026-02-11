from pydantic import BaseModel, EmailStr
from datetime import date, datetime
from typing import Optional
from enum import Enum

class AttendanceStatus(str, Enum):
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
class AttendanceBase(BaseModel):
    employee_id: int
    date: date
    status: AttendanceStatus

    class Config:
        orm_mode = True

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceResponse(AttendanceBase):
    id: int
    created_at: datetime

class AttendanceWithEmployee(AttendanceResponse):
    employee: EmployeeResponse

# Dashboard Schema
class DashboardStats(BaseModel):
    total_employees: int
    present_today: int
    absent_today: int
