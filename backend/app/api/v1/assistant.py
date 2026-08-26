from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.assistant import ChatRequest
from app.schemas.response import success_response
from app.services.assistant_service import AssistantService

router = APIRouter(prefix="/assistant", tags=["AI Agriculture Assistant"])


@router.post("/chat")
def chat(
    body: ChatRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = AssistantService(db).chat(current_user.id, body)
    return success_response(data=result, message="Assistant reply generated")
