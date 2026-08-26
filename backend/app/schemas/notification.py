from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.models.notification import NotificationType


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    message: str
    type: NotificationType
    is_read: bool
    link: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class NotificationCreate(BaseModel):
    title: str
    message: str
    type: NotificationType = NotificationType.SYSTEM_TIP
    link: Optional[str] = None
