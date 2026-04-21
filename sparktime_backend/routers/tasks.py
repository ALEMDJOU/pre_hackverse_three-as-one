from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from dependencies import get_current_user
from models.user import User
from schemas.task import TaskCreate, TaskUpdate, TaskOut
from crud.task import create_task, get_tasks, get_task, update_task, delete_task

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.post("/", response_model=TaskOut)
def create_new_task(task: TaskCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return create_task(db, task, current_user.id)

@router.get("/", response_model=list[TaskOut])
def read_tasks(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_tasks(db, current_user.id, skip, limit)

@router.get("/{task_id}", response_model=TaskOut)
def read_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    task = get_task(db, task_id, current_user.id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.put("/{task_id}", response_model=TaskOut)
def update_existing_task(task_id: int, task: TaskUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated = update_task(db, task_id, current_user.id, task)
    if not updated:
        raise HTTPException(status_code=404, detail="Task not found")
    return updated

@router.delete("/{task_id}")
def delete_existing_task(task_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not delete_task(db, task_id, current_user.id):
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}