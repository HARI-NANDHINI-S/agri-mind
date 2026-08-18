import uuid
from sqlalchemy import Column, String, ForeignKey, JSON, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class CropRecommendation(Base, TimestampMixin):
    __tablename__ = "crop_recommendations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    # Stored as JSON list of dicts [{crop, probability}, ...]
    recommended_crops = Column(JSON, nullable=False)
    # Input features snapshot
    nitrogen = Column(String(20), nullable=True)
    phosphorus = Column(String(20), nullable=True)
    potassium = Column(String(20), nullable=True)
    temperature = Column(String(20), nullable=True)
    humidity = Column(String(20), nullable=True)
    ph = Column(String(20), nullable=True)
    rainfall = Column(String(20), nullable=True)
    model_version = Column(String(50), nullable=True)

    user = relationship("User", back_populates="crop_recommendations")

    __table_args__ = (Index("idx_crop_rec_user", "user_id"),)
