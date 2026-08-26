import uuid
import enum
from sqlalchemy import Column, String, Boolean, ForeignKey, Text, Enum as SAEnum, Index
from app.database.base import Base, TimestampMixin


class NotificationType(str, enum.Enum):
    DISEASE_ALERT = "DISEASE_ALERT"
    HARVEST_REMINDER = "HARVEST_REMINDER"
    PRICE_ALERT = "PRICE_ALERT"
    SYSTEM_TIP = "SYSTEM_TIP"
    FINANCIAL_ALERT = "FINANCIAL_ALERT"


class Notification(Base, TimestampMixin):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(SAEnum(NotificationType), nullable=False, default=NotificationType.SYSTEM_TIP)
    is_read = Column(Boolean, nullable=False, default=False)
    link = Column(String(255), nullable=True)

    __table_args__ = (
        Index("idx_notifications_user_read", "user_id", "is_read"),
    )
