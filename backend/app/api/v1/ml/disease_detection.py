from typing import Optional
from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.response import success_response
from app.services.ml.disease_service import DiseaseService
from app.repositories.ml.ml_repo import MLRepository

router = APIRouter(prefix="/ml", tags=["ML – Disease Detection"])


@router.post("/disease-detection")
async def disease_detection(
    image: UploadFile = File(...),
    crop_id: Optional[str] = Form(None),
    field_id: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = await DiseaseService(db).detect(current_user.id, image, crop_id, field_id)
    return success_response(data=result, message="Disease detection completed")


@router.get("/disease-detection/history")
def disease_history(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    preds = MLRepository(db).get_disease_predictions_by_user(current_user.id)
    data = [
        {
            "id": p.id,
            "predicted_disease": p.predicted_disease,
            "confidence": p.confidence,
            "severity": p.severity,
            "crop_id": p.crop_id,
            "field_id": p.field_id,
            "created_at": p.created_at.isoformat(),
        }
        for p in preds
    ]
    return success_response(data=data, message="History retrieved")
