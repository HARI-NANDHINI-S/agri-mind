from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.disease_prediction import DiseasePrediction
from app.models.yield_prediction import YieldPrediction
from app.models.crop_recommendation import CropRecommendation


class MLRepository:
    def __init__(self, db: Session):
        self.db = db

    # ── Disease predictions ─────────────────────────────────────────────────
    def create_disease_prediction(self, **kwargs) -> DiseasePrediction:
        pred = DiseasePrediction(**kwargs)
        self.db.add(pred)
        self.db.commit()
        self.db.refresh(pred)
        return pred

    def get_disease_predictions_by_user(self, user_id: str, limit: int = 20) -> List[DiseasePrediction]:
        return (
            self.db.query(DiseasePrediction)
            .filter(DiseasePrediction.user_id == user_id)
            .order_by(DiseasePrediction.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_disease_predictions_by_crop(self, crop_id: str) -> List[DiseasePrediction]:
        return (
            self.db.query(DiseasePrediction)
            .filter(DiseasePrediction.crop_id == crop_id)
            .order_by(DiseasePrediction.created_at.desc())
            .all()
        )

    # ── Yield predictions ───────────────────────────────────────────────────
    def create_yield_prediction(self, **kwargs) -> YieldPrediction:
        pred = YieldPrediction(**kwargs)
        self.db.add(pred)
        self.db.commit()
        self.db.refresh(pred)
        return pred

    def get_yield_predictions_by_user(self, user_id: str, limit: int = 20) -> List[YieldPrediction]:
        return (
            self.db.query(YieldPrediction)
            .filter(YieldPrediction.user_id == user_id)
            .order_by(YieldPrediction.created_at.desc())
            .limit(limit)
            .all()
        )

    # ── Crop recommendations ────────────────────────────────────────────────
    def create_crop_recommendation(self, **kwargs) -> CropRecommendation:
        rec = CropRecommendation(**kwargs)
        self.db.add(rec)
        self.db.commit()
        self.db.refresh(rec)
        return rec

    def get_recommendations_by_user(self, user_id: str, limit: int = 10) -> List[CropRecommendation]:
        return (
            self.db.query(CropRecommendation)
            .filter(CropRecommendation.user_id == user_id)
            .order_by(CropRecommendation.created_at.desc())
            .limit(limit)
            .all()
        )
