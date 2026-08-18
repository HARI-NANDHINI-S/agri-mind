from typing import List, Optional
from sqlalchemy.orm import Session, joinedload
from app.models.crop import Crop, CropStage, CropStatus
from app.models.crop_history import CropHistory


class CropRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_field(self, field_id: str) -> List[Crop]:
        return (
            self.db.query(Crop)
            .options(joinedload(Crop.history))
            .filter(Crop.field_id == field_id)
            .all()
        )

    def get_active_by_user_fields(self, field_ids: List[str]) -> List[Crop]:
        return (
            self.db.query(Crop)
            .filter(Crop.field_id.in_(field_ids), Crop.status == CropStatus.ACTIVE)
            .all()
        )

    def get_by_id(self, crop_id: str) -> Optional[Crop]:
        return (
            self.db.query(Crop)
            .options(joinedload(Crop.history))
            .filter(Crop.id == crop_id)
            .first()
        )

    def create(self, **kwargs) -> Crop:
        crop = Crop(**kwargs)
        self.db.add(crop)
        self.db.flush()
        # record initial stage in history
        history = CropHistory(crop_id=crop.id, stage=crop.stage)
        self.db.add(history)
        self.db.commit()
        self.db.refresh(crop)
        return crop

    def update(self, crop: Crop, **kwargs) -> Crop:
        old_stage = crop.stage
        for key, value in kwargs.items():
            if value is not None:
                setattr(crop, key, value)
        # log stage transition
        if "stage" in kwargs and kwargs["stage"] != old_stage:
            history = CropHistory(crop_id=crop.id, stage=kwargs["stage"])
            self.db.add(history)
        self.db.commit()
        self.db.refresh(crop)
        return crop

    def delete(self, crop: Crop) -> None:
        self.db.delete(crop)
        self.db.commit()

    def count_active_by_fields(self, field_ids: List[str]) -> int:
        return (
            self.db.query(Crop)
            .filter(Crop.field_id.in_(field_ids), Crop.status == CropStatus.ACTIVE)
            .count()
        )

    def get_all_by_user_fields(self, field_ids: List[str]) -> List[Crop]:
        return self.db.query(Crop).filter(Crop.field_id.in_(field_ids)).all()
