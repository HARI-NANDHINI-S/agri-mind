from typing import List
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.repositories.financial_repo import FinancialRepository
from app.schemas.financial import (
    ExpenseCreate, ExpenseUpdate, ExpenseResponse,
    RevenueCreate, RevenueResponse, FinancialSummary
)


class FinancialService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = FinancialRepository(db)

    # Expenses
    def get_expenses(self, user_id: str) -> List[ExpenseResponse]:
        expenses = self.repo.get_expenses_by_user(user_id)
        return [ExpenseResponse.model_validate(e) for e in expenses]

    def create_expense(self, user_id: str, data: ExpenseCreate) -> ExpenseResponse:
        expense = self.repo.create_expense(user_id, **data.model_dump())
        return ExpenseResponse.model_validate(expense)

    def update_expense(self, expense_id: str, user_id: str, data: ExpenseUpdate) -> ExpenseResponse:
        expense = self.repo.get_expense_by_id(expense_id, user_id)
        if not expense:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
        updated = self.repo.update_expense(expense, **data.model_dump(exclude_none=True))
        return ExpenseResponse.model_validate(updated)

    def delete_expense(self, expense_id: str, user_id: str) -> None:
        expense = self.repo.get_expense_by_id(expense_id, user_id)
        if not expense:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Expense not found")
        self.repo.delete_expense(expense)

    # Revenues
    def get_revenues(self, user_id: str) -> List[RevenueResponse]:
        revenues = self.repo.get_revenues_by_user(user_id)
        return [RevenueResponse.model_validate(r) for r in revenues]

    def create_revenue(self, user_id: str, data: RevenueCreate) -> RevenueResponse:
        revenue = self.repo.create_revenue(user_id, **data.model_dump())
        return RevenueResponse.model_validate(revenue)

    def delete_revenue(self, revenue_id: str, user_id: str) -> None:
        revenue = self.repo.get_revenue_by_id(revenue_id, user_id)
        if not revenue:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Revenue not found")
        self.repo.delete_revenue(revenue)

    # Summary
    def get_financial_summary(self, user_id: str) -> FinancialSummary:
        tot_exp = self.repo.get_total_expense_by_user(user_id)
        tot_rev = self.repo.get_total_revenue_by_user(user_id)
        net_profit = tot_rev - tot_exp
        profit_margin = round((net_profit / tot_rev * 100), 2) if tot_rev > 0 else 0.0
        exp_by_cat = self.repo.get_expenses_by_category(user_id)

        recent_expenses = [ExpenseResponse.model_validate(e) for e in self.repo.get_expenses_by_user(user_id, limit=5)]
        recent_revenues = [RevenueResponse.model_validate(r) for r in self.repo.get_revenues_by_user(user_id, limit=5)]

        return FinancialSummary(
            total_revenue=tot_rev,
            total_expense=tot_exp,
            net_profit=net_profit,
            profit_margin_percent=profit_margin,
            expense_by_category=exp_by_cat,
            recent_expenses=recent_expenses,
            recent_revenues=recent_revenues,
        )
