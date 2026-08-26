from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.response import success_response
from app.services.notification_service import NotificationService

router = APIRouter(prefix="/notifications", tags=["Notifications & Alerts"])


@router.get("")
def list_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    data = NotificationService(db).get_notifications(current_user.id)
    return success_response(data=data, message="Notifications retrieved")


@router.put("/{notification_id}/read")
def mark_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    data = NotificationService(db).mark_read(notification_id, current_user.id)
    return success_response(data=data, message="Notification marked as read")


@router.put("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    NotificationService(db).mark_all_read(current_user.id)
    return success_response(message="All notifications marked as read")
