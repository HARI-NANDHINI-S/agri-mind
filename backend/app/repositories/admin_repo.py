from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.user import User, UserRole
from app.models.farm import Farm
from app.models.field import Field
from app.models.crop import Crop
from app.models.disease_prediction import DiseasePrediction
from app.models.yield_prediction import YieldPrediction
from app.models.crop_recommendation import CropRecommendation


class AdminRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all_users(self, limit: int = 100) -> List[User]:
        return self.db.query(User).order_by(User.created_at.desc()).limit(limit).all()

    def update_user_role(self, user_id: str, new_role: UserRole) -> Optional[User]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.role = new_role
            self.db.commit()
            self.db.refresh(user)
        return user

    def update_user_status(self, user_id: str, is_active: bool) -> Optional[User]:
        user = self.db.query(User).filter(User.id == user_id).first()
        if user:
            user.is_active = is_active
            self.db.commit()
            self.db.refresh(user)
        return user

    def get_system_counts(self) -> dict:
        total_users = self.db.query(User).count()
        total_farmers = self.db.query(User).filter(User.role == UserRole.FARMER).count()
        total_farms = self.db.query(Farm).count()
        total_fields = self.db.query(Field).count()
        total_crops = self.db.query(Crop).count()
        
        disease_count = self.db.query(DiseasePrediction).count()
        yield_count = self.db.query(YieldPrediction).count()
        rec_count = self.db.query(CropRecommendation).count()
        total_predictions = disease_count + yield_count + rec_count

        return {
            "total_users": total_users,
            "total_farmers": total_farmers,
            "total_farms": total_farms,
            "total_fields": total_fields,
            "total_crops": total_crops,
            "total_predictions": total_predictions,
        }
