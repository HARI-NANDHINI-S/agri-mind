from uuid import uuid4
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.security import get_current_user
from app.database.session import get_db
from app.models.platform import AIConversation, AIMessage
from app.schemas.modules import AssistantRequest, ResponseEnvelope

router = APIRouter()

@router.post("/chat", response_model=ResponseEnvelope)
def chat(payload: AssistantRequest, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    user_id = int(current_user["user_id"])
    conversation_id = payload.conversation_id or str(uuid4())
    conversation = db.query(AIConversation).filter(AIConversation.conversation_id == conversation_id, AIConversation.user_id == user_id).first()
    if not conversation:
        conversation = AIConversation(user_id=user_id, conversation_id=conversation_id, metadata_json={"scope": "user-owned"}); db.add(conversation); db.flush()
    db.add(AIMessage(conversation_id=conversation_id, sender="user", message=payload.message, message_type="user"))
    answer = "I can use your recorded AgriMind data and agriculture knowledge, but the requested specific data is unavailable. Please provide a crop, farm, or market context."
    sources = []
    db.add(AIMessage(conversation_id=conversation_id, sender="assistant", message=answer, message_type="unavailable", sources=sources))
    db.commit()
    return {"success": True, "message": "Assistant response generated", "data": {"conversation_id": conversation_id, "answer": answer, "sources": sources, "data_used": [], "disclaimer": "Assistant responses are informational and are not guaranteed agricultural advice."}}
