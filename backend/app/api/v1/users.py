from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.core.dependencies import get_current_user
from app.repositories.user_repo import UserRepository
from app.schemas.user import UserProfileUpdate, PasswordChange, UserResponse
from app.schemas.response import success_response
from app.core.security import verify_password
from fastapi import HTTPException, status

router = APIRouter(prefix="/users", tags=["Users"])


@router.put("/profile")
def update_profile(body: UserProfileUpdate, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    repo = UserRepository(db)
    updated = repo.update(current_user, **body.model_dump(exclude_none=True))
    return success_response(data=UserResponse.model_validate(updated), message="Profile updated")


@router.put("/password")
def change_password(body: PasswordChange, db: Session = Depends(get_db), current_user=Depends(get_current_user)):
    if not verify_password(body.current_password, current_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")
    repo = UserRepository(db)
    repo.update_password(current_user, body.new_password)
    return success_response(message="Password changed successfully")
