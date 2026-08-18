import uuid
from sqlalchemy import Column, String, Float, ForeignKey, JSON, Index, Text
from app.database.base import Base, TimestampMixin


class ProfitabilityRiskAnalysis(Base, TimestampMixin):
    __tablename__ = "profitability_risk_analyses"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    crop_id = Column(String(36), ForeignKey("crops.id", ondelete="SET NULL"), nullable=True)
    crop_name = Column(String(255), nullable=False)
    
    # Financial projections
    estimated_cost = Column(Float, nullable=False)
    projected_revenue = Column(Float, nullable=False)
    projected_profit = Column(Float, nullable=False)
    expected_roi_percent = Column(Float, nullable=False)
    
    # Risk metrics
    overall_risk_score = Column(String(20), nullable=False, comment="LOW, MEDIUM, HIGH")
    disease_risk_factor = Column(Float, nullable=True)
    market_price_volatility = Column(Float, nullable=True)
    weather_risk_factor = Column(Float, nullable=True)
    
    # AI recommendations snapshot (stored as JSON)
    risk_breakdown = Column(JSON, nullable=True)
    recommendations = Column(Text, nullable=True)
    model_version = Column(String(50), nullable=True)

    __table_args__ = (
        Index("idx_prof_risk_user", "user_id"),
        Index("idx_prof_risk_crop", "crop_id"),
    )
