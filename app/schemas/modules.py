from datetime import date
from decimal import Decimal
from enum import Enum
from typing import Any, Optional
from pydantic import BaseModel, Field, ConfigDict, condecimal, conint


class ResponseEnvelope(BaseModel):
    success: bool = True
    message: str
    data: Any = None


class MarketPriceCreate(BaseModel):
    crop_name: str = Field(min_length=1, max_length=255)
    market_name: str = Field(min_length=1, max_length=255)
    location: Optional[str] = Field(default=None, max_length=255)
    price: condecimal(gt=0, max_digits=12, decimal_places=4)
    unit: Optional[str] = Field(default="kg", max_length=64)
    price_date: date
    source: Optional[str] = Field(default=None, max_length=255)


class MarketPriceRead(MarketPriceCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int


class PredictionRequest(BaseModel):
    crop: str = Field(min_length=1, max_length=255)
    market: str = Field(min_length=1, max_length=255)
    prediction_horizon: conint(ge=1, le=90) = 14


class ProfitabilityRequest(BaseModel):
    farm_id: Optional[int] = None
    field_id: Optional[int] = None
    crop_id: Optional[int] = None
    predicted_yield: condecimal(gt=0, max_digits=12, decimal_places=4)
    expected_price: condecimal(gt=0, max_digits=12, decimal_places=4)


class ProfitabilityRead(ProfitabilityRequest):
    model_config = ConfigDict(from_attributes=True)
    id: int
    total_cost: Decimal
    expected_revenue: Decimal
    expected_profit: Decimal
    profit_margin: Optional[Decimal]
    break_even_price: Optional[Decimal]


class RiskRequest(BaseModel):
    farm_id: Optional[int] = None
    field_id: Optional[int] = None
    crop_id: Optional[int] = None
    disease_signal: Optional[float] = Field(default=None, ge=0, le=100)
    yield_risk_signal: Optional[float] = Field(default=None, ge=0, le=100)
    market_volatility: Optional[float] = Field(default=None, ge=0, le=100)
    expense_deviation: Optional[float] = Field(default=None, ge=0, le=100)


class NotificationType(str, Enum):
    DISEASE = "DISEASE"
    PRICE = "PRICE"
    HARVEST = "HARVEST"
    CROP_HEALTH = "CROP_HEALTH"
    FINANCIAL = "FINANCIAL"
    SYSTEM = "SYSTEM"


class NotificationCreate(BaseModel):
    type: NotificationType
    title: str = Field(min_length=1, max_length=255)
    message: str = Field(min_length=1)
    reference_type: Optional[str] = Field(default=None, max_length=64)
    reference_id: Optional[int] = None


class NotificationRead(NotificationCreate):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_read: bool
    created_at: Any


class AssistantRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    conversation_id: Optional[str] = Field(default=None, max_length=128)


class ModelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    model_name: str
    model_type: str
    version: str
    dataset_name: Optional[str]
    dataset_size: Optional[int]
    metric_name: Optional[str]
    metric_value: Optional[Decimal]
    training_date: Optional[Any]
    status: Optional[str]
    model_path: Optional[str]
