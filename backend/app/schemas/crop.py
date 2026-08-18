from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field
from app.models.crop import CropStage, CropStatus


class CropCreate(BaseModel):
    field_id: str
    name: str = Field(..., min_length=1, max_length=255)
    variety: Optional[str] = None
    planting_date: Optional[date] = None
    expected_harvest_date: Optional[date] = None
    stage: CropStage = CropStage.PLANNING
    seed_info: Optional[str] = None
    expected_yield: Optional[float] = Field(None, ge=0)
    yield_unit: Optional[str] = "tonnes/hectare"
    notes: Optional[str] = None


class CropUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    variety: Optional[str] = None
    planting_date: Optional[date] = None
    expected_harvest_date: Optional[date] = None
    actual_harvest_date: Optional[date] = None
    stage: Optional[CropStage] = None
    status: Optional[CropStatus] = None
    seed_info: Optional[str] = None
    expected_yield: Optional[float] = Field(None, ge=0)
    actual_yield: Optional[float] = Field(None, ge=0)
    yield_unit: Optional[str] = None
    notes: Optional[str] = None


class CropHistoryEntry(BaseModel):
    id: str
    crop_id: str
    stage: CropStage
    notes: Optional[str]
    created_at: datetime

    model_config = {"from_attributes": True}


class CropResponse(BaseModel):
    id: str
    field_id: str
    name: str
    variety: Optional[str]
    planting_date: Optional[date]
    expected_harvest_date: Optional[date]
    actual_harvest_date: Optional[date]
    stage: CropStage
    status: CropStatus
    seed_info: Optional[str]
    expected_yield: Optional[float]
    actual_yield: Optional[float]
    yield_unit: Optional[str]
    notes: Optional[str]
    created_at: datetime
    updated_at: datetime
    history: List[CropHistoryEntry] = []

    model_config = {"from_attributes": True}
