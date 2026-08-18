from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User
from app.core.security import hash_password


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    def create(self, email: str, password: str, full_name: str, phone_number: Optional[str] = None) -> User:
        user = User(
            email=email,
            hashed_password=hash_password(password),
            full_name=full_name,
            phone_number=phone_number,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update(self, user: User, **kwargs) -> User:
        for key, value in kwargs.items():
            if value is not None:
                setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_password(self, user: User, new_password: str) -> User:
        user.hashed_password = hash_password(new_password)
        self.db.commit()
        self.db.refresh(user)
        return user
