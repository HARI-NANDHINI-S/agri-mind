from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.schemas.modules import PredictionRequest, ResponseEnvelope
from app.services.prediction_service import PredictionService

router = APIRouter()

@router.post("/price-prediction", response_model=ResponseEnvelope)
def predict(payload: PredictionRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    result = PredictionService(db, int(current_user["user_id"])).predict(payload.crop, payload.market, payload.prediction_horizon)
    if not result: raise HTTPException(404, "Insufficient market history for this crop and market")
    prices = result.predicted_prices
    predicted_price = prices[-1]
    trend = "stable" if len(prices) < 2 or prices[-1] == prices[0] else ("increasing" if prices[-1] > prices[0] else "decreasing")
    return {"success": True, "message": "Price prediction generated", "data": {"crop": result.crop, "market": result.market, "predicted_price": predicted_price, "predicted_prices": prices, "unit": result.unit, "prediction_date": result.prediction_date, "trend": trend, "model_version": result.model_version, "disclaimer": "This is an estimate, not a guaranteed outcome."}}
