from sqlalchemy import Boolean, Column, DateTime, Integer, JSON, String, Text, func
from app.database.base import Base


class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    type = Column(String(64), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    reference_type = Column(String(64), nullable=True)
    reference_id = Column(Integer, nullable=True)
    is_read = Column(Boolean, nullable=False, default=False, server_default="0", index=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class AIConversation(Base):
    __tablename__ = "ai_conversations"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    conversation_id = Column(String(128), nullable=False, unique=True)
    metadata_json = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class AIMessage(Base):
    __tablename__ = "ai_messages"
    id = Column(Integer, primary_key=True)
    conversation_id = Column(String(128), nullable=False, index=True)
    sender = Column(String(32), nullable=False)
    message = Column(Text, nullable=False)
    message_type = Column(String(64), nullable=True)
    sources = Column(JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class KnowledgeDocument(Base):
    __tablename__ = "knowledge_documents"
    id = Column(Integer, primary_key=True)
    doc_type = Column(String(64), nullable=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    chunks = Column(JSON, nullable=True)
    embedding_ref = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
