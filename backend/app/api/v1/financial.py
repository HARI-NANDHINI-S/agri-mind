from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.schemas.financial import ExpenseCreate, ExpenseUpdate, RevenueCreate
from app.schemas.response import success_response
from app.services.financial_service import FinancialService

router = APIRouter(prefix="/financial", tags=["Expense & Financial Management"])


@router.get("/summary")
def get_summary(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = FinancialService(db).get_financial_summary(current_user.id)
    return success_response(data=data, message="Financial summary retrieved")


@router.get("/expenses")
def list_expenses(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = FinancialService(db).get_expenses(current_user.id)
    return success_response(data=data, message="Expenses retrieved")


@router.post("/expenses", status_code=201)
def create_expense(body: ExpenseCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = FinancialService(db).create_expense(current_user.id, body)
    return success_response(data=data, message="Expense created")


@router.put("/expenses/{expense_id}")
def update_expense(expense_id: str, body: ExpenseUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = FinancialService(db).update_expense(expense_id, current_user.id, body)
    return success_response(data=data, message="Expense updated")


@router.delete("/expenses/{expense_id}")
def delete_expense(expense_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    FinancialService(db).delete_expense(expense_id, current_user.id)
    return success_response(message="Expense deleted")


@router.get("/revenues")
def list_revenues(db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = FinancialService(db).get_revenues(current_user.id)
    return success_response(data=data, message="Revenues retrieved")


@router.post("/revenues", status_code=201)
def create_revenue(body: RevenueCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    data = FinancialService(db).create_revenue(current_user.id, body)
    return success_response(data=data, message="Revenue record created")


@router.delete("/revenues/{revenue_id}")
def delete_revenue(revenue_id: str, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    FinancialService(db).delete_revenue(revenue_id, current_user.id)
    return success_response(message="Revenue deleted")
