"""
Profitability & Risk analysis engine for Module 11.
Combines cost estimates, expected yields, market prices, and risk factors.
"""
from __future__ import annotations
from typing import Dict, Any, Tuple


def analyze_profitability_and_risk(
    crop_name: str,
    area: float,
    estimated_cost: float,
    expected_yield_per_ha: float | None = None,
    expected_market_price: float | None = None,
) -> Tuple[float, float, float, str, float, float, float, Dict[str, Any], str]:
    """
    Returns:
    (projected_revenue, projected_profit, roi_percent, overall_risk_score, disease_risk, price_volatility, weather_risk, risk_breakdown, recommendations)
    """
    # Baseline fallback values
    yield_ha = expected_yield_per_ha or 3.5  # tonnes/ha
    # Convert tonnes to quintals (1 tonne = 10 quintals)
    total_yield_quintals = yield_ha * area * 10
    
    price_per_quintal = expected_market_price or 2400.0  # ₹/quintal
    
    projected_revenue = round(total_yield_quintals * price_per_quintal, 2)
    projected_profit = round(projected_revenue - estimated_cost, 2)
    
    if estimated_cost > 0:
        roi_percent = round((projected_profit / estimated_cost) * 100, 2)
    else:
        roi_percent = 0.0

    # Risk Factor Calculations
    disease_risk = 0.25  # 25% risk factor
    price_volatility = 0.18  # 18% volatility
    weather_risk = 0.20  # 20% weather risk

    if roi_percent > 40 and disease_risk < 0.3:
        overall_risk = "LOW"
    elif roi_percent > 15:
        overall_risk = "MEDIUM"
    else:
        overall_risk = "HIGH"

    breakdown = {
        "cost_per_hectare": round(estimated_cost / area, 2) if area > 0 else estimated_cost,
        "revenue_per_hectare": round(projected_revenue / area, 2) if area > 0 else projected_revenue,
        "disease_risk_impact": "Low to Moderate. Follow recommended preventive spraying schedules.",
        "market_volatility_impact": "Stable demand forecasted for harvest window.",
        "break_even_price_per_quintal": round(estimated_cost / (total_yield_quintals or 1), 2),
    }

    recommendations = (
        f"Based on total projected revenue of ₹{projected_revenue:,.2f} against estimated input costs of ₹{estimated_cost:,.2f}, "
        f"this crop lifecycle shows an expected ROI of {roi_percent}%. Overall Risk Level is categorized as {overall_risk}. "
        "Recommend maintaining crop insurance coverage and monitoring market price trends prior to harvest."
    )

    return (
        projected_revenue,
        projected_profit,
        roi_percent,
        overall_risk,
        disease_risk,
        price_volatility,
        weather_risk,
        breakdown,
        recommendations,
    )
