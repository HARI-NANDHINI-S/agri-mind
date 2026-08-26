from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class FieldCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    area: Optional[float] = Field(None, gt=0)
    soil_ph: Optional[float] = Field(None, ge=0, le=14)
    nitrogen: Optional[float] = Field(None, ge=0)
    phosphorus: Optional[float] = Field(None, ge=0)
    potassium: Optional[float] = Field(None, ge=0)
    soil_type: Optional[str] = None
    irrigation_method: Optional[str] = None
    description: Optional[str] = None


class FieldUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    area: Optional[float] = Field(None, gt=0)
    soil_ph: Optional[float] = Field(None, ge=0, le=14)
    nitrogen: Optional[float] = Field(None, ge=0)
    phosphorus: Optional[float] = Field(None, ge=0)
    potassium: Optional[float] = Field(None, ge=0)
    soil_type: Optional[str] = None
    irrigation_method: Optional[str] = None
    description: Optional[str] = None


class FieldResponse(BaseModel):
    id: str
    farm_id: str
    name: str
    area: Optional[float]
    soil_ph: Optional[float]
    nitrogen: Optional[float]
    phosphorus: Optional[float]
    potassium: Optional[float]
    soil_type: Optional[str]
    irrigation_method: Optional[str]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
