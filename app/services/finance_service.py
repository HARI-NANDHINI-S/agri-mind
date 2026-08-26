from decimal import Decimal
from sqlalchemy.orm import Session
from app.models.expense import Expense
from app.models.finance import ProfitabilityRecord, RiskAssessment


def calculate_profitability(predicted_yield, expected_price, total_cost):
    revenue = Decimal(str(predicted_yield)) * Decimal(str(expected_price))
    cost = Decimal(str(total_cost))
    profit = revenue - cost
    margin = (profit / revenue * Decimal("100")) if revenue else None
    break_even = (cost / Decimal(str(predicted_yield))) if predicted_yield else None
    return revenue, profit, margin, break_even


class FinanceService:
    def __init__(self, db: Session, user_id: int):
        self.db, self.user_id = db, user_id

    def total_expenses(self, crop_id=None, field_id=None):
        query = self.db.query(Expense).filter(Expense.user_id == self.user_id)
        if crop_id is not None: query = query.filter(Expense.crop_id == crop_id)
        if field_id is not None: query = query.filter(Expense.field_id == field_id)
        return sum((Decimal(str(row.amount)) for row in query.all()), Decimal("0"))

    def calculate(self, payload):
        cost = self.total_expenses(payload.crop_id, payload.field_id)
        revenue, profit, margin, break_even = calculate_profitability(payload.predicted_yield, payload.expected_price, cost)
        record = ProfitabilityRecord(user_id=self.user_id, farm_id=payload.farm_id, field_id=payload.field_id, crop_id=payload.crop_id, predicted_yield=payload.predicted_yield, expected_price=payload.expected_price, total_cost=cost, expected_revenue=revenue, expected_profit=profit, profit_margin=margin, break_even_price=break_even)
        self.db.add(record); self.db.commit(); self.db.refresh(record)
        return record

    def list(self, crop_id=None):
        query = self.db.query(ProfitabilityRecord).filter(ProfitabilityRecord.user_id == self.user_id)
        if crop_id is not None: query = query.filter(ProfitabilityRecord.crop_id == crop_id)
        return query.order_by(ProfitabilityRecord.created_at.desc()).all()


def risk_level(score):
    return "LOW" if score < 34 else "MEDIUM" if score < 67 else "HIGH"


class RiskService:
    def __init__(self, db: Session, user_id: int): self.db, self.user_id = db, user_id

    def assess(self, payload):
        values = {"disease": payload.disease_signal or 0, "yield": payload.yield_risk_signal or 0, "market": payload.market_volatility or 0, "financial": payload.expense_deviation or 0}
        score = round(sum(values.values()) / len(values), 2)
        levels = {key: risk_level(value) for key, value in values.items()}
        explanation = "; ".join(f"{key.title()} risk is {levels[key]} based on a score of {value:.1f}" for key, value in values.items()) + "."
        record = RiskAssessment(user_id=self.user_id, farm_id=payload.farm_id, field_id=payload.field_id, crop_id=payload.crop_id, disease_risk=levels["disease"], yield_risk=levels["yield"], market_risk=levels["market"], financial_risk=levels["financial"], overall_risk=risk_level(score), risk_score=score, explanation=explanation)
        self.db.add(record); self.db.commit(); self.db.refresh(record)
        return record
