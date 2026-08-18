from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.farm import FarmCreate, FarmUpdate
from app.schemas.response import success_response
from app.services.farm_service import FarmService

router = APIRouter(prefix="/farms", tags=["Farms"])


@router.get("")
def list_farms(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    farms = FarmService(db).get_farms(current_user.id)
    return success_response(data=farms, message="Farms retrieved")


@router.post("", status_code=201)
def create_farm(body: FarmCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    farm = FarmService(db).create_farm(current_user.id, body)
    return success_response(data=farm, message="Farm created")


@router.get("/{farm_id}")
def get_farm(farm_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    farm = FarmService(db).get_farm(farm_id, current_user.id)
    return success_response(data=farm, message="Farm retrieved")


@router.put("/{farm_id}")
def update_farm(farm_id: str, body: FarmUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    farm = FarmService(db).update_farm(farm_id, current_user.id, body)
    return success_response(data=farm, message="Farm updated")


@router.delete("/{farm_id}")
def delete_farm(farm_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    FarmService(db).delete_farm(farm_id, current_user.id)
    return success_response(message="Farm deleted")
