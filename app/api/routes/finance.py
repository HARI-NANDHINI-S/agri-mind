from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.schemas.modules import ProfitabilityRead, ProfitabilityRequest, ResponseEnvelope, RiskRequest
from app.services.finance_service import FinanceService, RiskService

router = APIRouter()

def user_id(current_user): return int(current_user["user_id"])

def envelope(message, data): return {"success": True, "message": message, "data": data}


@router.post("/calculate", response_model=ResponseEnvelope)
def calculate(payload: ProfitabilityRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return envelope("Profitability calculated", ProfitabilityRead.model_validate(FinanceService(db, user_id(current_user)).calculate(payload)))


@router.get("", response_model=ResponseEnvelope)
def profitability(crop_id: Optional[int] = None, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return envelope("Profitability records retrieved", [ProfitabilityRead.model_validate(x) for x in FinanceService(db, user_id(current_user)).list(crop_id)])


@router.get("/compare", response_model=ResponseEnvelope)
def compare(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    records = FinanceService(db, user_id(current_user)).list()
    return envelope("Profitability comparison retrieved", [ProfitabilityRead.model_validate(x) for x in records])


@router.get("/{crop_id}", response_model=ResponseEnvelope)
def crop_profitability(crop_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return envelope("Crop profitability retrieved", [ProfitabilityRead.model_validate(x) for x in FinanceService(db, user_id(current_user)).list(crop_id)])


@router.post("/risk", response_model=ResponseEnvelope)
def assess_risk(payload: RiskRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    return envelope("Risk assessment generated", RiskService(db, user_id(current_user)).assess(payload))
