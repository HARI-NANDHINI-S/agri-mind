from typing import List, Optional
from pydantic import BaseModel, Field


class CropRecommendationRequest(BaseModel):
    nitrogen: float = Field(..., ge=0, description="Nitrogen content (kg/ha)")
    phosphorus: float = Field(..., ge=0, description="Phosphorus content (kg/ha)")
    potassium: float = Field(..., ge=0, description="Potassium content (kg/ha)")
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: float = Field(..., ge=0, le=100, description="Relative humidity %")
    ph: float = Field(..., ge=0, le=14, description="Soil pH")
    rainfall: float = Field(..., ge=0, description="Rainfall in mm")


class CropRecommendationItem(BaseModel):
    crop: str
    probability: float
    rank: int


class CropRecommendationResponse(BaseModel):
    recommendations: List[CropRecommendationItem]
    model_version: str
    prediction_id: str
