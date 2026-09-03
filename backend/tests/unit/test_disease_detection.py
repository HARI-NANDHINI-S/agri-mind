import asyncio
import io

import joblib
import numpy as np
import pytest
from PIL import Image
from starlette.datastructures import Headers
from starlette.datastructures import UploadFile

from app.core.config import settings
from app.ml.model_loader import model_loader
from app.ml.pipelines.disease import _EXPECTED_CLASSES, predict_disease, preprocess_image
from app.services.ml import disease_service


EXPECTED_CLASSES = [
    "healthy",
    "early_blight",
    "late_blight",
    "leaf_mold",
    "bacterial_spot",
    "mosaic_virus",
]


def make_image_bytes() -> bytes:
    image = io.BytesIO()
    Image.new("RGB", (320, 240), (90, 140, 70)).save(image, format="PNG")
    return image.getvalue()


def make_upload(content: bytes, content_type: str = "image/png") -> UploadFile:
    return UploadFile(
        file=io.BytesIO(content),
        filename="tomato.png",
        headers=Headers({"content-type": content_type}),
    )


def test_model_and_class_artifacts_are_loaded_in_expected_order():
    assert model_loader.is_loaded("disease_detection")
    assert model_loader.get("disease_classes") == EXPECTED_CLASSES
    assert model_loader.version("disease_detection")
    assert model_loader.get("disease_detection").input_shape == (None, 224, 224, 3)
    assert model_loader.get("disease_detection").output_shape == (None, 6)


def test_class_artifact_matches_expected_order_on_disk():
    classes = joblib.load("app/ml/models/disease_classes.pkl")
    assert classes == EXPECTED_CLASSES
    assert _EXPECTED_CLASSES == EXPECTED_CLASSES


def test_preprocessing_is_rgb_224_and_normalized():
    processed = preprocess_image(make_image_bytes())
    assert processed.shape == (1, 224, 224, 3)
    assert processed.dtype == np.float32
    assert 0 <= processed.min() <= processed.max() <= 1


def test_real_prediction_has_valid_label_and_confidence():
    disease, confidence, severity, recommendations = predict_disease(make_image_bytes())
    assert disease in EXPECTED_CLASSES
    assert 0 <= confidence <= 1
    assert severity is None or isinstance(severity, str)
    assert recommendations


class FakeRepository:
    def __init__(self, db):
        self.db = db

    def create_disease_prediction(self, **kwargs):
        return type("Record", (), {"id": "prediction-1"})()


def test_valid_service_response_preserves_contract(monkeypatch, tmp_path):
    monkeypatch.setattr(disease_service, "MLRepository", FakeRepository)
    monkeypatch.setattr(disease_service, "predict_disease", lambda _: ("healthy", 0.99, None, "Keep monitoring."))
    monkeypatch.setattr(settings, "MEDIA_ROOT", str(tmp_path))

    result = asyncio.run(
        disease_service.DiseaseService(object()).detect(
            "user-1", make_upload(make_image_bytes()), "crop-1", "field-1"
        )
    )

    assert result.model_dump().keys() == {
        "prediction_id",
        "predicted_disease",
        "confidence",
        "severity",
        "recommendations",
        "model_version",
        "is_healthy",
    }
    assert result.predicted_disease == "healthy"
    assert result.is_healthy is True


def test_corrupt_upload_is_client_error():
    with pytest.raises(disease_service.HTTPException) as error:
        asyncio.run(disease_service.DiseaseService(object()).detect("user-1", make_upload(b"not an image"), None, None))

    assert error.value.status_code == 400


def test_oversized_upload_is_rejected(monkeypatch):
    monkeypatch.setattr(settings, "MAX_UPLOAD_SIZE_MB", 1)
    with pytest.raises(disease_service.HTTPException) as error:
        asyncio.run(
            disease_service.DiseaseService(object()).detect(
                "user-1", make_upload(b"x" * (1024 * 1024 + 1)), None, None
            )
        )

    assert error.value.status_code == 413
