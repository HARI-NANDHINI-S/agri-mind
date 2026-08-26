from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.farm import Farm


class FarmRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_owner(self, owner_id: str) -> List[Farm]:
        return self.db.query(Farm).filter(Farm.owner_id == owner_id).all()

    def get_by_id(self, farm_id: str) -> Optional[Farm]:
        return self.db.query(Farm).filter(Farm.id == farm_id).first()

    def get_by_id_and_owner(self, farm_id: str, owner_id: str) -> Optional[Farm]:
        return self.db.query(Farm).filter(Farm.id == farm_id, Farm.owner_id == owner_id).first()

    def create(self, owner_id: str, **kwargs) -> Farm:
        farm = Farm(owner_id=owner_id, **kwargs)
        self.db.add(farm)
        self.db.commit()
        self.db.refresh(farm)
        return farm

    def update(self, farm: Farm, **kwargs) -> Farm:
        for key, value in kwargs.items():
            if value is not None:
                setattr(farm, key, value)
        self.db.commit()
        self.db.refresh(farm)
        return farm

    def delete(self, farm: Farm) -> None:
        self.db.delete(farm)
        self.db.commit()

    def count_by_owner(self, owner_id: str) -> int:
        return self.db.query(Farm).filter(Farm.owner_id == owner_id).count()
