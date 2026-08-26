from datetime import date
from sqlalchemy.orm import Session
from app.models.market import MarketPrice
from app.schemas.modules import MarketPriceCreate


class MarketService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, crop=None, market=None, location=None, start_date=None, end_date=None, skip=0, limit=50):
        query = self.db.query(MarketPrice)
        if crop: query = query.filter(MarketPrice.crop_name == crop)
        if market: query = query.filter(MarketPrice.market_name == market)
        if location: query = query.filter(MarketPrice.location == location)
        if start_date: query = query.filter(MarketPrice.price_date >= start_date)
        if end_date: query = query.filter(MarketPrice.price_date <= end_date)
        total = query.count()
        return query.order_by(MarketPrice.price_date.desc()).offset(skip).limit(limit).all(), total

    def get(self, price_id):
        return self.db.query(MarketPrice).filter(MarketPrice.id == price_id).first()

    def latest(self, crop, market):
        return self.db.query(MarketPrice).filter(MarketPrice.crop_name == crop, MarketPrice.market_name == market).order_by(MarketPrice.price_date.desc()).first()

    def history(self, crop, market, start_date=None, end_date=None):
        return self.list(crop, market, start_date=start_date, end_date=end_date, skip=0, limit=1000)[0]

    def compare(self, crop, market_names):
        return [self.latest(crop, market) for market in market_names if self.latest(crop, market)]
