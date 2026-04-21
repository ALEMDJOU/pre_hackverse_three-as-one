from sqlalchemy.orm import Session
from models.task import Task
from schemas.task import TaskCreate, TaskUpdate

def create_task(db: Session, task: TaskCreate, owner_id: int):
    db_task = Task(**task.model_dump(), owner_id=owner_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def get_tasks(db: Session, owner_id: int, skip: int = 0, limit: int = 100):
    return db.query(Task).filter(Task.owner_id == owner_id).offset(skip).limit(limit).all()

def get_task(db: Session, task_id: int, owner_id: int):
    return db.query(Task).filter(Task.id == task_id, Task.owner_id == owner_id).first()

def update_task(db: Session, task_id: int, owner_id: int, task_update: TaskUpdate):
    db_task = get_task(db, task_id, owner_id)
    if not db_task:
        return None
    for key, value in task_update.model_dump(exclude_unset=True).items():
        setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, owner_id: int):
    db_task = get_task(db, task_id, owner_id)
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False