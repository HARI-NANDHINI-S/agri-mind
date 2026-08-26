from fastapi import FastAPI
from fastapi.responses import JSONResponse
from app.api.routes import admin, assistant, expenses, finance, market, ml, notifications

app = FastAPI(title="Agrimind Backend - Dev2 Services", version="1.0.0")

app.include_router(expenses.router, prefix="/api/v1/expenses", tags=["expenses"])
app.include_router(market.router, prefix="/api/v1/market", tags=["market"])
app.include_router(ml.router, prefix="/api/v1/ml", tags=["machine-learning"])
app.include_router(finance.router, prefix="/api/v1/profitability", tags=["profitability"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["notifications"])
app.include_router(assistant.router, prefix="/api/v1/assistant", tags=["assistant"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])


@app.get("/health")
def health():
    return {"success": True, "message": "ok"}


@app.exception_handler(Exception)
async def unhandled_exception(_, __):
    return JSONResponse(status_code=500, content={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"})
