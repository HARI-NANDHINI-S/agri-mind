import uuid
from sqlalchemy import Column, String, ForeignKey, Text, Index
from app.database.base import Base, TimestampMixin


class ChatMessage(Base, TimestampMixin):
    __tablename__ = "chat_messages"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    session_id = Column(String(64), nullable=False, index=True)
    sender = Column(String(20), nullable=False, comment="USER or ASSISTANT")
    content = Column(Text, nullable=False)

    __table_args__ = (
        Index("idx_chat_user_session", "user_id", "session_id"),
    )
