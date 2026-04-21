from sqlalchemy.orm import Session
from models.user import User
from schemas.user import UserCreate, UserUpdate
from utils import get_password_hash

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        email=user.email,
        hashed_password=hashed_password,
        full_name=user.full_name,
        profile_photo=user.profile_photo  # ← ajouté
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_profile(db: Session, user_id: int, user_update: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None
    if user_update.full_name is not None:
        db_user.full_name = user_update.full_name
    if user_update.profile_photo is not None:
        db_user.profile_photo = user_update.profile_photo
    db.commit()
    db.refresh(db_user)
    return db_user