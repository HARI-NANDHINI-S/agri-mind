from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.crop_repo import CropRepository
from app.repositories.field_repo import FieldRepository
from app.repositories.farm_repo import FarmRepository
from app.schemas.crop import CropCreate, CropUpdate, CropResponse, CropHistoryEntry


class CropService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = CropRepository(db)
        self.field_repo = FieldRepository(db)
        self.farm_repo = FarmRepository(db)

    def _assert_field_ownership(self, field_id: str, owner_id: str):
        field = self.field_repo.get_by_id(field_id)
        if not field:
            raise HTTPException(status_code=404, detail="Field not found")
        farm = self.farm_repo.get_by_id_and_owner(field.farm_id, owner_id)
        if not farm:
            raise HTTPException(status_code=403, detail="Access denied to this field")
        return field

    def get_crops(self, field_id: str, owner_id: str) -> List[CropResponse]:
        self._assert_field_ownership(field_id, owner_id)
        crops = self.repo.get_by_field(field_id)
        return [CropResponse.model_validate(c) for c in crops]

    def get_all_crops_for_user(self, owner_id: str) -> List[CropResponse]:
        farms = self.farm_repo.get_by_owner(owner_id)
        field_ids = [f2.id for farm in farms for f2 in farm.fields]
        crops = self.repo.get_all_by_user_fields(field_ids)
        return [CropResponse.model_validate(c) for c in crops]

    def get_crop(self, crop_id: str, owner_id: str) -> CropResponse:
        crop = self.repo.get_by_id(crop_id)
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        self._assert_field_ownership(crop.field_id, owner_id)
        return CropResponse.model_validate(crop)

    def create_crop(self, owner_id: str, data: CropCreate) -> CropResponse:
        self._assert_field_ownership(data.field_id, owner_id)
        crop = self.repo.create(**data.model_dump())
        return CropResponse.model_validate(crop)

    def update_crop(self, crop_id: str, owner_id: str, data: CropUpdate) -> CropResponse:
        crop = self.repo.get_by_id(crop_id)
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        self._assert_field_ownership(crop.field_id, owner_id)
        updated = self.repo.update(crop, **data.model_dump(exclude_none=True))
        return CropResponse.model_validate(updated)

    def delete_crop(self, crop_id: str, owner_id: str) -> None:
        crop = self.repo.get_by_id(crop_id)
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        self._assert_field_ownership(crop.field_id, owner_id)
        self.repo.delete(crop)

    def get_crop_history(self, crop_id: str, owner_id: str) -> List[CropHistoryEntry]:
        crop = self.repo.get_by_id(crop_id)
        if not crop:
            raise HTTPException(status_code=404, detail="Crop not found")
        self._assert_field_ownership(crop.field_id, owner_id)
        return [CropHistoryEntry.model_validate(h) for h in crop.history]
