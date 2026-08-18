import uuid
from sqlalchemy import Column, String, Float, ForeignKey, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class YieldPrediction(Base, TimestampMixin):
    __tablename__ = "yield_predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True)
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    predicted_yield = Column(Float, nullable=False)
    yield_unit = Column(String(50), nullable=False, default="tonnes/hectare")
    confidence_lower = Column(Float, nullable=True)
    confidence_upper = Column(Float, nullable=True)
    model_version = Column(String(50), nullable=True)
    # Input features snapshot
    area = Column(Float, nullable=True)
    rainfall = Column(Float, nullable=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    season = Column(String(50), nullable=True)

    crop = relationship("Crop", back_populates="yield_predictions")
    field = relationship("Field", back_populates="yield_predictions")

    __table_args__ = (
        Index("idx_yield_pred_crop", "crop_id"),
        Index("idx_yield_pred_user", "user_id"),
    )
