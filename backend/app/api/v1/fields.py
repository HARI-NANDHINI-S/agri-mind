from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.field import FieldCreate, FieldUpdate
from app.schemas.response import success_response
from app.services.field_service import FieldService

router = APIRouter(prefix="/farms/{farm_id}/fields", tags=["Fields"])


@router.get("")
def list_fields(farm_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    fields = FieldService(db).get_fields(farm_id, current_user.id)
    return success_response(data=fields, message="Fields retrieved")


@router.post("", status_code=201)
def create_field(farm_id: str, body: FieldCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    field = FieldService(db).create_field(farm_id, current_user.id, body)
    return success_response(data=field, message="Field created")


@router.get("/{field_id}")
def get_field(farm_id: str, field_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    field = FieldService(db).get_field(farm_id, field_id, current_user.id)
    return success_response(data=field, message="Field retrieved")


@router.put("/{field_id}")
def update_field(farm_id: str, field_id: str, body: FieldUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    field = FieldService(db).update_field(farm_id, field_id, current_user.id, body)
    return success_response(data=field, message="Field updated")


@router.delete("/{field_id}")
def delete_field(farm_id: str, field_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    FieldService(db).delete_field(farm_id, field_id, current_user.id)
    return success_response(message="Field deleted")
