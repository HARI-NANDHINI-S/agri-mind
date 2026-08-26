from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # ── Database (SQLite default for zero-setup local run, MySQL supported via .env) ──
    DATABASE_URL: str = "sqlite:///./agrimind.db"

    # ── JWT ─────────────────────────────────────────────────────────────────
    JWT_SECRET_KEY: str = "change-this-secret-key-in-production-agrimind-secret-key-12345"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # ── App ─────────────────────────────────────────────────────────────────
    APP_ENV: str = "development"
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    FRONTEND_URL: str = "http://localhost:5173"

    # ── Media ────────────────────────────────────────────────────────────────
    MEDIA_ROOT: str = "media/uploads"
    MAX_UPLOAD_SIZE_MB: int = 10

    # ── ML ───────────────────────────────────────────────────────────────────
    ML_MODELS_DIR: str = "app/ml/models"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
