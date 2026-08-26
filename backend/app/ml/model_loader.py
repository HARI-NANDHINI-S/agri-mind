"""
ModelLoader – singleton that loads ML models once on startup.

For models that don't yet have trained artefacts on disk the loader
gracefully falls back to a rule-based stub so the API remains functional
even before training is run.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

import joblib

from app.core.config import settings


class ModelLoader:
    _instance: "ModelLoader | None" = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        if self._initialized:
            return
        self._initialized = True
        self._models: dict[str, Any] = {}
        self._versions: dict[str, str] = {}
        self._model_dir = Path(settings.ML_MODELS_DIR)
        self._load_all()

    # ── Internal helpers ────────────────────────────────────────────────────

    def _load_joblib(self, name: str, filename: str) -> bool:
        path = self._model_dir / filename
        if path.exists():
            self._models[name] = joblib.load(path)
            # try to read version manifest
            ver_path = self._model_dir / f"{name}_version.json"
            if ver_path.exists():
                with open(ver_path) as f:
                    self._versions[name] = json.load(f).get("version", "1.0.0")
            else:
                self._versions[name] = "1.0.0"
            return True
        return False

    def _load_keras(self, name: str, filename: str) -> bool:
        path = self._model_dir / filename
        if path.exists():
            try:
                import tensorflow as tf  # noqa: PLC0415
                self._models[name] = tf.keras.models.load_model(str(path))
                ver_path = self._model_dir / f"{name}_version.json"
                if ver_path.exists():
                    with open(ver_path) as f:
                        self._versions[name] = json.load(f).get("version", "1.0.0")
                else:
                    self._versions[name] = "1.0.0"
                return True
            except (ImportError, Exception):
                return False
        return False

    def _load_all(self):
        self._load_joblib("crop_recommendation", "crop_recommendation.pkl")
        self._load_joblib("crop_label_encoder", "crop_label_encoder.pkl")
        self._load_keras("disease_detection", "disease_detection.h5")
        self._load_joblib("disease_classes", "disease_classes.pkl")
        self._load_joblib("yield_prediction", "yield_prediction.pkl")
        self._load_joblib("yield_crop_encoder", "yield_crop_encoder.pkl")
        self._load_joblib("price_prediction", "price_prediction.pkl")
        self._load_joblib("price_crop_encoder", "price_crop_encoder.pkl")

    # ── Public accessors ────────────────────────────────────────────────────

    def get(self, name: str) -> Any | None:
        return self._models.get(name)

    def version(self, name: str) -> str:
        return self._versions.get(name, "stub-1.0")

    def is_loaded(self, name: str) -> bool:
        return name in self._models


# Singleton instance – imported by services
model_loader = ModelLoader()
