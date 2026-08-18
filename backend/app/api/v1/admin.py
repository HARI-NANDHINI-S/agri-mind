from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import require_role
from app.schemas.admin import UserRoleUpdate, UserStatusUpdate
from app.schemas.response import success_response
from app.services.admin_service import AdminService

router = APIRouter(prefix="/admin", tags=["Admin Dashboard & ML Management"])


@router.get("/overview")
def get_overview(
    db: Session = Depends(get_db),
    admin_user=Depends(require_role("ADMIN")),
):
    data = AdminService(db).get_overview()
    return success_response(data=data, message="Admin overview retrieved")


@router.get("/users")
def list_users(
    db: Session = Depends(get_db),
    admin_user=Depends(require_role("ADMIN")),
):
    data = AdminService(db).list_users()
    return success_response(data=data, message="Users list retrieved")


@router.put("/users/{user_id}/role")
def update_role(
    user_id: str,
    body: UserRoleUpdate,
    db: Session = Depends(get_db),
    admin_user=Depends(require_role("ADMIN")),
):
    data = AdminService(db).update_role(user_id, body.role)
    return success_response(data=data, message="User role updated")


@router.put("/users/{user_id}/status")
def update_status(
    user_id: str,
    body: UserStatusUpdate,
    db: Session = Depends(get_db),
    admin_user=Depends(require_role("ADMIN")),
):
    data = AdminService(db).update_status(user_id, body.is_active)
    return success_response(data=data, message="User status updated")
