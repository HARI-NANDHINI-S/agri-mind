from typing import Optional
from pydantic import BaseModel


class DiseaseDetectionResponse(BaseModel):
    prediction_id: str
    predicted_disease: str
    confidence: float
    severity: Optional[str]
    recommendations: Optional[str]
    model_version: str
    is_healthy: bool
