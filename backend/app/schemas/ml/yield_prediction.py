from typing import Optional
from pydantic import BaseModel, Field


class YieldPredictionRequest(BaseModel):
    crop_id: Optional[str] = None
    field_id: Optional[str] = None
    crop_name: str
    area: float = Field(..., gt=0, description="Field area in hectares")
    nitrogen: Optional[float] = Field(None, ge=0)
    phosphorus: Optional[float] = Field(None, ge=0)
    potassium: Optional[float] = Field(None, ge=0)
    rainfall: Optional[float] = Field(None, ge=0)
    temperature: Optional[float] = None
    humidity: Optional[float] = Field(None, ge=0, le=100)
    season: Optional[str] = None


class YieldPredictionResponse(BaseModel):
    prediction_id: str
    predicted_yield: float
    yield_unit: str
    confidence_lower: Optional[float]
    confidence_upper: Optional[float]
    model_version: str
