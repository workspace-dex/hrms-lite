from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import date
from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.get("/employee/{employee_id}", response_model=List[schemas.AttendanceResponse])
def read_attendance_by_employee(employee_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get attendance records for a specific employee"""
    # Verify employee exists
    employee = crud.get_employee_by_id(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    attendances = crud.get_attendance_by_employee(db, employee_id=employee_id, skip=skip, limit=limit)
    return attendances

@router.post("/", response_model=schemas.AttendanceResponse, status_code=201)
def create_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    """Mark attendance for an employee"""
    return crud.create_attendance(db=db, attendance=attendance)

@router.get("/", response_model=List[schemas.AttendanceWithEmployee])
def read_all_attendance(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all attendance records with employee details"""
    attendances = crud.get_all_attendance(db, skip=skip, limit=limit)
    return attendances
