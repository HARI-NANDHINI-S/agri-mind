from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.field import Field


class FieldRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_farm(self, farm_id: str) -> List[Field]:
        return self.db.query(Field).filter(Field.farm_id == farm_id).all()

    def get_by_id(self, field_id: str) -> Optional[Field]:
        return self.db.query(Field).filter(Field.id == field_id).first()

    def get_by_id_and_farm(self, field_id: str, farm_id: str) -> Optional[Field]:
        return self.db.query(Field).filter(Field.id == field_id, Field.farm_id == farm_id).first()

    def create(self, farm_id: str, **kwargs) -> Field:
        field = Field(farm_id=farm_id, **kwargs)
        self.db.add(field)
        self.db.commit()
        self.db.refresh(field)
        return field

    def update(self, field: Field, **kwargs) -> Field:
        for key, value in kwargs.items():
            if value is not None:
                setattr(field, key, value)
        self.db.commit()
        self.db.refresh(field)
        return field

    def delete(self, field: Field) -> None:
        self.db.delete(field)
        self.db.commit()

    def count_by_farm(self, farm_id: str) -> int:
        return self.db.query(Field).filter(Field.farm_id == farm_id).count()
