import uuid
from sqlalchemy import Column, String, Float, ForeignKey, Text, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class Field(Base, TimestampMixin):
    __tablename__ = "fields"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    area = Column(Float, nullable=True, comment="Hectares")
    soil_ph = Column(Float, nullable=True)
    nitrogen = Column(Float, nullable=True)
    phosphorus = Column(Float, nullable=True)
    potassium = Column(Float, nullable=True)
    soil_type = Column(String(100), nullable=True)
    irrigation_method = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)

    # Relationships
    farm = relationship("Farm", back_populates="fields")
    crops = relationship("Crop", back_populates="field", cascade="all, delete-orphan")
    disease_predictions = relationship("DiseasePrediction", back_populates="field")
    yield_predictions = relationship("YieldPrediction", back_populates="field")

    __table_args__ = (Index("idx_fields_farm", "farm_id"),)
