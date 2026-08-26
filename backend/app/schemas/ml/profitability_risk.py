from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class ProfitabilityRiskRequest(BaseModel):
    crop_id: Optional[str] = None
    crop_name: str = Field(..., min_length=1, max_length=255)
    area: float = Field(..., gt=0)
    estimated_cost: float = Field(..., gt=0)
    expected_yield_per_ha: Optional[float] = Field(None, gt=0)
    expected_market_price: Optional[float] = Field(None, gt=0)


class ProfitabilityRiskResponse(BaseModel):
    analysis_id: str
    crop_name: str
    estimated_cost: float
    projected_revenue: float
    projected_profit: float
    expected_roi_percent: float
    overall_risk_score: str  # LOW, MEDIUM, HIGH
    disease_risk_factor: float
    market_price_volatility: float
    weather_risk_factor: float
    risk_breakdown: Dict[str, Any]
    recommendations: str
    model_version: str
