from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.market_price import MarketPrice
from app.models.price_prediction import PricePrediction
from datetime import date


class MarketRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_latest_prices(self, limit: int = 50) -> List[MarketPrice]:
        return (
            self.db.query(MarketPrice)
            .order_by(MarketPrice.date.desc())
            .limit(limit)
            .all()
        )

    def search_prices(
        self,
        crop_name: Optional[str] = None,
        location: Optional[str] = None,
        limit: int = 50,
    ) -> List[MarketPrice]:
        query = self.db.query(MarketPrice)
        if crop_name:
            query = query.filter(MarketPrice.crop_name.ilike(f"%{crop_name}%"))
        if location:
            query = query.filter(MarketPrice.location.ilike(f"%{location}%"))
        return query.order_by(MarketPrice.date.desc()).limit(limit).all()

    def get_price_trends(self, crop_name: str, days: int = 30) -> List[MarketPrice]:
        return (
            self.db.query(MarketPrice)
            .filter(MarketPrice.crop_name.ilike(crop_name))
            .order_by(MarketPrice.date.asc())
            .limit(days)
            .all()
        )

    def create_market_price(self, **kwargs) -> MarketPrice:
        mp = MarketPrice(**kwargs)
        self.db.add(mp)
        self.db.commit()
        self.db.refresh(mp)
        return mp

    def create_price_prediction(self, **kwargs) -> PricePrediction:
        pred = PricePrediction(**kwargs)
        self.db.add(pred)
        self.db.commit()
        self.db.refresh(pred)
        return pred

    def get_price_predictions_by_user(self, user_id: str, limit: int = 20) -> List[PricePrediction]:
        return (
            self.db.query(PricePrediction)
            .filter(PricePrediction.user_id == user_id)
            .order_by(PricePrediction.created_at.desc())
            .limit(limit)
            .all()
        )
