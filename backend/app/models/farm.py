import uuid
from sqlalchemy import Column, String, Float, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class Farm(Base, TimestampMixin):
    __tablename__ = "farms"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    owner_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    location = Column(String(512), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    total_area = Column(Float, nullable=True, comment="Hectares")
    soil_type = Column(String(100), nullable=True)
    irrigation_type = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="farms")
    fields = relationship("Field", back_populates="farm", cascade="all, delete-orphan")

    __table_args__ = (Index("idx_farms_owner", "owner_id"),)
