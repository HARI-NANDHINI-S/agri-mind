from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.database.session import engine
from app.database.base import Base

# ── Import all models so Alembic & SQLAlchemy can detect them ───────────────
import app.models  # noqa: F401

# ── Auto-create DB tables on startup for local run ──────────────────────────
Base.metadata.create_all(bind=engine)

# ── Routers ──────────────────────────────────────────────────────────────────
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.farms import router as farms_router
from app.api.v1.fields import router as fields_router
from app.api.v1.crops import router as crops_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.ml.crop_recommendation import router as rec_router
from app.api.v1.ml.disease_detection import router as disease_router
from app.api.v1.ml.yield_prediction import router as yield_router
from app.api.v1.financial import router as financial_router
from app.api.v1.market import router as market_router
from app.api.v1.ml.price_prediction import router as price_pred_router
from app.api.v1.ml.profitability_risk import router as prof_risk_router
from app.api.v1.assistant import router as assistant_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.admin import router as admin_router

app = FastAPI(
    title="AgriMind API",
    description="AI-powered agricultural decision-support platform",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# ── CORS ─────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Static media files ───────────────────────────────────────────────────────
os.makedirs(settings.MEDIA_ROOT, exist_ok=True)
app.mount("/media", StaticFiles(directory=settings.MEDIA_ROOT), name="media")

# ── Global exception handler ─────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error", "error_code": "INTERNAL_ERROR"},
    )

# ── API v1 routes ─────────────────────────────────────────────────────────────
PREFIX = "/api/v1"
app.include_router(auth_router, prefix=PREFIX)
app.include_router(users_router, prefix=PREFIX)
app.include_router(farms_router, prefix=PREFIX)
app.include_router(fields_router, prefix=PREFIX)
app.include_router(crops_router, prefix=PREFIX)
app.include_router(dashboard_router, prefix=PREFIX)
app.include_router(rec_router, prefix=PREFIX)
app.include_router(disease_router, prefix=PREFIX)
app.include_router(yield_router, prefix=PREFIX)
app.include_router(financial_router, prefix=PREFIX)
app.include_router(market_router, prefix=PREFIX)
app.include_router(price_pred_router, prefix=PREFIX)
app.include_router(prof_risk_router, prefix=PREFIX)
app.include_router(assistant_router, prefix=PREFIX)
app.include_router(notifications_router, prefix=PREFIX)
app.include_router(admin_router, prefix=PREFIX)


@app.get("/health")
def health_check():
    return {"status": "ok", "version": "1.0.0"}
