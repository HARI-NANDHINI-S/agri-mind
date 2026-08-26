from sqlalchemy.orm import Session
from sqlalchemy import asc, desc, func
from typing import List, Optional, Tuple
from app.models.expense import Expense
from datetime import date


def create_expense(db: Session, expense: Expense) -> Expense:
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


def get_expense(db: Session, expense_id: int, user_id: int) -> Optional[Expense]:
    return db.query(Expense).filter(Expense.id == expense_id, Expense.user_id == user_id).first()


def list_expenses(db: Session, user_id: int, skip: int = 0, limit: int = 100, filters: dict = None, sort: str = "-expense_date") -> Tuple[List[Expense], int]:
    q = db.query(Expense).filter(Expense.user_id == user_id)
    if filters:
        if "crop_id" in filters:
            q = q.filter(Expense.crop_id == filters["crop_id"])
        if "field_id" in filters:
            q = q.filter(Expense.field_id == filters["field_id"])
        if "category" in filters and filters["category"] is not None:
            q = q.filter(Expense.category == filters["category"])
        if "start_date" in filters:
            q = q.filter(Expense.expense_date >= filters["start_date"])
        if "end_date" in filters:
            q = q.filter(Expense.expense_date <= filters["end_date"])
    total = q.count()
    sort_field = sort[1:] if sort.startswith("-") else sort
    sort_column = {
        "expense_date": Expense.expense_date,
        "amount": Expense.amount,
        "created_at": Expense.created_at,
    }.get(sort_field, Expense.expense_date)
    q = q.order_by(desc(sort_column) if sort.startswith("-") else asc(sort_column))
    return q.offset(skip).limit(limit).all(), total


def update_expense(db: Session, expense: Expense, updates: dict) -> Expense:
    for k, v in updates.items():
        if hasattr(expense, k) and v is not None:
            setattr(expense, k, v)
    db.commit()
    db.refresh(expense)
    return expense


def delete_expense(db: Session, expense: Expense) -> None:
    db.delete(expense)
    db.commit()


def expenses_summary(db: Session, user_id: int, start_date: date = None, end_date: date = None) -> List[Tuple]:
    q = db.query(Expense.category, func.sum(Expense.amount).label("total"))
    q = q.filter(Expense.user_id == user_id)
    if start_date:
        q = q.filter(Expense.expense_date >= start_date)
    if end_date:
        q = q.filter(Expense.expense_date <= end_date)
    q = q.group_by(Expense.category)
    return q.order_by(Expense.category).all()


def expenses_analytics(db: Session, user_id: int, start_date: date = None, end_date: date = None) -> Tuple[object, int]:
    q = db.query(Expense).filter(Expense.user_id == user_id)
    if start_date:
        q = q.filter(Expense.expense_date >= start_date)
    if end_date:
        q = q.filter(Expense.expense_date <= end_date)
    return q.with_entities(func.coalesce(func.sum(Expense.amount), 0), func.count(Expense.id)).one()
