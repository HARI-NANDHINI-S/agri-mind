from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.ml.profitability_risk import ProfitabilityRiskRequest
from app.schemas.response import success_response
from app.services.ml.profitability_service import ProfitabilityService

router = APIRouter(prefix="/ml", tags=["ML – Profitability & Risk Analysis"])


@router.post("/profitability-risk")
def profitability_risk(
    body: ProfitabilityRiskRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    result = ProfitabilityService(db).analyze(current_user.id, body)
    return success_response(data=result, message="Profitability & Risk analysis completed")
