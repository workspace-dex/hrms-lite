"""
SQLAlchemy models for the HRMS database.
"""

from datetime import datetime
from enum import Enum as PyEnum
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship

from app.db.session import Base


class AttendanceStatus(str, PyEnum):
    """Attendance status enumeration."""
    PRESENT = "Present"
    ABSENT = "Absent"


class Employee(Base):
    """Employee model representing company employees."""
    
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    department = Column(String(50), nullable=False)
    hire_date = Column(Date, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    attendances = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete-orphan",
        lazy="selectin"
    )
    
    def __repr__(self):
        return f"<Employee(id={self.id}, employee_id={self.employee_id}, name={self.full_name})>"


class Attendance(Base):
    """Attendance record model."""
    
    __tablename__ = "attendance"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False, index=True)
    date = Column(Date, nullable=False, index=True)
    status = Column(Enum(AttendanceStatus), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Relationships
    employee = relationship("Employee", back_populates="attendances", lazy="joined")
    
    def __repr__(self):
        return f"<Attendance(id={self.id}, employee_id={self.employee_id}, date={self.date}, status={self.status})>"
