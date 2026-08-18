from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.response import success_response
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def get_overview(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = DashboardService(db).get_overview(current_user.id)
    return success_response(data=data, message="Dashboard data retrieved")
