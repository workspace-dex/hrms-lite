from sqlalchemy.orm import Session
from sqlalchemy import func, and_
from datetime import date
from typing import List
from fastapi import HTTPException

from app.models import Employee, Attendance, AttendanceStatus
from app.schemas import EmployeeCreate, EmployeeResponse, AttendanceCreate

def get_employee_by_id(db: Session, employee_id: int):
    return db.query(Employee).filter(Employee.id == employee_id).first()

def get_employee_by_employee_id(db: Session, employee_id: str):
    return db.query(Employee).filter(Employee.employee_id == employee_id).first()

def get_employee_by_email(db: Session, email: str):
    return db.query(Employee).filter(Employee.email == email).first()

def get_employees(db: Session, skip: int = 0, limit: int = 100) -> List[Employee]:
    return db.query(Employee).offset(skip).limit(limit).all()

def create_employee(db: Session, employee: EmployeeCreate):
    if get_employee_by_employee_id(db, employee.employee_id):
        raise HTTPException(status_code=400, detail="Employee ID already exists")
    
    if get_employee_by_email(db, employee.email):
        raise HTTPException(status_code=400, detail="Email already exists")
    
    db_employee = Employee(**employee.dict())
    db.add(db_employee)
    db.commit()
    db.refresh(db_employee)
    return db_employee

def delete_employee(db: Session, employee_id: int):
    db_employee = get_employee_by_id(db, employee_id)
    if not db_employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(db_employee)
    db.commit()
    return db_employee

def get_attendance_by_employee(db: Session, employee_id: int, skip: int = 0, limit: int = 100):
    return db.query(Attendance).filter(
        Attendance.employee_id == employee_id
    ).order_by(Attendance.date.desc()).offset(skip).limit(limit).all()

def get_attendance_by_employee_and_date(db: Session, employee_id: int, attendance_date: date):
    return db.query(Attendance).filter(
        and_(
            Attendance.employee_id == employee_id,
            Attendance.date == attendance_date
        )
    ).first()

def create_attendance(db: Session, attendance: AttendanceCreate):
    employee = get_employee_by_id(db, attendance.employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    existing = get_attendance_by_employee_and_date(db, attendance.employee_id, attendance.date)
    if existing:
        raise HTTPException(status_code=400, detail="Attendance already marked for this date")
    
    db_attendance = Attendance(**attendance.dict())
    db.add(db_attendance)
    db.commit()
    db.refresh(db_attendance)
    return db_attendance

def get_all_attendance(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Attendance).order_by(Attendance.date.desc()).offset(skip).limit(limit).all()

def get_dashboard_stats(db: Session):
    today = date.today()
    
    total_employees = db.query(func.count(Employee.id)).scalar()
    
    present_today = db.query(func.count(Attendance.id)).filter(
        and_(
            Attendance.date == today,
            Attendance.status == AttendanceStatus.PRESENT
        )
    ).scalar()
    
    absent_today = db.query(func.count(Attendance.id)).filter(
        and_(
            Attendance.date == today,
            Attendance.status == AttendanceStatus.ABSENT
        )
    ).scalar()
    
    return {
        "total_employees": total_employees or 0,
        "present_today": present_today or 0,
        "absent_today": absent_today or 0
    }
