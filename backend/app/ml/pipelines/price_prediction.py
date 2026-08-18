"""
Price prediction inference pipeline for Module 10.
Predicts crop market prices per quintal using trained regressor or statistical heuristic.
"""
from __future__ import annotations
from typing import Tuple
from app.ml.model_loader import model_loader

_BASE_PRICE_MAP = {
    "wheat": 2275.0,
    "rice": 2183.0,
    "maize": 2090.0,
    "cotton": 6620.0,
    "sugarcane": 315.0,
    "chickpea": 5440.0,
    "tomato": 1800.0,
    "potato": 1400.0,
    "onion": 1600.0,
    "banana": 2500.0,
    "mango": 4500.0,
}


def predict_market_price(
    crop_name: str,
    target_month: str,
    market_name: str | None = None,
    location: str | None = None,
) -> Tuple[float, float, float, str]:
    """
    Returns (predicted_price, confidence_lower, confidence_upper, trend_direction).
    Price unit: ₹/quintal.
    """
    model = model_loader.get("price_prediction")
    crop_enc = model_loader.get("price_crop_encoder")

    base = _BASE_PRICE_MAP.get(crop_name.lower(), 2500.0)

    if model is not None and crop_enc is not None:
        try:
            c_val = int(crop_enc.transform([crop_name.lower()])[0])
            pred = float(model.predict([[c_val, 1, 1]])[0])
        except Exception:
            pred = base
    else:
        # Heuristic adjustment based on seasonality / target month
        month_lower = target_month.lower()
        multiplier = 1.0
        if "next" in month_lower or "october" in month_lower or "november" in month_lower:
            multiplier = 1.06
            trend = "UP"
        elif "january" in month_lower or "february" in month_lower:
            multiplier = 0.96
            trend = "DOWN"
        else:
            multiplier = 1.02
            trend = "STABLE"

        pred = round(base * multiplier, 2)

    lower = round(pred * 0.92, 2)
    upper = round(pred * 1.08, 2)
    trend = "UP" if pred > base else ("DOWN" if pred < base else "STABLE")

    return pred, lower, upper, trend
