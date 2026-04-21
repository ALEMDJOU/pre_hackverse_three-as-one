from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.user import UserOut, UserUpdate
from crud.user import update_user_profile
import base64

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/me", response_model=UserOut)
def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserOut)
def update_profile(
    user_update: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    updated = update_user_profile(db, current_user.id, user_update)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@router.post("/me/photo")
async def upload_profile_photo(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    content = await file.read()
    base64_photo = base64.b64encode(content).decode("utf-8")
    # Préfixe data URL pour que le frontend l'affiche facilement
    data_url = f"data:{file.content_type};base64,{base64_photo}"

    update_user_profile(db, current_user.id, UserUpdate(profile_photo=data_url))
    return {"profile_photo": data_url}