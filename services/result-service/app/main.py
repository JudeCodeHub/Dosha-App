from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import engine
from app.models import Base
from app.routers import quiz, recommendations, tasks

load_dotenv()

from sqlalchemy import text

Base.metadata.create_all(bind=engine)

def seed_recommendations():
    try:
        with engine.connect() as conn:
            import os
            filepath = 'seed_recommendations.sql'
            if not os.path.exists(filepath):
                filepath = '../seed_recommendations.sql' # fallback if run from app/ dir directly
            with open(filepath, 'r', encoding='utf-8') as f:
                sql = f.read()
                conn.execute(text(sql))
                conn.commit()
            print("Recommendations seeded automatically on startup.")
    except Exception as e:
        print("Failed to auto-seed recommendations:", e)
# Auto-seed the new highly personalized user recommendations
seed_recommendations()

app = FastAPI(
    title="MarinZen Result Service",
    description=(
        "Service for tracking behavior, calculating Dosha results, "
        "and providing recommendations"
    ),
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(quiz.router)
app.include_router(recommendations.router)
app.include_router(tasks.router)


@app.get("/")
def read_root():
    """Health check endpoint for the Result Service."""
    return {
        "message": "Result Service v2.0 is running with Task Tracking support"
    }
