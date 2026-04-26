from datetime import date
import logging
from sqlalchemy.orm import Session
from app.constants.tasks import FALLBACK_TASKS
from app.models.task import TaskTracking
from app.services.ai_task_generator import generate_ai_tasks

logger = logging.getLogger(__name__)


def generate_fallback_tasks(
    category: str,
    vata: float,
    pitta: float,
    kapha: float,
) -> list[str]:
    """Return deterministic static tasks when AI generation is unavailable."""
    dosha_scores = {
        "vata": float(vata),
        "pitta": float(pitta),
        "kapha": float(kapha),
    }
    dominant = max(dosha_scores, key=dosha_scores.get)

    category_tasks = FALLBACK_TASKS.get(category, {})
    tasks = category_tasks.get(dominant, [])

    if tasks:
        return tasks[:5]

    # Last-resort defaults if category is unexpected.
    return [
        "Drink warm water and start mindfully",
        "Take a 20-minute mindful walk",
        "Eat fresh, balanced meals today",
        "Pause for 5 minutes deep breathing",
        "Sleep at a regular time tonight",
    ]


def generate_weighted_tasks(
    db: Session,
    user_id: str,
    category: str,
    vata: float,
    pitta: float,
    kapha: float,
    dosha: str = None,
):
    """
    Generates 5 personalized daily tasks via Gemini AI
    based on dosha percentages.
    Returns cached tasks if already generated today.
    """
    today = date.today()

    try:
        # 1. Return cached tasks if they already exist for today
        existing = (
            db.query(TaskTracking)
            .filter(
                TaskTracking.id > 0,
                TaskTracking.user_id == str(user_id),
                TaskTracking.category == str(category),
                TaskTracking.date == today,
            )
            .all()
        )

        if existing:
            return existing

        # 1.5 Check for seeded tasks matching the dosha profile
        seed_tasks = []
        if dosha:
            seed_tasks = (
                db.query(TaskTracking)
                .filter(
                    TaskTracking.user_id == 'seed',
                    TaskTracking.category == str(category),
                    TaskTracking.dosha == str(dosha).lower()
                )
                .all()
            )

        if seed_tasks:
            task_texts = [st.task_name for st in seed_tasks]
        else:
            # 2. Generate tasks via Gemini AI
            ai_task_texts = generate_ai_tasks(
                category,
                float(vata),
                float(pitta),
                float(kapha),
            )

            # 3. Fallback to static tasks if AI generation fails
            task_texts = ai_task_texts or generate_fallback_tasks(
                category,
                vata,
                pitta,
                kapha,
            )

        selections = [
            TaskTracking(
                user_id=str(user_id),
                category=str(category),
                task_name=task_text,
                date=today,
                completed=False,
                dosha=dosha,
            )
            for task_text in task_texts
        ]

        db.add_all(selections)
        db.commit()
        for task in selections:
            db.refresh(task)
        return selections

    except Exception as e:
        logger.error("Error generating tasks: %s", e)
        db.rollback()
        return []


def update_task_status(
    db: Session,
    user_id: str,
    task_id: int,
    completed: bool,
):
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
    """Deletes all tasks generated today for a user.

    This forces fresh generation on the next fetch.
    """
    try:
        deleted = db.query(TaskTracking).filter(
            TaskTracking.user_id == str(user_id),
            TaskTracking.date == date.today()
        ).delete()
        db.commit()
        return deleted
    except Exception as e:
        db.rollback()
        logger.error("Error resetting tasks: %s", e)
        return 0
