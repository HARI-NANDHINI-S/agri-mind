"""
Disease detection inference pipeline.

When the Keras model is loaded it runs a real forward pass.
When absent it falls back to a lightweight rule based stub.
"""
from __future__ import annotations

import io
import numpy as np
from PIL import Image
from typing import Tuple

from app.ml.model_loader import model_loader

_IMG_SIZE = (224, 224)

_SEVERITY_MAP = {
    "healthy": None,
    "early_blight": "Low",
    "late_blight": "High",
    "leaf_mold": "Medium",
    "bacterial_spot": "Medium",
    "mosaic_virus": "High",
}

_RECOMMENDATIONS_MAP = {
    "healthy": "Your plant appears healthy. Continue regular monitoring.",
    "early_blight": "Remove affected leaves. Apply copper-based fungicide if symptoms spread.",
    "late_blight": "Destroy infected plants. Improve drainage and air circulation.",
    "leaf_mold": "Reduce humidity. Ensure proper ventilation.",
    "bacterial_spot": "Avoid overhead watering. Remove infected plant debris.",
    "mosaic_virus": "Control aphid vectors. Remove and destroy infected plants.",
}


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB").resize(_IMG_SIZE)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


def predict_disease(image_bytes: bytes) -> Tuple[str, float, str | None, str]:
    """
    Returns (disease_name, confidence, severity, recommendations).
    """
    model = model_loader.get("disease_detection")
    classes = model_loader.get("disease_classes")

    if model is not None and classes is not None:
        arr = preprocess_image(image_bytes)
        preds = model.predict(arr)[0]
        idx = int(np.argmax(preds))
        confidence = float(preds[idx])
        disease = classes[idx]
    else:
        # Stub: analyse image brightness as proxy
        arr_raw = preprocess_image(image_bytes)[0]
        brightness = float(arr_raw.mean())
        if brightness > 0.55:
            disease, confidence = "healthy", 0.87
        elif brightness > 0.40:
            disease, confidence = "early_blight", 0.74
        else:
            disease, confidence = "late_blight", 0.68

    disease_key = disease.lower().replace(" ", "_")
    severity = _SEVERITY_MAP.get(disease_key, "Unknown")
    recommendations = _RECOMMENDATIONS_MAP.get(disease_key, "Consult an agronomist for diagnosis.")
    return disease, confidence, severity, recommendations
