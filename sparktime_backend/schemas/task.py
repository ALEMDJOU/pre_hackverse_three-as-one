from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.task import Priority, Status

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    status: Status = Status.TODO
    due_date: Optional[datetime] = None
    estimated_minutes: int = 60

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None
    due_date: Optional[datetime] = None
    estimated_minutes: Optional[int] = None

class TaskOut(TaskBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True