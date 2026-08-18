import uuid
import enum
from sqlalchemy import Column, String, Float, ForeignKey, Date, Text, Enum as SAEnum, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class ExpenseCategory(str, enum.Enum):
    SEEDS = "SEEDS"
    FERTILIZERS = "FERTILIZERS"
    PESTICIDES = "PESTICIDES"
    LABOR = "LABOR"
    MACHINERY = "MACHINERY"
    IRRIGATION = "IRRIGATION"
    FUEL = "FUEL"
    OTHER = "OTHER"


class Expense(Base, TimestampMixin):
    __tablename__ = "expenses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    farm_id = Column(String(36), ForeignKey("farms.id", ondelete="SET NULL"), nullable=True)
    field_id = Column(String(36), ForeignKey("fields.id", ondelete="SET NULL"), nullable=True)
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True)
    
    title = Column(String(255), nullable=False)
    category = Column(SAEnum(ExpenseCategory), nullable=False, default=ExpenseCategory.OTHER)
    amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)

    __table_args__ = (
        Index("idx_expenses_user", "user_id"),
        Index("idx_expenses_crop", "crop_id"),
    )


class Revenue(Base, TimestampMixin):
    __tablename__ = "revenues"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True)
    
    source = Column(String(255), nullable=False, comment="Buyer or Market name")
    quantity_sold = Column(Float, nullable=False, comment="Quantity in tonnes/kg")
    unit_price = Column(Float, nullable=False, comment="Price per unit")
    total_amount = Column(Float, nullable=False)
    date = Column(Date, nullable=False)
    notes = Column(Text, nullable=True)

    __table_args__ = (
        Index("idx_revenues_user", "user_id"),
        Index("idx_revenues_crop", "crop_id"),
    )
