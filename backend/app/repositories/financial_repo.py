from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.financial import Expense, Revenue, ExpenseCategory
from sqlalchemy import func


class FinancialRepository:
    def __init__(self, db: Session):
        self.db = db

    # ── Expenses ─────────────────────────────────────────────────────────────
    def get_expenses_by_user(self, user_id: str, limit: int = 100) -> List[Expense]:
        return (
            self.db.query(Expense)
            .filter(Expense.user_id == user_id)
            .order_by(Expense.date.desc())
            .limit(limit)
            .all()
        )

    def get_expense_by_id(self, expense_id: str, user_id: str) -> Optional[Expense]:
        return (
            self.db.query(Expense)
            .filter(Expense.id == expense_id, Expense.user_id == user_id)
            .first()
        )

    def create_expense(self, user_id: str, **kwargs) -> Expense:
        expense = Expense(user_id=user_id, **kwargs)
        self.db.add(expense)
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def update_expense(self, expense: Expense, **kwargs) -> Expense:
        for k, v in kwargs.items():
            if v is not None:
                setattr(expense, k, v)
        self.db.commit()
        self.db.refresh(expense)
        return expense

    def delete_expense(self, expense: Expense) -> None:
        self.db.delete(expense)
        self.db.commit()

    # ── Revenues ─────────────────────────────────────────────────────────────
    def get_revenues_by_user(self, user_id: str, limit: int = 100) -> List[Revenue]:
        return (
            self.db.query(Revenue)
            .filter(Revenue.user_id == user_id)
            .order_by(Revenue.date.desc())
            .limit(limit)
            .all()
        )

    def get_revenue_by_id(self, revenue_id: str, user_id: str) -> Optional[Revenue]:
        return (
            self.db.query(Revenue)
            .filter(Revenue.id == revenue_id, Revenue.user_id == user_id)
            .first()
        )

    def create_revenue(self, user_id: str, **kwargs) -> Revenue:
        if "total_amount" not in kwargs or kwargs["total_amount"] is None:
            kwargs["total_amount"] = kwargs["quantity_sold"] * kwargs["unit_price"]
        revenue = Revenue(user_id=user_id, **kwargs)
        self.db.add(revenue)
        self.db.commit()
        self.db.refresh(revenue)
        return revenue

    def delete_revenue(self, revenue: Revenue) -> None:
        self.db.delete(revenue)
        self.db.commit()

    # ── Summaries ────────────────────────────────────────────────────────────
    def get_total_expense_by_user(self, user_id: str) -> float:
        val = (
            self.db.query(func.sum(Expense.amount))
            .filter(Expense.user_id == user_id)
            .scalar()
        )
        return float(val or 0.0)

    def get_total_revenue_by_user(self, user_id: str) -> float:
        val = (
            self.db.query(func.sum(Revenue.total_amount))
            .filter(Revenue.user_id == user_id)
            .scalar()
        )
        return float(val or 0.0)

    def get_expenses_by_category(self, user_id: str) -> dict[str, float]:
        rows = (
            self.db.query(Expense.category, func.sum(Expense.amount))
            .filter(Expense.user_id == user_id)
            .group_by(Expense.category)
            .all()
        )
        return {cat.value if hasattr(cat, "value") else str(cat): float(total) for cat, total in rows}
