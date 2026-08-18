from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.financial import ExpenseCategory


class ExpenseCreate(BaseModel):
    farm_id: Optional[str] = None
    field_id: Optional[str] = None
    crop_id: Optional[str] = None
    title: str = Field(..., min_length=1, max_length=255)
    category: ExpenseCategory = ExpenseCategory.OTHER
    amount: float = Field(..., gt=0)
    date: date
    notes: Optional[str] = None


class ExpenseUpdate(BaseModel):
    farm_id: Optional[str] = None
    field_id: Optional[str] = None
    crop_id: Optional[str] = None
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    category: Optional[ExpenseCategory] = None
    amount: Optional[float] = Field(None, gt=0)
    date: Optional[date] = None
    notes: Optional[str] = None


class ExpenseResponse(BaseModel):
    id: str
    user_id: str
    farm_id: Optional[str]
    field_id: Optional[str]
    crop_id: Optional[str]
    title: str
    category: ExpenseCategory
    amount: float
    date: date
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class RevenueCreate(BaseModel):
    crop_id: Optional[str] = None
    source: str = Field(..., min_length=1, max_length=255)
    quantity_sold: float = Field(..., gt=0)
    unit_price: float = Field(..., gt=0)
    total_amount: Optional[float] = None
    date: date
    notes: Optional[str] = None


class RevenueResponse(BaseModel):
    id: str
    user_id: str
    crop_id: Optional[str]
    source: str
    quantity_sold: float
    unit_price: float
    total_amount: float
    date: date
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class FinancialSummary(BaseModel):
    total_revenue: float
    total_expense: float
    net_profit: float
    profit_margin_percent: float
    expense_by_category: dict[str, float]
    recent_expenses: List[ExpenseResponse]
    recent_revenues: List[RevenueResponse]
