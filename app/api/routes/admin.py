from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.models.expense import Expense
from app.models.market import ModelRegistry, PricePrediction
from app.models.platform import Notification
from app.models.finance import ProfitabilityRecord, RiskAssessment
from app.schemas.modules import ModelRead, ResponseEnvelope

router = APIRouter()

def require_admin(current_user=Depends(get_current_user)):
    role = current_user.get("claims", {}).get("role") or current_user.get("claims", {}).get("user_role")
    if str(role).upper() != "ADMIN": raise HTTPException(403, "Admin role required")
    return current_user

def envelope(message, data): return {"success": True, "message": message, "data": data}

@router.get("/dashboard", response_model=ResponseEnvelope)
def dashboard(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    return envelope("Admin dashboard retrieved", {"expenses": db.query(func.count(Expense.id)).scalar(), "price_predictions": db.query(func.count(PricePrediction.id)).scalar(), "profitability_records": db.query(func.count(ProfitabilityRecord.id)).scalar(), "risk_assessments": db.query(func.count(RiskAssessment.id)).scalar(), "notifications": db.query(func.count(Notification.id)).scalar()})

@router.get("/analytics", response_model=ResponseEnvelope)
def analytics(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    return dashboard(db, current_user)

@router.get("/models", response_model=ResponseEnvelope)
def models(db: Session = Depends(get_db), current_user=Depends(require_admin)):
    return envelope("Model registry retrieved", [ModelRead.model_validate(x) for x in db.query(ModelRegistry).order_by(ModelRegistry.created_at.desc()).all()])

@router.get("/models/{model_id}", response_model=ResponseEnvelope)
def model(model_id: int, db: Session = Depends(get_db), current_user=Depends(require_admin)):
    item = db.query(ModelRegistry).filter(ModelRegistry.id == model_id).first()
    if not item: raise HTTPException(404, "Model not found")
    return envelope("Model metadata retrieved", ModelRead.model_validate(item))

@router.get("/users", response_model=ResponseEnvelope)
def users(current_user=Depends(require_admin)):
    return envelope("User directory unavailable", {"available": False, "message": "Developer 1 user repository integration is required."})

@router.get("/users/{user_id}", response_model=ResponseEnvelope)
def user(user_id: int, current_user=Depends(require_admin)):
    return envelope("User record unavailable", {"available": False, "user_id": user_id})

@router.put("/users/{user_id}/status", response_model=ResponseEnvelope)
def user_status(user_id: int, current_user=Depends(require_admin)):
    return envelope("User status unavailable", {"available": False, "user_id": user_id})
