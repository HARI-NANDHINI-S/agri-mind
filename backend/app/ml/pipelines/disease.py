"""Disease detection inference pipeline."""
from __future__ import annotations

import io
import numpy as np
from PIL import Image
from typing import Tuple

from app.ml.model_loader import model_loader

_IMG_SIZE = (224, 224)
_EXPECTED_CLASSES = [
    "healthy",
    "early_blight",
    "late_blight",
    "leaf_mold",
    "bacterial_spot",
    "mosaic_virus",
]

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

    if model is None or classes is None:
        load_error = model_loader.load_error("disease_detection")
        detail = f"Disease detection model unavailable{': ' + load_error if load_error else ''}"
        raise RuntimeError(detail)
    if list(classes) != _EXPECTED_CLASSES:
        raise RuntimeError("Disease class artifact does not match the trained model class order")

    arr = preprocess_image(image_bytes)
    preds = model.predict(arr, verbose=0)[0]
    idx = int(np.argmax(preds))
    confidence = float(preds[idx])
    disease = classes[idx]

    disease_key = disease.lower().replace(" ", "_")
    severity = _SEVERITY_MAP.get(disease_key, "Unknown")
    recommendations = _RECOMMENDATIONS_MAP.get(disease_key, "Consult an agronomist for diagnosis.")
    return disease, confidence, severity, recommendations
