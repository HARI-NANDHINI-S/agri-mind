from sqlalchemy.orm import Session
from app.ml.pipelines.profitability_risk import analyze_profitability_and_risk
from app.ml.model_loader import model_loader
from app.models.profitability_risk import ProfitabilityRiskAnalysis
from app.schemas.ml.profitability_risk import ProfitabilityRiskRequest, ProfitabilityRiskResponse


class ProfitabilityService:
    def __init__(self, db: Session):
        self.db = db

    def analyze(self, user_id: str, req: ProfitabilityRiskRequest) -> ProfitabilityRiskResponse:
        (
            rev, profit, roi, risk_score,
            disease_risk, price_vol, weather_risk,
            breakdown, recs
        ) = analyze_profitability_and_risk(
            crop_name=req.crop_name,
            area=req.area,
            estimated_cost=req.estimated_cost,
            expected_yield_per_ha=req.expected_yield_per_ha,
            expected_market_price=req.expected_market_price,
        )

        version = model_loader.version("yield_prediction")

        record = ProfitabilityRiskAnalysis(
            user_id=user_id,
            crop_id=req.crop_id,
            crop_name=req.crop_name,
            estimated_cost=req.estimated_cost,
            projected_revenue=rev,
            projected_profit=profit,
            expected_roi_percent=roi,
            overall_risk_score=risk_score,
            disease_risk_factor=disease_risk,
            market_price_volatility=price_vol,
            weather_risk_factor=weather_risk,
            risk_breakdown=breakdown,
            recommendations=recs,
            model_version=version,
        )

        self.db.add(record)
        self.db.commit()
        self.db.refresh(record)

        return ProfitabilityRiskResponse(
            analysis_id=record.id,
            crop_name=req.crop_name,
            estimated_cost=req.estimated_cost,
            projected_revenue=rev,
            projected_profit=profit,
            expected_roi_percent=roi,
            overall_risk_score=risk_score,
            disease_risk_factor=disease_risk,
            market_price_volatility=price_vol,
            weather_risk_factor=weather_risk,
            risk_breakdown=breakdown,
            recommendations=recs,
            model_version=version,
        )
