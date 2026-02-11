"""
Custom exception hierarchy for the HRMS application.

Provides structured error handling with HTTP status codes and error codes
for client-side error handling.
"""

from typing import Optional, Dict, Any


class HRMSException(Exception):
    """Base exception for HRMS application."""
    
    def __init__(
        self,
        message: str,
        status_code: int = 500,
        error_code: str = "INTERNAL_ERROR",
        details: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.status_code = status_code
        self.error_code = error_code
        self.details = details or {}
        super().__init__(self.message)


class NotFoundException(HRMSException):
    """Resource not found."""
    
    def __init__(self, resource: str, identifier: str):
        super().__init__(
            message=f"{resource} with id '{identifier}' not found",
            status_code=404,
            error_code="NOT_FOUND",
            details={"resource": resource, "identifier": identifier}
        )


class DuplicateException(HRMSException):
    """Duplicate resource."""
    
    def __init__(self, resource: str, field: str, value: str):
        super().__init__(
            message=f"{resource} with {field} '{value}' already exists",
            status_code=409,
            error_code="DUPLICATE_ERROR",
            details={"resource": resource, "field": field, "value": value}
        )


class ValidationException(HRMSException):
    """Input validation error."""
    
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            message=message,
            status_code=422,
            error_code="VALIDATION_ERROR",
            details=details
        )


class BusinessRuleException(HRMSException):
    """Business rule violation."""
    
    def __init__(self, message: str):
        super().__init__(
            message=message,
            status_code=400,
            error_code="BUSINESS_RULE_VIOLATION"
        )
