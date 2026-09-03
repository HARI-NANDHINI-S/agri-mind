import os
import uuid
from fastapi import UploadFile, HTTPException
from PIL import Image, UnidentifiedImageError
import io
from sqlalchemy.orm import Session
from app.ml.pipelines.disease import predict_disease
from app.ml.model_loader import model_loader
from app.repositories.ml.ml_repo import MLRepository
from app.schemas.ml.disease_detection import DiseaseDetectionResponse
from app.core.config import settings


class DiseaseService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = MLRepository(db)

    async def detect(
        self,
        user_id: str,
        image: UploadFile,
        crop_id: str | None,
        field_id: str | None,
    ) -> DiseaseDetectionResponse:
        # Validate content type
        if not image.content_type or not image.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Uploaded file must be an image")

        image_bytes = await image.read()
        max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
        if len(image_bytes) > max_bytes:
            raise HTTPException(status_code=413, detail=f"Image exceeds {settings.MAX_UPLOAD_SIZE_MB} MB limit")

        try:
            with Image.open(io.BytesIO(image_bytes)) as uploaded_image:
                uploaded_image.verify()
        except (UnidentifiedImageError, OSError):
            raise HTTPException(status_code=400, detail="Uploaded file is not a valid image")

        # Save to disk
        ext = (image.filename or "upload.jpg").rsplit(".", 1)[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        save_path = os.path.join(settings.MEDIA_ROOT, filename)
        os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
        with open(save_path, "wb") as f:
            f.write(image_bytes)

        try:
            disease, confidence, severity, recommendations = predict_disease(image_bytes)
        except RuntimeError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        version = model_loader.version("disease_detection")
        is_healthy = disease.lower() == "healthy"

        record = self.repo.create_disease_prediction(
            user_id=user_id,
            crop_id=crop_id,
            field_id=field_id,
            image_path=save_path,
            predicted_disease=disease,
            confidence=confidence,
            severity=severity,
            model_version=version,
            recommendations=recommendations,
        )

        return DiseaseDetectionResponse(
            prediction_id=record.id,
            predicted_disease=disease,
            confidence=round(confidence, 4),
            severity=severity,
            recommendations=recommendations,
            model_version=version,
            is_healthy=is_healthy,
        )
