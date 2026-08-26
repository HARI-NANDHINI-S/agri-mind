from typing import List, Optional
from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.repositories.market_repo import MarketRepository
from app.schemas.market import MarketPriceResponse, MarketPriceCreate, PriceTrendPoint


class MarketService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = MarketRepository(db)

    def get_prices(self, crop_name: Optional[str] = None, location: Optional[str] = None) -> List[MarketPriceResponse]:
        if crop_name or location:
            prices = self.repo.search_prices(crop_name, location)
        else:
            prices = self.repo.get_latest_prices()

        # Seed initial dummy data if market prices table is empty
        if not prices and not crop_name and not location:
            self._seed_default_market_prices()
            prices = self.repo.get_latest_prices()

        return [MarketPriceResponse.model_validate(p) for p in prices]

    def get_price_trends(self, crop_name: str) -> List[PriceTrendPoint]:
        prices = self.repo.get_price_trends(crop_name)
        if not prices:
            # Generate synthetic history points for trends if no records found
            today = date.today()
            base = 2200.0
            return [
                PriceTrendPoint(
                    date=today - timedelta(days=i * 5),
                    modal_price=round(base + (i % 3) * 40 - i * 10, 2),
                    min_price=round(base - 100, 2),
                    max_price=round(base + 150, 2),
                )
                for i in range(6)
            ]
        return [
            PriceTrendPoint(
                date=p.date,
                modal_price=p.modal_price,
                min_price=p.min_price,
                max_price=p.max_price,
            )
            for p in prices
        ]

    def create_price(self, data: MarketPriceCreate) -> MarketPriceResponse:
        p = self.repo.create_market_price(**data.model_dump())
        return MarketPriceResponse.model_validate(p)

    def _seed_default_market_prices(self):
        today = date.today()
        seeds = [
            {"crop_name": "Wheat", "market_name": "Karnal Mandi", "location": "Karnal", "state": "Haryana", "modal_price": 2275.0, "min_price": 2150.0, "max_price": 2350.0, "date": today},
            {"crop_name": "Rice", "market_name": "Punjab Grain Market", "location": "Ludhiana", "state": "Punjab", "modal_price": 2183.0, "min_price": 2050.0, "max_price": 2250.0, "date": today},
            {"crop_name": "Cotton", "market_name": "Rajkot Mandi", "location": "Rajkot", "state": "Gujarat", "modal_price": 6620.0, "min_price": 6400.0, "max_price": 6800.0, "date": today},
            {"crop_name": "Maize", "market_name": "Davangere Market", "location": "Davangere", "state": "Karnataka", "modal_price": 2090.0, "min_price": 1950.0, "max_price": 2180.0, "date": today},
            {"crop_name": "Tomato", "market_name": "Azadpur Mandi", "location": "Delhi", "state": "Delhi", "modal_price": 1800.0, "min_price": 1500.0, "max_price": 2100.0, "date": today},
        ]
        for s in seeds:
            self.repo.create_market_price(**s)
