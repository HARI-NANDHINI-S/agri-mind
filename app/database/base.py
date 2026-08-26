from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# Import owned models so Alembic sees the complete Developer 2 metadata.
import app.models  # noqa: E402,F401
