from sqlalchemy.orm import Session
from app.repositories import expense_repository
from app.schemas.expense import ExpenseCreate, ExpenseUpdate
from app.models.expense import Expense, ExpenseCategory
from datetime import date
from typing import List


class ExpenseService:
    def __init__(self, db: Session, user_id: int):
        self.db = db
        self.user_id = user_id

    def create(self, payload: ExpenseCreate) -> Expense:
        exp = Expense(
            user_id=self.user_id,
            farm_id=payload.farm_id,
            field_id=payload.field_id,
            crop_id=payload.crop_id,
            category=payload.category,
            amount=payload.amount,
            description=payload.description,
            expense_date=payload.expense_date,
        )
        return expense_repository.create_expense(self.db, exp)

    def get(self, expense_id: int) -> Expense:
        return expense_repository.get_expense(self.db, expense_id, self.user_id)

    def list(self, skip: int = 0, limit: int = 100, filters: dict = None, sort: str = "-expense_date"):
        return expense_repository.list_expenses(self.db, self.user_id, skip, limit, filters, sort)

    def update(self, expense_id: int, updates: ExpenseUpdate):
        exp = self.get(expense_id)
        if not exp:
            return None
        updates_dict = updates.dict(exclude_unset=True)
        return expense_repository.update_expense(self.db, exp, updates_dict)

    def delete(self, expense_id: int) -> bool:
        exp = self.get(expense_id)
        if not exp:
            return False
        expense_repository.delete_expense(self.db, exp)
        return True

    def summary(self, start_date: date = None, end_date: date = None):
        return expense_repository.expenses_summary(self.db, self.user_id, start_date, end_date)

    def analytics(self, start_date: date = None, end_date: date = None):
        total_amount, expense_count = expense_repository.expenses_analytics(self.db, self.user_id, start_date, end_date)
        return total_amount, expense_count, self.summary(start_date, end_date)
