from sqlalchemy.orm import Session
from app.ml.pipelines.recommendation import predict_crop_recommendation
from app.ml.model_loader import model_loader
from app.repositories.ml.ml_repo import MLRepository
from app.schemas.ml.crop_recommendation import CropRecommendationRequest, CropRecommendationResponse


class RecommendationService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = MLRepository(db)

    def recommend(self, user_id: str, req: CropRecommendationRequest) -> CropRecommendationResponse:
        results = predict_crop_recommendation(
            nitrogen=req.nitrogen,
            phosphorus=req.phosphorus,
            potassium=req.potassium,
            temperature=req.temperature,
            humidity=req.humidity,
            ph=req.ph,
            rainfall=req.rainfall,
        )
        version = model_loader.version("crop_recommendation")
        record = self.repo.create_crop_recommendation(
            user_id=user_id,
            recommended_crops=results,
            nitrogen=str(req.nitrogen),
            phosphorus=str(req.phosphorus),
            potassium=str(req.potassium),
            temperature=str(req.temperature),
            humidity=str(req.humidity),
            ph=str(req.ph),
            rainfall=str(req.rainfall),
            model_version=version,
        )
        return CropRecommendationResponse(
            recommendations=results,
            model_version=version,
            prediction_id=record.id,
        )
