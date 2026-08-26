from sqlalchemy.orm import Session
from app.ml.pipelines.yield_pred import predict_yield
from app.ml.model_loader import model_loader
from app.repositories.ml.ml_repo import MLRepository
from app.schemas.ml.yield_prediction import YieldPredictionRequest, YieldPredictionResponse


class YieldService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = MLRepository(db)

    def predict(self, user_id: str, req: YieldPredictionRequest) -> YieldPredictionResponse:
        pred, lower, upper = predict_yield(
            crop_name=req.crop_name,
            area=req.area,
            nitrogen=req.nitrogen,
            phosphorus=req.phosphorus,
            potassium=req.potassium,
            rainfall=req.rainfall,
            temperature=req.temperature,
            humidity=req.humidity,
            season=req.season,
        )
        version = model_loader.version("yield_prediction")
        record = self.repo.create_yield_prediction(
            user_id=user_id,
            crop_id=req.crop_id,
            field_id=req.field_id,
            predicted_yield=pred,
            yield_unit="tonnes/hectare",
            confidence_lower=lower,
            confidence_upper=upper,
            model_version=version,
            area=req.area,
            rainfall=req.rainfall,
            temperature=req.temperature,
            humidity=req.humidity,
            season=req.season,
        )
        return YieldPredictionResponse(
            prediction_id=record.id,
            predicted_yield=pred,
            yield_unit="tonnes/hectare",
            confidence_lower=lower,
            confidence_upper=upper,
            model_version=version,
        )
