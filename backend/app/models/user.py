import uuid
import enum
from sqlalchemy import Column, String, Boolean, Enum, Index
from sqlalchemy.orm import relationship
from app.database.base import Base, TimestampMixin


class UserRole(str, enum.Enum):
    FARMER = "FARMER"
    ADMIN = "ADMIN"


class User(Base, TimestampMixin):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=False, index=True)
    hashed_password = Column(String(512), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=True)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.FARMER)
    is_active = Column(Boolean, default=True, nullable=False)
    profile_picture = Column(String(512), nullable=True)

    # Relationships
    farms = relationship("Farm", back_populates="owner", cascade="all, delete-orphan")
    crop_recommendations = relationship("CropRecommendation", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (Index("idx_users_email", "email"),)
