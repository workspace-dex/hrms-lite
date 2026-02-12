"""
HRMS Lite - Database Models

SQLAlchemy models for Employee and Attendance entities.
"""

import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, Enum, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class AttendanceStatus(str, enum.Enum):
    """Enumeration for attendance status."""
    PRESENT = "Present"
    ABSENT = "Absent"


class Employee(Base):
    """
    Employee model representing company employees.
    
    Attributes:
        id: Primary key
        employee_id: Unique employee identifier
        full_name: Employee's full name
        email: Unique email address
        department: Department name
        hire_date: Date of hire
        created_at: Record creation timestamp
        attendances: Related attendance records
    """
    
    __tablename__ = "employees"
    
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    employee_id = Column(
        String(50),
        unique=True,
        nullable=False
    )
    full_name = Column(
        String(100),
        nullable=False
    )
    email = Column(
        String(100),
        unique=True,
        nullable=False
    )
    department = Column(
        String(50),
        nullable=False
    )
    hire_date = Column(
        Date,
        nullable=False
    )
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    
    # Relationship with attendance records
    attendances = relationship(
        "Attendance",
        back_populates="employee",
        cascade="all, delete-orphan"
    )


class Attendance(Base):
    """
    Attendance record model.
    
    Attributes:
        id: Primary key
        employee_id: Foreign key to employee
        date: Attendance date
        status: Present or Absent
        created_at: Record creation timestamp
        employee: Related employee object
    """
    
    __tablename__ = "attendance"
    
    id = Column(
        Integer,
        primary_key=True,
        index=True
    )
    employee_id = Column(
        Integer,
        ForeignKey("employees.id"),
        nullable=False
    )
    date = Column(
        Date,
        nullable=False
    )
    status = Column(
        Enum(AttendanceStatus),
        nullable=False
    )
    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )
    
    # Relationship with employee
    employee = relationship(
        "Employee",
        back_populates="attendances"
    )
