import uuid
import enum
from sqlalchemy import Column, String, Float, ForeignKey, Date, Text, Enum as SAEnum, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class CropStage(str, enum.Enum):
    PLANNING = "PLANNING"
    PLANTED = "PLANTED"
    GROWING = "GROWING"
    FLOWERING = "FLOWERING"
    HARVEST_READY = "HARVEST_READY"
    HARVESTED = "HARVESTED"
    SOLD = "SOLD"


class CropStatus(str, enum.Enum):
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


class Crop(Base, TimestampMixin):
    __tablename__ = "crops"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    variety = Column(String(255), nullable=True)
    planting_date = Column(Date, nullable=True)
    expected_harvest_date = Column(Date, nullable=True)
    actual_harvest_date = Column(Date, nullable=True)
    stage = Column(SAEnum(CropStage), nullable=False, default=CropStage.PLANNING)
    status = Column(SAEnum(CropStatus), nullable=False, default=CropStatus.ACTIVE)
    seed_info = Column(String(512), nullable=True)
    expected_yield = Column(Float, nullable=True, comment="Tonnes")
    actual_yield = Column(Float, nullable=True, comment="Tonnes")
    yield_unit = Column(String(50), nullable=True, default="tonnes/hectare")
    notes = Column(Text, nullable=True)

    # Relationships
    field = relationship("Field", back_populates="crops")
    history = relationship("CropHistory", back_populates="crop", cascade="all, delete-orphan")
    disease_predictions = relationship("DiseasePrediction", back_populates="crop")
    yield_predictions = relationship("YieldPrediction", back_populates="crop")

    __table_args__ = (Index("idx_crops_field_stage", "field_id", "stage"),)
