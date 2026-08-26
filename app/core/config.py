try:
    from pydantic_settings import BaseSettings
except ImportError:  # Compatibility for environments upgrading from Pydantic v1.
    from pydantic.v1 import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "mysql+pymysql://user:pass@localhost/agrimind"
    JWT_SECRET: str = "replace_me"
    JWT_ALGORITHM: str = "HS256"
    MODEL_PATH: str = "models/"
    VECTOR_DB_PATH: str = "./vector_db"
    LLM_API_KEY: str = ""
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
