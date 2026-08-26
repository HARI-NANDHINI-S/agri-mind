from sqlalchemy import Column, Integer, String, ForeignKey, Date, DateTime, Numeric, Text, Enum, func
from app.database.base import Base
import enum


class ExpenseCategory(str, enum.Enum):
    SEEDS = "SEEDS"
    FERTILIZER = "FERTILIZER"
    LABOR = "LABOR"
    IRRIGATION = "IRRIGATION"
    EQUIPMENT = "EQUIPMENT"
    TRANSPORTATION = "TRANSPORTATION"
    STORAGE = "STORAGE"
    OTHER = "OTHER"


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    farm_id = Column(Integer, index=True, nullable=False)
    field_id = Column(Integer, index=True, nullable=True)
    crop_id = Column(Integer, index=True, nullable=True)

    category = Column(Enum(ExpenseCategory), nullable=False)
    amount = Column(Numeric(12, 2), nullable=False)
    description = Column(Text, nullable=True)

    expense_date = Column(Date, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)
