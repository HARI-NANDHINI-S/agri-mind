import uuid
from typing import List
from sqlalchemy.orm import Session
from app.repositories.assistant_repo import AssistantRepository
from app.schemas.assistant import ChatRequest, ChatResponse, ChatMessageResponse


class AssistantService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AssistantRepository(db)

    def chat(self, user_id: str, req: ChatRequest) -> ChatResponse:
        session_id = req.session_id or str(uuid.uuid4())

        # Save user message
        self.repo.add_message(user_id=user_id, session_id=session_id, sender="USER", content=req.message)

        # Generate intelligent agricultural domain response
        reply = self._generate_agricultural_reply(req.message)

        # Save assistant message
        self.repo.add_message(user_id=user_id, session_id=session_id, sender="ASSISTANT", content=reply)

        # Retrieve chat history
        messages = self.repo.get_messages(user_id=user_id, session_id=session_id)
        history = [ChatMessageResponse.model_validate(m) for m in messages]

        return ChatResponse(session_id=session_id, reply=reply, history=history)

    def _generate_agricultural_reply(self, text: str) -> str:
        msg = text.lower()
        if "disease" in msg or "leaf" in msg or "blight" in msg:
            return (
                "🌱 **Disease Prevention Advisory**: For leaf blights or spots, ensure adequate plant spacing to improve air circulation. "
                "Avoid overhead irrigation during evening hours. You can also use our **Disease Scan** feature to upload a leaf photo for instant AI diagnosis!"
            )
        elif "fertilizer" in msg or "npk" in msg or "nitrogen" in msg or "soil" in msg:
            return (
                "🧪 **Soil Nutrition Tip**: Balanced N-P-K applications depend on your crop stage. During vegetative growth, Nitrogen is key. "
                "During flowering and fruiting, increase Phosphorus and Potassium. Check out our **Crop Recommendations** tool to get tailored soil metrics!"
            )
        elif "water" in msg or "drip" in msg or "irrigation" in msg:
            return (
                "💧 **Irrigation Strategy**: Drip irrigation reduces water wastage by up to 60% compared to flood irrigation. "
                "Water early in the morning to minimize evaporation loss."
            )
        elif "price" in msg or "market" in msg or "sell" in msg:
            return (
                "📈 **Market Intelligence**: Crop market prices fluctuate based on seasonal demand and local mandi arrivals. "
                "Use our **Market Intelligence** & **Price Predictor** pages to check live trends before selling!"
            )
        elif "yield" in msg or "harvest" in msg:
            return (
                "🌾 **Yield Optimization**: Maintain weed-free fields during the first 30–45 days after planting. "
                "Use our **Yield Predictor** tool to project total harvest tonnages based on your field size."
            )
        else:
            return (
                f"Hello! I am your AgriMind AI Agriculture Assistant. I can advise you on crop selection, disease treatment, "
                f"fertilizer application, market price trends, and farm financial planning. How can I help you today regarding '{text[:40]}...'?"
            )
