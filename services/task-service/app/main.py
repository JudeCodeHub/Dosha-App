from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import engine
from app.models import Base
from app.routers import tasks

load_dotenv()

from sqlalchemy import text

Base.metadata.create_all(bind=engine)

def seed_tasks():
    try:
        with engine.connect() as conn:
            try:
                conn.execute(text("ALTER TABLE task_tracking ADD COLUMN dosha VARCHAR;"))
                conn.commit()
                print("Added dosha column.")
            except Exception:
                conn.rollback()

            import os
            filepath = 'seed_tasks.sql'
            if not os.path.exists(filepath):
                filepath = '../seed_tasks.sql'
            with open(filepath, 'r', encoding='utf-8') as f:
                sql = f.read()
                conn.execute(text(sql))
                conn.commit()
            print("Tasks seeded automatically on startup.")
    except Exception as e:
        print("Failed to auto-seed tasks:", e)

seed_tasks()

app = FastAPI(
    title="MarinZen Task Service",
    description=(
        "Dedicated microservice for daily personalized "
        "task generation and tracking"
    ),
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)


@app.get("/")
def read_root():
    """Health check endpoint for the Task Service."""
    return {"message": "Task Service v1.0 is running"}
