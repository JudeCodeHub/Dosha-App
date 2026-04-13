from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.database import engine
from app.models import Base
from app.routers import tasks

load_dotenv()

Base.metadata.create_all(bind=engine)

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
