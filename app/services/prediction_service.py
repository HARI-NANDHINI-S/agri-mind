from datetime import datetime, timedelta
from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.market import PricePrediction
from app.services.market_service import MarketService


class PredictionService:
    def __init__(self, db: Session, user_id: int): self.db, self.user_id, self.market = db, user_id, MarketService(db)

    def predict(self, crop, market, horizon):
        history = self.market.history(crop, market)
        if not history: return None
        values = [Decimal(str(row.price)) for row in history[:30]]
        latest = values[0]
        baseline = sum(values, Decimal("0")) / Decimal(len(values))
        trend = (latest - values[-1]) / Decimal(max(1, len(values) - 1)) if len(values) > 1 else Decimal("0")
        forecasts = [float(max(Decimal("0"), latest + trend * Decimal(day))) for day in range(1, horizon + 1)]
        item = PricePrediction(user_id=self.user_id, crop=crop, market=market, prediction_date=datetime.utcnow() + timedelta(days=horizon), horizon=horizon, predicted_prices=forecasts, unit=history[0].unit, model_version="baseline-v1", metadata_json={"method": "historical-trend", "baseline": float(baseline), "disclaimer": "Forecast is an estimate, not a guarantee."})
        self.db.add(item); self.db.commit(); self.db.refresh(item)
        return item
