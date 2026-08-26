"""
Crop recommendation inference pipeline.

Falls back to a deterministic rule-based ranking when no trained model
artefact is present on disk, so the API always returns a valid response.
"""
from __future__ import annotations

import numpy as np
from typing import List

from app.ml.model_loader import model_loader


# Mapping from numeric class index → crop name (used when label encoder absent)
_FALLBACK_CROPS = [
    "rice", "maize", "chickpea", "kidneybeans", "pigeonpeas",
    "mothbeans", "mungbean", "blackgram", "lentil", "pomegranate",
    "banana", "mango", "grapes", "watermelon", "muskmelon",
    "apple", "orange", "papaya", "coconut", "cotton",
    "jute", "coffee",
]


def predict_crop_recommendation(
    nitrogen: float,
    phosphorus: float,
    potassium: float,
    temperature: float,
    humidity: float,
    ph: float,
    rainfall: float,
    top_n: int = 3,
) -> List[dict]:
    """Return top-N crop recommendations with probability scores."""
    features = np.array([[nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall]])

    model = model_loader.get("crop_recommendation")
    label_encoder = model_loader.get("crop_label_encoder")

    if model is not None:
        proba = model.predict_proba(features)[0]
        top_indices = np.argsort(proba)[::-1][:top_n]
        results = []
        for rank, idx in enumerate(top_indices, start=1):
            crop_name = (
                label_encoder.inverse_transform([idx])[0]
                if label_encoder is not None
                else _FALLBACK_CROPS[idx % len(_FALLBACK_CROPS)]
            )
            results.append({"crop": crop_name, "probability": round(float(proba[idx]), 4), "rank": rank})
        return results

    # ── Fallback: simple heuristic ranking ─────────────────────────────────
    return _heuristic_recommendation(nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall, top_n)


def _heuristic_recommendation(N, P, K, temp, hum, ph, rain, top_n) -> List[dict]:
    """Rule-based fallback when model is not trained yet."""
    scores: dict[str, float] = {}

    if 20 <= N <= 40 and 40 <= P <= 60 and 40 <= K <= 60 and 20 <= temp <= 27 and rain > 200:
        scores["rice"] = 0.90
    if rain < 100 and 60 <= K <= 80:
        scores["cotton"] = 0.82
    if 15 <= temp <= 25 and 40 <= P <= 80:
        scores["wheat"] = 0.78
    if rain > 150 and temp > 25:
        scores["maize"] = 0.75
    if 5.5 <= ph <= 7.0:
        scores["chickpea"] = 0.72
    if rain > 300 and temp > 25:
        scores["sugarcane"] = 0.70

    # pad with defaults
    for c in ["lentil", "mungbean", "blackgram"]:
        if c not in scores:
            scores[c] = 0.50

    ranked = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:top_n]
    return [{"crop": c, "probability": round(p, 4), "rank": i + 1} for i, (c, p) in enumerate(ranked)]
