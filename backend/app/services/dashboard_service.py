"""
Dashboard service – aggregates data from all modules to power
the farmer dashboard with real DB-backed insights.
"""
from datetime import date, timedelta
from typing import List
from sqlalchemy.orm import Session
from app.repositories.farm_repo import FarmRepository
from app.repositories.field_repo import FieldRepository
from app.repositories.crop_repo import CropRepository
from app.repositories.ml.ml_repo import MLRepository
from app.models.crop import CropStage, CropStatus


class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.farm_repo = FarmRepository(db)
        self.field_repo = FieldRepository(db)
        self.crop_repo = CropRepository(db)
        self.ml_repo = MLRepository(db)

    def get_overview(self, user_id: str) -> dict:
        farms = self.farm_repo.get_by_owner(user_id)
        farm_ids = [f.id for f in farms]
        field_ids = [field.id for f in farms for field in f.fields]

        active_crops = self.crop_repo.get_active_by_user_fields(field_ids)
        all_crops = self.crop_repo.get_all_by_user_fields(field_ids)

        disease_preds = self.ml_repo.get_disease_predictions_by_user(user_id, limit=5)
        yield_preds = self.ml_repo.get_yield_predictions_by_user(user_id, limit=5)
        recommendations = self.ml_repo.get_recommendations_by_user(user_id, limit=5)

        # Insights generation
        insights = self._generate_insights(active_crops, disease_preds, yield_preds)

        # Yield trends for chart
        yield_trend = [
            {
                "prediction_id": p.id,
                "crop_id": p.crop_id,
                "predicted_yield": p.predicted_yield,
                "yield_unit": p.yield_unit,
                "created_at": p.created_at.isoformat(),
            }
            for p in yield_preds
        ]

        # Crop distribution for pie chart
        stage_counts: dict[str, int] = {}
        for c in active_crops:
            stage_counts[c.stage] = stage_counts.get(c.stage, 0) + 1

        # Recent disease alerts
        disease_alerts = [
            {
                "id": d.id,
                "predicted_disease": d.predicted_disease,
                "confidence": d.confidence,
                "severity": d.severity,
                "crop_id": d.crop_id,
                "created_at": d.created_at.isoformat(),
            }
            for d in disease_preds
            if d.predicted_disease.lower() != "healthy"
        ]

        # Harvest approaching (within 14 days)
        today = date.today()
        harvest_soon = [
            {
                "id": c.id,
                "name": c.name,
                "expected_harvest_date": c.expected_harvest_date.isoformat() if c.expected_harvest_date else None,
                "days_remaining": (c.expected_harvest_date - today).days if c.expected_harvest_date else None,
            }
            for c in active_crops
            if c.expected_harvest_date and 0 <= (c.expected_harvest_date - today).days <= 14
        ]

        return {
            "summary": {
                "total_farms": len(farms),
                "total_fields": len(field_ids),
                "active_crops": len(active_crops),
                "total_crops": len(all_crops),
                "disease_alerts": len(disease_alerts),
            },
            "crop_stage_distribution": stage_counts,
            "yield_trend": yield_trend,
            "recent_disease_alerts": disease_alerts,
            "harvest_soon": harvest_soon,
            "recent_recommendations": [
                {
                    "id": r.id,
                    "recommended_crops": r.recommended_crops,
                    "created_at": r.created_at.isoformat(),
                }
                for r in recommendations
            ],
            "insights": insights,
        }

    def _generate_insights(self, active_crops, disease_preds, yield_preds) -> List[str]:
        insights = []

        # Disease insights
        recent_diseases = [d for d in disease_preds if d.predicted_disease.lower() != "healthy"]
        if recent_diseases:
            d = recent_diseases[0]
            insights.append(
                f"⚠️ A recent scan detected '{d.predicted_disease}' with {d.confidence:.0%} confidence. Monitor closely."
            )

        # Harvest approaching
        today = date.today()
        for c in active_crops:
            if c.expected_harvest_date:
                days = (c.expected_harvest_date - today).days
                if 0 <= days <= 7:
                    insights.append(f"🌾 Your {c.name} crop is due for harvest in {days} day(s).")
                elif 8 <= days <= 14:
                    insights.append(f"📅 Your {c.name} crop is approaching its harvest date in {days} days.")

        # Yield insights
        if yield_preds:
            avg = sum(p.predicted_yield for p in yield_preds) / len(yield_preds)
            insights.append(f"📊 Your average predicted yield across recent analyses is {avg:.2f} tonnes/hectare.")

        if not insights:
            insights.append("✅ Everything looks good! Keep monitoring your crops regularly.")

        return insights
