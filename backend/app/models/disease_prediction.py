import uuid
from sqlalchemy import Column, String, Float, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class DiseasePrediction(Base, TimestampMixin):
    __tablename__ = "disease_predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True)
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    image_path = Column(String(512), nullable=False)
    predicted_disease = Column(String(255), nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String(50), nullable=True)
    model_version = Column(String(50), nullable=True)
    recommendations = Column(Text, nullable=True)

    crop = relationship("Crop", back_populates="disease_predictions")
    field = relationship("Field", back_populates="disease_predictions")

    __table_args__ = (
        Index("idx_disease_pred_crop", "crop_id"),
        Index("idx_disease_pred_user", "user_id"),
    )
