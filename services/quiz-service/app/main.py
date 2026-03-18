from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.questions import questions

app = FastAPI(
    title="MarinZen Quiz Service",
    description="Service for managing and providing Dosha quiz questions",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    """Health check endpoint for the Quiz Service."""
    return {"message": "Quiz Service is running"}

@app.get("/questions")
def get_questions():
    """Returns the list of Dosha quiz questions."""
    return {"questions": questions}
