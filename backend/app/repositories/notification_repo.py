from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.notification import Notification, NotificationType


class NotificationRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_user(self, user_id: str, limit: int = 50) -> List[Notification]:
        return (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .limit(limit)
            .all()
        )

    def create(self, user_id: str, title: str, message: str, type: NotificationType = NotificationType.SYSTEM_TIP, link: Optional[str] = None) -> Notification:
        n = Notification(user_id=user_id, title=title, message=message, type=type, link=link)
        self.db.add(n)
        self.db.commit()
        self.db.refresh(n)
        return n

    def mark_as_read(self, notification_id: str, user_id: str) -> Optional[Notification]:
        n = (
            self.db.query(Notification)
            .filter(Notification.id == notification_id, Notification.user_id == user_id)
            .first()
        )
        if n:
            n.is_read = True
            self.db.commit()
            self.db.refresh(n)
        return n

    def mark_all_as_read(self, user_id: str) -> None:
        self.db.query(Notification).filter(Notification.user_id == user_id).update({"is_read": True})
        self.db.commit()
