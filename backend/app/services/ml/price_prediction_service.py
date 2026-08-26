from sqlalchemy.orm import Session
from app.ml.pipelines.price_prediction import predict_market_price
from app.ml.model_loader import model_loader
from app.repositories.market_repo import MarketRepository
from app.schemas.ml.price_prediction import PricePredictionRequest, PricePredictionResponse


class PricePredictionService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = MarketRepository(db)

    def predict(self, user_id: str, req: PricePredictionRequest) -> PricePredictionResponse:
        pred, lower, upper, trend = predict_market_price(
            crop_name=req.crop_name,
            target_month=req.target_month,
            market_name=req.market_name,
            location=req.location,
        )
        version = model_loader.version("price_prediction")

        record = self.repo.create_price_prediction(
            user_id=user_id,
            crop_name=req.crop_name,
            market_name=req.market_name,
            location=req.location,
            target_month=req.target_month,
            predicted_price=pred,
            unit="₹/quintal",
            confidence_lower=lower,
            confidence_upper=upper,
            trend_direction=trend,
            model_version=version,
        )

        return PricePredictionResponse(
            prediction_id=record.id,
            crop_name=req.crop_name,
            market_name=req.market_name,
            location=req.location,
            target_month=req.target_month,
            predicted_price=pred,
            unit="₹/quintal",
            confidence_lower=lower,
            confidence_upper=upper,
            trend_direction=trend,
            model_version=version,
        )
