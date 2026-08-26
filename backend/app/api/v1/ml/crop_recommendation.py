from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.ml.crop_recommendation import CropRecommendationRequest
from app.schemas.response import success_response
from app.services.ml.recommendation_service import RecommendationService

router = APIRouter(prefix="/ml", tags=["ML – Crop Recommendation"])


@router.post("/crop-recommendation")
def crop_recommendation(
    body: CropRecommendationRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = RecommendationService(db).recommend(current_user.id, body)
    return success_response(data=result, message="Crop recommendation generated")
