from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.notification_repo import NotificationRepository
from app.schemas.notification import NotificationResponse, NotificationCreate
from app.models.notification import NotificationType


class NotificationService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = NotificationRepository(db)

    def get_notifications(self, user_id: str) -> List[NotificationResponse]:
        notifications = self.repo.get_by_user(user_id)
        if not notifications:
            # Seed initial friendly notification tips
            self._seed_default_notifications(user_id)
            notifications = self.repo.get_by_user(user_id)
        return [NotificationResponse.model_validate(n) for n in notifications]

    def create_notification(self, user_id: str, data: NotificationCreate) -> NotificationResponse:
        n = self.repo.create(user_id, **data.model_dump())
        return NotificationResponse.model_validate(n)

    def mark_read(self, notification_id: str, user_id: str) -> Optional[NotificationResponse]:
        n = self.repo.mark_as_read(notification_id, user_id)
        return NotificationResponse.model_validate(n) if n else None

    def mark_all_read(self, user_id: str) -> None:
        self.repo.mark_all_as_read(user_id)

    def _seed_default_notifications(self, user_id: str):
        defaults = [
            {
                "title": "Welcome to AgriMind!",
                "message": "Start by creating your first farm and field in the Farm Management tab.",
                "type": NotificationType.SYSTEM_TIP,
                "link": "/farms",
            },
            {
                "title": "Optimal Soil Test Reminder",
                "message": "Check soil N-P-K and pH metrics regularly before crop sowing.",
                "type": NotificationType.SYSTEM_TIP,
                "link": "/ml/crop-recommendation",
            },
        ]
        for d in defaults:
            self.repo.create(user_id, **d)
