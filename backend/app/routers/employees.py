"""
HRMS Lite - Employee Router

API endpoints for employee management.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, schemas
from app.database import get_db


router = APIRouter(
    prefix="/employees",
    tags=["employees"]
)


@router.get(
    "/",
    response_model=List[schemas.EmployeeResponse]
)
def read_employees(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    Get all employees with pagination.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
    
    Returns:
        List of employees
    """
    return crud.get_employees(db, skip=skip, limit=limit)


@router.post(
    "/",
    response_model=schemas.EmployeeResponse,
    status_code=201
)
def create_employee(
    employee: schemas.EmployeeCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new employee.
    
    Args:
        employee: Employee data
    
    Returns:
        Created employee
    """
    return crud.create_employee(db=db, employee=employee)


@router.get(
    "/{employee_id}",
    response_model=schemas.EmployeeResponse
)
def read_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """
    Get employee by ID.
    
    Args:
        employee_id: Employee database ID
    
    Returns:
        Employee details
    
    Raises:
        HTTPException: If employee not found
    """
    db_employee = crud.get_employee_by_id(db, employee_id=employee_id)
    
    if db_employee is None:
        raise HTTPException(
            status_code=404,
            detail="Employee not found"
        )
    
    return db_employee


@router.delete(
    "/{employee_id}",
    response_model=schemas.EmployeeResponse
)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete employee by ID.
    
    Args:
        employee_id: Employee database ID
    
    Returns:
        Deleted employee
    """
    return crud.delete_employee(db=db, employee_id=employee_id)
