from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.ml.yield_prediction import YieldPredictionRequest
from app.schemas.response import success_response
from app.services.ml.yield_service import YieldService
from app.repositories.ml.ml_repo import MLRepository

router = APIRouter(prefix="/ml", tags=["ML – Yield Prediction"])


@router.post("/yield-prediction")
def yield_prediction(
    body: YieldPredictionRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = YieldService(db).predict(current_user.id, body)
    return success_response(data=result, message="Yield prediction completed")


@router.get("/yield-prediction/history")
def yield_history(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    preds = MLRepository(db).get_yield_predictions_by_user(current_user.id)
    data = [
        {
            "id": p.id,
            "predicted_yield": p.predicted_yield,
            "yield_unit": p.yield_unit,
            "confidence_lower": p.confidence_lower,
            "confidence_upper": p.confidence_upper,
            "crop_id": p.crop_id,
            "created_at": p.created_at.isoformat(),
        }
        for p in preds
    ]
    return success_response(data=data, message="History retrieved")
