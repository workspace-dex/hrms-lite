from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app import crud, schemas
from app.database import get_db

router = APIRouter(prefix="/attendance", tags=["attendance"])

@router.get("/employee/{employee_id}", response_model=List[schemas.AttendanceResponse])
def read_attendance_by_employee(employee_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    employee = crud.get_employee_by_id(db, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return crud.get_attendance_by_employee(db, employee_id=employee_id, skip=skip, limit=limit)

@router.post("/", response_model=schemas.AttendanceResponse, status_code=201)
def create_attendance(attendance: schemas.AttendanceCreate, db: Session = Depends(get_db)):
    return crud.create_attendance(db=db, attendance=attendance)

@router.get("/", response_model=List[schemas.AttendanceWithEmployee])
def read_all_attendance(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_all_attendance(db, skip=skip, limit=limit)
