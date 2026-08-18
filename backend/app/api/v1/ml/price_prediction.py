from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.ml.price_prediction import PricePredictionRequest
from app.schemas.response import success_response
from app.services.ml.price_prediction_service import PricePredictionService

router = APIRouter(prefix="/ml", tags=["ML – Price Prediction"])


@router.post("/price-prediction")
def price_prediction(
    body: PricePredictionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = PricePredictionService(db).predict(current_user.id, body)
    return success_response(data=result, message="Price prediction completed")
