import uuid
from sqlalchemy import Column, String, Float, Date, Index
from app.database.base import Base, TimestampMixin


class MarketPrice(Base, TimestampMixin):
    __tablename__ = "market_prices"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    crop_name = Column(String(255), nullable=False)
    market_name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    state = Column(String(100), nullable=True)
    modal_price = Column(Float, nullable=False, comment="Average price per quintal/tonne")
    min_price = Column(Float, nullable=False)
    max_price = Column(Float, nullable=False)
    unit = Column(String(50), nullable=False, default="₹/quintal")
    date = Column(Date, nullable=False)

    __table_args__ = (
        Index("idx_market_price_crop_date", "crop_name", "date"),
        Index("idx_market_price_location", "location"),
    )
