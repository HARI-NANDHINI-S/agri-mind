import uuid
from sqlalchemy import Column, String, ForeignKey, Text, Index, Enum as SAEnum
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin
from app.models.crop import CropStage


class CropHistory(Base, TimestampMixin):
    __tablename__ = "crop_history"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="CASCADE"), nullable=False)
    stage = Column(SAEnum(CropStage), nullable=False)
    notes = Column(Text, nullable=True)

    crop = relationship("Crop", back_populates="history")

    __table_args__ = (Index("idx_crop_history_crop", "crop_id"),)
