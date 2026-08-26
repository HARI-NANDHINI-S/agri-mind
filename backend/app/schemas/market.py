from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class MarketPriceCreate(BaseModel):
    crop_name: str = Field(..., min_length=1, max_length=255)
    market_name: str = Field(..., min_length=1, max_length=255)
    location: str = Field(..., min_length=1, max_length=255)
    state: Optional[str] = None
    modal_price: float = Field(..., gt=0)
    min_price: float = Field(..., gt=0)
    max_price: float = Field(..., gt=0)
    unit: str = "₹/quintal"
    date: date


class MarketPriceResponse(BaseModel):
    id: str
    crop_name: str
    market_name: str
    location: str
    state: Optional[str]
    modal_price: float
    min_price: float
    max_price: float
    unit: str
    date: date
    created_at: datetime

    model_config = {"from_attributes": True}


class PriceTrendPoint(BaseModel):
    date: date
    modal_price: float
    min_price: float
    max_price: float
