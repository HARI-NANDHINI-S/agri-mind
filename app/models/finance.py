from sqlalchemy import Column, DateTime, Float, Integer, Numeric, String, Text, func
from app.database.base import Base


class ProfitabilityRecord(Base):
    __tablename__ = "profitability_records"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    farm_id = Column(Integer, nullable=True, index=True)
    field_id = Column(Integer, nullable=True, index=True)
    crop_id = Column(Integer, nullable=True, index=True)
    predicted_yield = Column(Numeric(12, 4), nullable=False)
    expected_price = Column(Numeric(12, 4), nullable=False)
    total_cost = Column(Numeric(12, 4), nullable=False)
    expected_revenue = Column(Numeric(12, 4), nullable=False)
    expected_profit = Column(Numeric(12, 4), nullable=False)
    profit_margin = Column(Numeric(8, 4), nullable=True)
    break_even_price = Column(Numeric(12, 4), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)


class RiskAssessment(Base):
    __tablename__ = "risk_assessments"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False, index=True)
    farm_id = Column(Integer, nullable=True, index=True)
    field_id = Column(Integer, nullable=True, index=True)
    crop_id = Column(Integer, nullable=True, index=True)
    disease_risk = Column(String(32), nullable=False)
    yield_risk = Column(String(32), nullable=False)
    market_risk = Column(String(32), nullable=False)
    financial_risk = Column(String(32), nullable=False)
    overall_risk = Column(String(32), nullable=False)
    risk_score = Column(Float, nullable=False)
    explanation = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
