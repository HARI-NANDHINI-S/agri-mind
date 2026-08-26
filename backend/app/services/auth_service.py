from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import verify_password, create_access_token, create_refresh_token, decode_token, verify_token_type
from app.repositories.user_repo import UserRepository
from app.schemas.auth import RegisterRequest, LoginRequest
from app.schemas.user import UserResponse
from jose import JWTError


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register(self, data: RegisterRequest) -> dict:
        existing = self.user_repo.get_by_email(data.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists",
            )
        user = self.user_repo.create(
            email=data.email,
            password=data.password,
            full_name=data.full_name,
            phone_number=data.phone_number,
        )
        tokens = self._generate_tokens(user)
        return {"user": UserResponse.model_validate(user), **tokens}

    def login(self, data: LoginRequest) -> dict:
        user = self.user_repo.get_by_email(data.email)
        if not user or not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        if not user.is_active:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is inactive")
        tokens = self._generate_tokens(user)
        return {"user": UserResponse.model_validate(user), **tokens}

    def refresh(self, refresh_token: str) -> dict:
        try:
            payload = decode_token(refresh_token)
            if not verify_token_type(payload, "refresh"):
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
            user_id = payload.get("sub")
            user = self.user_repo.get_by_id(user_id)
            if not user or not user.is_active:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
            return self._generate_tokens(user)
        except JWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired refresh token")

    def _generate_tokens(self, user) -> dict:
        access = create_access_token({"sub": user.id, "role": user.role})
        refresh = create_refresh_token({"sub": user.id})
        return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}
