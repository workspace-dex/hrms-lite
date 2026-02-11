"""
Employee API endpoints.
"""

from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.employee import EmployeeCreate, EmployeeResponse
from app.services.employee import EmployeeService
from app.exceptions.base import HRMSException

router = APIRouter()


@router.get("/", response_model=List[EmployeeResponse])
def list_employees(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """
    List all employees with pagination.
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
    
    Returns:
        List of employees
    """
    service = EmployeeService(db)
    return service.list_employees(skip=skip, limit=limit)


@router.post("/", response_model=EmployeeResponse, status_code=status.HTTP_201_CREATED)
def create_employee(
    data: EmployeeCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new employee.
    
    Args:
        data: Employee data
    
    Returns:
        Created employee
    """
    service = EmployeeService(db)
    return service.create_employee(data)


@router.get("/{employee_id}", response_model=EmployeeResponse)
def get_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """
    Get employee by ID.
    
    Args:
        employee_id: Employee database ID
    
    Returns:
        Employee details
    """
    service = EmployeeService(db)
    return service.get_employee(employee_id)


@router.delete("/{employee_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete employee by ID.
    
    Args:
        employee_id: Employee database ID
    """
    service = EmployeeService(db)
    service.delete_employee(employee_id)
