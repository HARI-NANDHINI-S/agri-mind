import uuid
from sqlalchemy import Column, String, Float, ForeignKey, Index
from app.database.base import Base, TimestampMixin


class PricePrediction(Base, TimestampMixin):
    __tablename__ = "price_predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_name = Column(String(255), nullable=False)
    market_name = Column(String(255), nullable=True)
    location = Column(String(255), nullable=True)
    target_month = Column(String(50), nullable=False)
    predicted_price = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False, default="₹/quintal")
    confidence_lower = Column(Float, nullable=True)
    confidence_upper = Column(Float, nullable=True)
    trend_direction = Column(String(20), nullable=True, comment="UP, DOWN, STABLE")
    model_version = Column(String(50), nullable=True)

    __table_args__ = (
        Index("idx_price_pred_user", "user_id"),
        Index("idx_price_pred_crop", "crop_name"),
    )
