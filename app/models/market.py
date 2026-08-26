from datetime import date, datetime
from decimal import Decimal
from sqlalchemy import Boolean, Column, Date, DateTime, Integer, JSON, Numeric, String, Text, func
from app.database.base import Base


class MarketPrice(Base):
    __tablename__ = "market_prices"
    id = Column(Integer, primary_key=True)
    crop_name = Column(String(255), nullable=False, index=True)
    market_name = Column(String(255), nullable=False, index=True)
    location = Column(String(255), nullable=True, index=True)
    price = Column(Numeric(12, 4), nullable=False)
    unit = Column(String(64), nullable=True)
    price_date = Column(Date, nullable=False, index=True)
    source = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)


class PricePrediction(Base):
    __tablename__ = "price_predictions"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=True, index=True)
    crop = Column(String(255), nullable=False, index=True)
    market = Column(String(255), nullable=False, index=True)
    prediction_date = Column(DateTime, nullable=False)
    horizon = Column(Integer, nullable=False)
    predicted_prices = Column(JSON, nullable=False)
    unit = Column(String(64), nullable=True)
    model_version = Column(String(128), nullable=True)
    metadata_json = Column("metadata", JSON, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class ModelRegistry(Base):
    __tablename__ = "model_registry"
    id = Column(Integer, primary_key=True)
    model_name = Column(String(255), nullable=False)
    model_type = Column(String(64), nullable=False)
    version = Column(String(64), nullable=False)
    dataset_name = Column(String(255), nullable=True)
    dataset_size = Column(Integer, nullable=True)
    metric_name = Column(String(64), nullable=True)
    metric_value = Column(Numeric(12, 6), nullable=True)
    training_date = Column(DateTime, nullable=True)
    status = Column(String(64), nullable=True)
    model_path = Column(String(1024), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
