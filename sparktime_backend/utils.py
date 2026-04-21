# utils.py (version corrigée pour tes 12h)
from datetime import datetime, timedelta
from jose import JWTError, jwt
import bcrypt
from schemas.auth import TokenData
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-me-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7

def get_password_hash(password: str) -> str:
    """Tronque le mot de passe à 72 bytes (limite bcrypt)"""
    encoded_pw = password.encode('utf-8')
    if len(encoded_pw) > 72:
        encoded_pw = encoded_pw[:72]
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(encoded_pw, salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    encoded_pw = plain_password.encode('utf-8')
    if len(encoded_pw) > 72:
        encoded_pw = encoded_pw[:72]
    return bcrypt.checkpw(encoded_pw, hashed_password.encode('utf-8'))

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> TokenData | None:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return TokenData(email=email)
    except JWTError:
        return None