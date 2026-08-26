from typing import List
from sqlalchemy.orm import Session
from app.models.chat_message import ChatMessage


class AssistantRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_messages(self, user_id: str, session_id: str, limit: int = 50) -> List[ChatMessage]:
        return (
            self.db.query(ChatMessage)
            .filter(ChatMessage.user_id == user_id, ChatMessage.session_id == session_id)
            .order_by(ChatMessage.created_at.asc())
            .limit(limit)
            .all()
        )

    def add_message(self, user_id: str, session_id: str, sender: str, content: str) -> ChatMessage:
        msg = ChatMessage(user_id=user_id, session_id=session_id, sender=sender, content=content)
        self.db.add(msg)
        self.db.commit()
        self.db.refresh(msg)
        return msg
