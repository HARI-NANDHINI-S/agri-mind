from datetime import date
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.market import MarketPrice
from app.schemas.modules import MarketPriceRead, ResponseEnvelope
from app.services.market_service import MarketService

router = APIRouter()


def envelope(message, data): return {"success": True, "message": message, "data": data}


@router.get("/prices", response_model=ResponseEnvelope)
def list_prices(crop: Optional[str] = None, market: Optional[str] = None, location: Optional[str] = None, start_date: Optional[date] = None, end_date: Optional[date] = None, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db)):
    items, total = MarketService(db).list(crop, market, location, start_date, end_date, skip, limit)
    return envelope("Market prices retrieved", {"items": [MarketPriceRead.model_validate(item) for item in items], "total": total, "skip": skip, "limit": limit})


@router.get("/prices/{price_id}", response_model=ResponseEnvelope)
def get_price(price_id: int, db: Session = Depends(get_db)):
    item = MarketService(db).get(price_id)
    if not item: raise HTTPException(404, "Market price not found")
    return envelope("Market price retrieved", MarketPriceRead.model_validate(item))


@router.get("/history", response_model=ResponseEnvelope)
def history(crop: str, market: str, start_date: Optional[date] = None, end_date: Optional[date] = None, db: Session = Depends(get_db)):
    items = MarketService(db).history(crop, market, start_date, end_date)
    return envelope("Market history retrieved", [MarketPriceRead.model_validate(item) for item in items])


@router.get("/compare", response_model=ResponseEnvelope)
def compare(crop: str, markets: str, db: Session = Depends(get_db)):
    items = MarketService(db).compare(crop, [name.strip() for name in markets.split(",") if name.strip()])
    return envelope("Market comparison retrieved", [MarketPriceRead.model_validate(item) for item in items])


@router.get("/summary", response_model=ResponseEnvelope)
def summary(db: Session = Depends(get_db)):
    rows = db.query(MarketPrice.crop_name, MarketPrice.market_name, MarketPrice.price, MarketPrice.price_date).order_by(MarketPrice.price_date.desc()).limit(100).all()
    return envelope("Market summary retrieved", [{"crop": r[0], "market": r[1], "price": r[2], "price_date": r[3]} for r in rows])
