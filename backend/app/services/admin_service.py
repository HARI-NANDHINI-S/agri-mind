from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.admin_repo import AdminRepository
from app.schemas.admin import AdminOverview, UserAdminResponse, MLModelStatus
from app.models.user import UserRole
from app.ml.model_loader import model_loader


class AdminService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AdminRepository(db)

    def get_overview(self) -> AdminOverview:
        counts = self.repo.get_system_counts()

        ml_models = [
            MLModelStatus(
                name="Crop Recommendation Model",
                version=model_loader.version("crop_recommendation"),
                status="LOADED" if model_loader.is_loaded("crop_recommendation") else "STUB_ACTIVE",
                last_trained="Active",
            ),
            MLModelStatus(
                name="Disease Detection Model",
                version=model_loader.version("disease_detection"),
                status="LOADED" if model_loader.is_loaded("disease_detection") else "STUB_ACTIVE",
                last_trained="Active",
            ),
            MLModelStatus(
                name="Yield Prediction Regressor",
                version=model_loader.version("yield_prediction"),
                status="LOADED" if model_loader.is_loaded("yield_prediction") else "STUB_ACTIVE",
                last_trained="Active",
            ),
            MLModelStatus(
                name="Price Prediction Model",
                version=model_loader.version("price_prediction"),
                status="LOADED" if model_loader.is_loaded("price_prediction") else "STUB_ACTIVE",
                last_trained="Active",
            ),
        ]

        return AdminOverview(
            total_users=counts["total_users"],
            total_farmers=counts["total_farmers"],
            total_farms=counts["total_farms"],
            total_fields=counts["total_fields"],
            total_crops=counts["total_crops"],
            total_predictions=counts["total_predictions"],
            system_health="HEALTHY",
            ml_models=ml_models,
        )

    def list_users(self) -> List[UserAdminResponse]:
        users = self.repo.get_all_users()
        return [UserAdminResponse.model_validate(u) for u in users]

    def update_role(self, user_id: str, new_role: UserRole) -> UserAdminResponse:
        user = self.repo.update_user_role(user_id, new_role)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserAdminResponse.model_validate(user)

    def update_status(self, user_id: str, is_active: bool) -> UserAdminResponse:
        user = self.repo.update_user_status(user_id, is_active)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return UserAdminResponse.model_validate(user)
