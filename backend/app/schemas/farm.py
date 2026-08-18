from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


class FarmCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    total_area: Optional[float] = Field(None, gt=0)
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    description: Optional[str] = None


class FarmUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    location: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    total_area: Optional[float] = Field(None, gt=0)
    soil_type: Optional[str] = None
    irrigation_type: Optional[str] = None
    description: Optional[str] = None


class FarmResponse(BaseModel):
    id: str
    owner_id: str
    name: str
    location: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    total_area: Optional[float]
    soil_type: Optional[str]
    irrigation_type: Optional[str]
    description: Optional[str]
    created_at: datetime
    updated_at: datetime
    field_count: Optional[int] = 0

    model_config = {"from_attributes": True}
