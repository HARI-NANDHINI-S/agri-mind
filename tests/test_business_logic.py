from datetime import date, timedelta
from decimal import Decimal
import pandas as pd
from app.ml.price_prediction.features import build_features
from app.services.finance_service import calculate_profitability, risk_level


def test_profitability_formula():
    revenue, profit, margin, break_even = calculate_profitability(10, 5, 20)
    assert revenue == Decimal("50")
    assert profit == Decimal("30")
    assert margin == Decimal("60.0")
    assert break_even == Decimal("2")


def test_risk_thresholds():
    assert risk_level(10) == "LOW"
    assert risk_level(50) == "MEDIUM"
    assert risk_level(90) == "HIGH"


def test_price_features_include_required_lags_and_calendar_fields():
    start = date(2026, 1, 1)
    rows = [{"date": start + timedelta(days=i), "crop": "tomato", "market": "central", "location": "x", "price": 10 + i * 0.1} for i in range(20)]
    features = build_features(pd.DataFrame(rows))
    assert len(features) == 6
    assert {"lag_1", "lag_7", "lag_14", "rolling_mean_7", "rolling_mean_14", "rolling_std_7", "month", "week", "day_of_year"}.issubset(features.columns)
