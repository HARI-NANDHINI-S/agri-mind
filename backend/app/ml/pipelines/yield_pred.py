"""
Yield prediction inference pipeline.

Uses a trained regression model when available; falls back to a
data-driven heuristic so the API returns meaningful estimates.
"""
from __future__ import annotations

import numpy as np
from typing import Tuple, Optional

from app.ml.model_loader import model_loader

# Average baseline yields by crop (tonnes/hectare) used in fallback
_BASELINE_YIELDS: dict[str, float] = {
    "rice": 4.5, "wheat": 3.2, "maize": 5.8, "sugarcane": 70.0,
    "cotton": 1.8, "jute": 2.5, "coffee": 0.8, "coconut": 6.0,
    "mango": 8.0, "banana": 25.0, "grapes": 12.0, "apple": 20.0,
    "chickpea": 1.2, "lentil": 1.0, "mungbean": 0.9,
}


def predict_yield(
    crop_name: str,
    area: float,
    nitrogen: Optional[float] = None,
    phosphorus: Optional[float] = None,
    potassium: Optional[float] = None,
    rainfall: Optional[float] = None,
    temperature: Optional[float] = None,
    humidity: Optional[float] = None,
    season: Optional[str] = None,
) -> Tuple[float, float, float]:
    """
    Returns (predicted_yield_per_ha, lower_95, upper_95).
    Yield is in tonnes/hectare.
    """
    model = model_loader.get("yield_prediction")
    crop_encoder = model_loader.get("yield_crop_encoder")

    n = nitrogen or 30.0
    p = phosphorus or 30.0
    k = potassium or 30.0
    rain = rainfall or 100.0
    temp = temperature or 25.0
    hum = humidity or 60.0
    season_map = {"kharif": 0, "rabi": 1, "zaid": 2, "whole year": 3}
    season_enc = season_map.get((season or "").lower(), 0)

    if model is not None and crop_encoder is not None:
        try:
            crop_enc = int(crop_encoder.transform([crop_name.lower()])[0])
        except Exception:
            crop_enc = 0
        features = np.array([[crop_enc, area, n, p, k, rain, temp, hum, season_enc]])
        pred = float(model.predict(features)[0])
        margin = pred * 0.15  # ±15% confidence interval
        return round(pred, 3), round(max(pred - margin, 0), 3), round(pred + margin, 3)

    # ── Heuristic fallback ───────────────────────────────────────────────────
    base = _BASELINE_YIELDS.get(crop_name.lower(), 3.0)
    modifier = 1.0
    if rain and rain > 200:
        modifier += 0.05
    if n and n > 40:
        modifier += 0.05
    if temp and 20 <= temp <= 30:
        modifier += 0.05
    pred = round(base * modifier, 3)
    margin = pred * 0.15
    return pred, round(max(pred - margin, 0), 3), round(pred + margin, 3)
