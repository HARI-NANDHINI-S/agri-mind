from typing import Any, Optional
from pydantic import BaseModel


class APIResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None


class APIErrorResponse(BaseModel):
    success: bool = False
    message: str
    error_code: str
    details: Optional[Any] = None


def success_response(data: Any = None, message: str = "Success") -> dict:
    return {"success": True, "message": message, "data": data}


def error_response(message: str, error_code: str = "ERROR", details: Any = None) -> dict:
    return {"success": False, "message": message, "error_code": error_code, "details": details}
