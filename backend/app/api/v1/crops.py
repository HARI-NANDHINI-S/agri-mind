from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.crop import CropCreate, CropUpdate
from app.schemas.response import success_response
from app.services.crop_service import CropService

router = APIRouter(prefix="/crops", tags=["Crops"])


@router.get("")
def list_crops(
    field_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    svc = CropService(db)
    if field_id:
        crops = svc.get_crops(field_id, current_user.id)
    else:
        crops = svc.get_all_crops_for_user(current_user.id)
    return success_response(data=crops, message="Crops retrieved")


@router.post("", status_code=201)
def create_crop(body: CropCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    crop = CropService(db).create_crop(current_user.id, body)
    return success_response(data=crop, message="Crop created")


@router.get("/{crop_id}")
def get_crop(crop_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    crop = CropService(db).get_crop(crop_id, current_user.id)
    return success_response(data=crop, message="Crop retrieved")


@router.put("/{crop_id}")
def update_crop(crop_id: str, body: CropUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    crop = CropService(db).update_crop(crop_id, current_user.id, body)
    return success_response(data=crop, message="Crop updated")


@router.delete("/{crop_id}")
def delete_crop(crop_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    CropService(db).delete_crop(crop_id, current_user.id)
    return success_response(message="Crop deleted")


@router.get("/{crop_id}/history")
def get_crop_history(crop_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    history = CropService(db).get_crop_history(crop_id, current_user.id)
    return success_response(data=history, message="Crop history retrieved")
