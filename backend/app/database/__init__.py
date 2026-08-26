from app.database.base import Base  # noqa: F401 – re-export so Alembic can discover models
from app.models import user, farm, field, crop, crop_history, disease_prediction, yield_prediction, crop_recommendation  # noqa: F401
