from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr
from app.models.user import UserRole


class UserAdminResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    phone_number: Optional[str]
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class UserRoleUpdate(BaseModel):
    role: UserRole


class UserStatusUpdate(BaseModel):
    is_active: bool


class MLModelStatus(BaseModel):
    name: str
    version: str
    status: str
    last_trained: Optional[str]


class AdminOverview(BaseModel):
    total_users: int
    total_farmers: int
    total_farms: int
    total_fields: int
    total_crops: int
    total_predictions: int
    system_health: str
    ml_models: List[MLModelStatus]
