from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.farm_repo import FarmRepository
from app.schemas.farm import FarmCreate, FarmUpdate, FarmResponse


class FarmService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = FarmRepository(db)

    def get_farms(self, owner_id: str) -> List[FarmResponse]:
        farms = self.repo.get_by_owner(owner_id)
        result = []
        for f in farms:
            data = FarmResponse.model_validate(f)
            data.field_count = len(f.fields)
            result.append(data)
        return result

    def get_farm(self, farm_id: str, owner_id: str) -> FarmResponse:
        farm = self.repo.get_by_id_and_owner(farm_id, owner_id)
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")
        data = FarmResponse.model_validate(farm)
        data.field_count = len(farm.fields)
        return data

    def create_farm(self, owner_id: str, data: FarmCreate) -> FarmResponse:
        farm = self.repo.create(owner_id=owner_id, **data.model_dump())
        result = FarmResponse.model_validate(farm)
        result.field_count = 0
        return result

    def update_farm(self, farm_id: str, owner_id: str, data: FarmUpdate) -> FarmResponse:
        farm = self.repo.get_by_id_and_owner(farm_id, owner_id)
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")
        updated = self.repo.update(farm, **data.model_dump(exclude_none=True))
        result = FarmResponse.model_validate(updated)
        result.field_count = len(updated.fields)
        return result

    def delete_farm(self, farm_id: str, owner_id: str) -> None:
        farm = self.repo.get_by_id_and_owner(farm_id, owner_id)
        if not farm:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farm not found")
        self.repo.delete(farm)
