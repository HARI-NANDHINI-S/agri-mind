from typing import Optional
from pydantic import BaseModel, Field


class PricePredictionRequest(BaseModel):
    crop_name: str = Field(..., min_length=1, max_length=255)
    market_name: Optional[str] = None
    location: Optional[str] = None
    target_month: str = Field(..., description="Target month or timeframe, e.g. Next Month, October")


class PricePredictionResponse(BaseModel):
    prediction_id: str
    crop_name: str
    market_name: Optional[str]
    location: Optional[str]
    target_month: str
    predicted_price: float
    unit: str
    confidence_lower: Optional[float]
    confidence_upper: Optional[float]
    trend_direction: str
    model_version: str
