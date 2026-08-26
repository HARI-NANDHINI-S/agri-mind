from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.schemas.modules import NotificationCreate, NotificationRead, ResponseEnvelope
from app.services.notification_service import NotificationService

router = APIRouter()

def service(db, current_user): return NotificationService(db, int(current_user["user_id"]))
def envelope(message, data): return {"success": True, "message": message, "data": data}


@router.get("", response_model=ResponseEnvelope)
def list_notifications(unread_only: bool = False, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    items, total = service(db, current_user).list(unread_only, skip, limit)
    return envelope("Notifications retrieved", {"items": [NotificationRead.model_validate(x) for x in items], "total": total})


@router.post("", response_model=ResponseEnvelope)
def create_notification(payload: NotificationCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return envelope("Notification created", NotificationRead.model_validate(service(db, current_user).create(payload)))


@router.put("/{notification_id}/read", response_model=ResponseEnvelope)
def mark_read(notification_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    item = service(db, current_user).mark_read(notification_id)
    if not item: raise HTTPException(404, "Notification not found")
    return envelope("Notification marked as read", NotificationRead.model_validate(item))


@router.put("/read-all", response_model=ResponseEnvelope)
def mark_all_read(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return envelope("Notifications marked as read", {"updated": service(db, current_user).mark_all_read()})


@router.delete("/{notification_id}", response_model=ResponseEnvelope)
def delete_notification(notification_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if not service(db, current_user).delete(notification_id): raise HTTPException(404, "Notification not found")
    return envelope("Notification deleted", None)
