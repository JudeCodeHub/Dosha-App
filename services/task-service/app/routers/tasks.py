from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.core.auth import verify_access_token
from app.schemas.task import TaskRead, TaskUpdate
from app.services.task_service import (
    generate_weighted_tasks,
    update_task_status,
    reset_today_tasks,
)

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.delete("/reset")
def reset_daily_tasks(
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_access_token),
):
    """Deletes all tasks for the current day to allow fresh regeneration."""
    deleted = reset_today_tasks(db, user_id)
    return {"message": "Tasks reset successfully", "deleted": deleted}


@router.get("/{category}", response_model=List[TaskRead])
def get_daily_tasks(
    category: str,
    vata: float = Query(...),
    pitta: float = Query(...),
    kapha: float = Query(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_access_token),
):
    """
    Fetches today's tasks for the given category.
    If no tasks exist, generates them using the provided dosha scores.
    """
    if category not in ["diet", "yoga", "routine"]:
        raise HTTPException(status_code=400, detail="Invalid category")

    return generate_weighted_tasks(db, user_id, category, vata, pitta, kapha)


@router.patch("/{task_id}", response_model=TaskRead)
def toggle_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_access_token),
):
    """Updates the completion status of a task."""
    task = update_task_status(db, user_id, task_id, payload.completed)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task
