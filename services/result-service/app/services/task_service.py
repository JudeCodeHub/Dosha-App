import random
from datetime import date
from sqlalchemy.orm import Session
from app.models.task import TaskTracking
from app.constants.tasks import TASK_TEMPLATES


def generate_weighted_tasks(
    db: Session, user_id: str, category: str, vata: float, pitta: float, kapha: float
):
    """
    Generates personalized tasks based on weighted dosha percentages.
    Includes fallback logic to ensure tasks are always returned.
    """
    today = date.today()
    
    try:
        # 1. Check for existing tasks
        existing = (
            db.query(TaskTracking)
            .filter(
                TaskTracking.id > 0, # Optimization hint
                TaskTracking.user_id == str(user_id),
                TaskTracking.category == str(category),
                TaskTracking.date == today,
            )
            .all()
        )

        if existing:
            return existing

        # 2. Preparation
        task_pool_dict = TASK_TEMPLATES.get(category, {})
        if not task_pool_dict:
            return [] # Should not happen with valid categories

        scores = {"vata": float(vata), "pitta": float(pitta), "kapha": float(kapha)}
        total_score = sum(scores.values())
        if total_score <= 0:
            scores = {"vata": 33.3, "pitta": 33.3, "kapha": 33.4}
            
        dosha_keys = list(scores.keys())
        dosha_weights = [scores[k] for k in dosha_keys]

        selections = []
        generated_names = set()
        
        # Guard against infinite loops with a retry limit
        max_attempts = 50
        attempts = 0
        
        while len(selections) < 5 and attempts < max_attempts:
            attempts += 1
            # Pick dosha bucket
            chosen_dosha = random.choices(dosha_keys, weights=dosha_weights, k=1)[0]
            pool = task_pool_dict.get(chosen_dosha, [])
            
            if not pool:
                continue
                
            task_text = random.choice(pool)
            if task_text not in generated_names:
                generated_names.add(task_text)
                task_obj = TaskTracking(
                    user_id=str(user_id),
                    category=str(category),
                    task_name=task_text,
                    date=today,
                    completed=False
                )
                selections.append(task_obj)

        # 3. Save and return
        if selections:
            db.add_all(selections)
            db.commit()
            for task in selections:
                db.refresh(task)
            return selections
        
        return []

    except Exception as e:
        print(f"Error generating tasks: {e}")
        db.rollback()
        return []


def update_task_status(db: Session, user_id: str, task_id: int, completed: bool):
    """Updates the completion status of a specific task."""
    task = (
        db.query(TaskTracking)
        .filter(TaskTracking.id == task_id, TaskTracking.user_id == user_id)
        .first()
    )
    if task:
        task.completed = completed
        db.commit()
        db.refresh(task)
    return task

def reset_today_tasks(db: Session, user_id: str):
    """Deletes all tasks generated today for a user, forcing a fresh generation."""
    try:
        deleted = db.query(TaskTracking).filter(
            TaskTracking.user_id == str(user_id),
            TaskTracking.date == date.today()
        ).delete()
        db.commit()
        return deleted
    except Exception as e:
        db.rollback()
        print(f"Error resetting tasks: {e}")
        return 0
