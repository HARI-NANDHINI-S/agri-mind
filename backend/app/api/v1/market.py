from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.market import MarketPriceCreate
from app.schemas.response import success_response
from app.services.market_service import MarketService

router = APIRouter(prefix="/market", tags=["Market Intelligence"])


@router.get("/prices")
def get_prices(
    crop_name: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    data = MarketService(db).get_prices(crop_name, location)
    return success_response(data=data, message="Market prices retrieved")


@router.get("/trends")
def get_trends(
    crop_name: str = Query("Wheat"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    data = MarketService(db).get_price_trends(crop_name)
    return success_response(data=data, message="Price trends retrieved")


@router.post("/prices", status_code=201)
def create_price(
    body: MarketPriceCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    data = MarketService(db).create_price(body)
    return success_response(data=data, message="Market price record created")
