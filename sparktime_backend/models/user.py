from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database import Base
from models.task import Task  # import ici pour la relation

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    profile_photo = Column(String, nullable=True)  # Base64 de l'image
    is_active = Column(Boolean, default=True)

    tasks = relationship("Task", back_populates="owner", cascade="all, delete-orphan")