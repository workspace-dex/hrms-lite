from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import enum

class AttendanceStatus(str, enum.Enum):
    PRESENT = "Present"
    ABSENT = "Absent"

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(String(50), unique=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    department = Column(String(50), nullable=False)
    hire_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    attendances = relationship("Attendance", back_populates="employee", cascade="all, delete-orphan")

class Attendance(Base):
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    status = Column(Enum(AttendanceStatus), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    employee = relationship("Employee", back_populates="attendances")
