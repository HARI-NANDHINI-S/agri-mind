from sqlalchemy.orm import Session
from app.models.platform import Notification


class NotificationService:
    def __init__(self, db: Session, user_id: int): self.db, self.user_id = db, user_id

    def create(self, payload):
        item = Notification(user_id=self.user_id, **payload.model_dump())
        self.db.add(item); self.db.commit(); self.db.refresh(item); return item

    def list(self, unread_only=False, skip=0, limit=50):
        query = self.db.query(Notification).filter(Notification.user_id == self.user_id)
        if unread_only: query = query.filter(Notification.is_read.is_(False))
        total = query.count()
        return query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all(), total

    def mark_read(self, notification_id):
        item = self.db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == self.user_id).first()
        if item: item.is_read = True; self.db.commit(); self.db.refresh(item)
        return item

    def mark_all_read(self):
        count = self.db.query(Notification).filter(Notification.user_id == self.user_id, Notification.is_read.is_(False)).update({Notification.is_read: True})
        self.db.commit(); return count

    def delete(self, notification_id):
        item = self.db.query(Notification).filter(Notification.id == notification_id, Notification.user_id == self.user_id).first()
        if not item: return False
        self.db.delete(item); self.db.commit(); return True
