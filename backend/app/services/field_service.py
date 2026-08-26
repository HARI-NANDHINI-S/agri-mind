from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.field_repo import FieldRepository
from app.repositories.farm_repo import FarmRepository
from app.schemas.field import FieldCreate, FieldUpdate, FieldResponse


class FieldService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = FieldRepository(db)
        self.farm_repo = FarmRepository(db)

    def _assert_farm_ownership(self, farm_id: str, owner_id: str):
        farm = self.farm_repo.get_by_id_and_owner(farm_id, owner_id)
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")
        return farm

    def get_fields(self, farm_id: str, owner_id: str) -> List[FieldResponse]:
        self._assert_farm_ownership(farm_id, owner_id)
        return [FieldResponse.model_validate(f) for f in self.repo.get_by_farm(farm_id)]

    def get_field(self, farm_id: str, field_id: str, owner_id: str) -> FieldResponse:
        self._assert_farm_ownership(farm_id, owner_id)
        field = self.repo.get_by_id_and_farm(field_id, farm_id)
        if not field:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
        return FieldResponse.model_validate(field)

    def create_field(self, farm_id: str, owner_id: str, data: FieldCreate) -> FieldResponse:
        self._assert_farm_ownership(farm_id, owner_id)
        field = self.repo.create(farm_id=farm_id, **data.model_dump())
        return FieldResponse.model_validate(field)

    def update_field(self, farm_id: str, field_id: str, owner_id: str, data: FieldUpdate) -> FieldResponse:
        self._assert_farm_ownership(farm_id, owner_id)
        field = self.repo.get_by_id_and_farm(field_id, farm_id)
        if not field:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
        updated = self.repo.update(field, **data.model_dump(exclude_none=True))
        return FieldResponse.model_validate(updated)

    def delete_field(self, farm_id: str, field_id: str, owner_id: str) -> None:
        self._assert_farm_ownership(farm_id, owner_id)
        field = self.repo.get_by_id_and_farm(field_id, farm_id)
        if not field:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Field not found")
        self.repo.delete(field)
