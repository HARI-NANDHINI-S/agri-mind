from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, RefreshTokenRequest
from app.schemas.response import success_response
from app.services.auth_service import AuthService
from app.core.dependencies import get_current_user
from app.schemas.user import UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=201)
def register(body: RegisterRequest, db: Session = Depends(get_db)):
    result = AuthService(db).register(body)
    return success_response(data=result, message="Registration successful")


@router.post("/login")
def login(body: LoginRequest, db: Session = Depends(get_db)):
    result = AuthService(db).login(body)
    return success_response(data=result, message="Login successful")


@router.post("/refresh")
def refresh(body: RefreshTokenRequest, db: Session = Depends(get_db)):
    result = AuthService(db).refresh(body.refresh_token)
    return success_response(data=result, message="Token refreshed")


@router.get("/me")
def me(current_user=Depends(get_current_user)):
    return success_response(data=UserResponse.model_validate(current_user), message="User retrieved")


@router.post("/logout")
def logout(current_user=Depends(get_current_user)):
    # Stateless JWT – client drops the token; server-side blacklist can be added later
    return success_response(message="Logged out successfully")
