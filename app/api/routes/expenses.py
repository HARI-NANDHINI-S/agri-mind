from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.schemas.expense import ExpenseAnalyticsResponse, ExpenseCreate, ExpenseListResponse, ExpenseRead, ExpenseUpdate, ExpenseResponse
from app.database.session import get_db
from app.core.security import get_current_user
from app.services.expense_service import ExpenseService
from datetime import date

router = APIRouter()


@router.post("", response_model=ExpenseResponse)
def create_expense(payload: ExpenseCreate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    svc = ExpenseService(db, user_id=current_user["user_id"])
    exp = svc.create(payload)
    return {"message": "Expense created", "data": exp}


@router.get("", response_model=ExpenseListResponse)
def list_expenses(
    skip: int = 0,
    limit: int = 50,
    crop_id: Optional[int] = Query(None),
    field_id: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    sort: str = Query("-expense_date"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    filters = {}
    if crop_id:
        filters["crop_id"] = crop_id
    if field_id:
        filters["field_id"] = field_id
    if category:
        filters["category"] = category
    if start_date:
        filters["start_date"] = start_date
    if end_date:
        filters["end_date"] = end_date
    svc = ExpenseService(db, user_id=current_user["user_id"])
    items, total = svc.list(skip=skip, limit=limit, filters=filters, sort=sort)
    return {"message": "Expenses retrieved", "data": {"items": items, "total": total, "skip": skip, "limit": limit}}


@router.get("/summary")
def expenses_summary(start_date: Optional[date] = Query(None), end_date: Optional[date] = Query(None), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    svc = ExpenseService(db, user_id=current_user["user_id"])
    rows = svc.summary(start_date=start_date, end_date=end_date)
    return {"success": True, "message": "Expense summary retrieved", "data": [{"category": r[0], "total": r[1]} for r in rows]}


@router.get("/analytics", response_model=ExpenseAnalyticsResponse)
def expense_analytics(start_date: Optional[date] = Query(None), end_date: Optional[date] = Query(None), db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    svc = ExpenseService(db, user_id=current_user["user_id"])
    total_amount, expense_count, rows = svc.analytics(start_date=start_date, end_date=end_date)
    return {"message": "Expense analytics retrieved", "data": {"total_amount": total_amount, "expense_count": expense_count, "by_category": [{"category": r[0], "total": r[1]} for r in rows]}}


@router.get("/{expense_id}", response_model=ExpenseResponse)
def get_expense(expense_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    svc = ExpenseService(db, user_id=current_user["user_id"])
    exp = svc.get(expense_id)
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found")
    return {"message": "Expense retrieved", "data": exp}


@router.put("/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id: int, updates: ExpenseUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    svc = ExpenseService(db, user_id=current_user["user_id"])
    exp = svc.update(expense_id, updates)
    if not exp:
        raise HTTPException(status_code=404, detail="Expense not found or no permission")
    return {"message": "Expense updated", "data": exp}


@router.delete("/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    svc = ExpenseService(db, user_id=current_user["user_id"])
    ok = svc.delete(expense_id)
    if not ok:
        raise HTTPException(status_code=404, detail="Expense not found or no permission")
    return {"success": True, "message": "Expense deleted"}


