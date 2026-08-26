from pydantic import BaseModel, Field, condecimal
from typing import Optional
from datetime import date, datetime
from enum import Enum


class ExpenseCategory(str, Enum):
    SEEDS = "SEEDS"
    FERTILIZER = "FERTILIZER"
    LABOR = "LABOR"
    IRRIGATION = "IRRIGATION"
    EQUIPMENT = "EQUIPMENT"
    TRANSPORTATION = "TRANSPORTATION"
    STORAGE = "STORAGE"
    OTHER = "OTHER"


class ExpenseBase(BaseModel):
    farm_id: int
    field_id: Optional[int] = None
    crop_id: Optional[int] = None
    category: ExpenseCategory
    amount: condecimal(gt=0, max_digits=12, decimal_places=2)
    description: Optional[str] = None
    expense_date: date


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    category: Optional[ExpenseCategory] = None
    amount: Optional[condecimal(gt=0, max_digits=12, decimal_places=2)] = None
    description: Optional[str] = None
    expense_date: Optional[date] = None


class ExpenseRead(ExpenseBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ExpenseListData(BaseModel):
    items: list[ExpenseRead]
    total: int
    skip: int
    limit: int


class ExpenseResponse(BaseModel):
    success: bool = True
    message: str
    data: ExpenseRead


class ExpenseListResponse(BaseModel):
    success: bool = True
    message: str
    data: ExpenseListData


class ExpenseSummaryItem(BaseModel):
    category: ExpenseCategory
    total: condecimal(max_digits=14, decimal_places=2)


class ExpenseAnalyticsData(BaseModel):
    total_amount: condecimal(max_digits=14, decimal_places=2)
    expense_count: int
    by_category: list[ExpenseSummaryItem]


class ExpenseAnalyticsResponse(BaseModel):
    success: bool = True
    message: str
    data: ExpenseAnalyticsData
