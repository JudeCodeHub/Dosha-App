import os
from datetime import datetime, timezone, timedelta
from typing import List, Literal

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from app.database import get_db, engine
from app.models import Recommendation, Base
from app.history_model import UserHistory

# Load environment variables
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY must be set in the environment")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def verify_access_token(token: str = Depends(oauth2_scheme)) -> str:
    """Verifies the JWT access token and returns the user ID."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

app = FastAPI(
    title="MarinZen Result Service",
    description="Service for calculating Dosha results and providing recommendations",
    version="1.0.0"
)

@app.on_event("startup")
def on_startup():
    """Initializes the database on startup."""
    Base.metadata.create_all(bind=engine)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Answer(BaseModel):
    dosha: Literal["Vata", "Pitta", "Kapha"]

class QuizSubmission(BaseModel):
    answers: List[Answer]

@app.get("/")
def read_root():
    """Health check endpoint for the Result Service."""
    return {"message": "Result Service is running"}

@app.get("/recommendations/{dosha}")
def get_recommendations(dosha: str, db: Session = Depends(get_db), user_id: str = Depends(verify_access_token)):
    """Fetches personalized recommendations based on the user's dominant Dosha."""
    dosha_lower = dosha.lower()
    row = db.query(Recommendation).filter(Recommendation.dosha == dosha_lower).first()
    
    if not row:
        return {}
        
    data = {
        "diet": row.diet,
        "yoga": row.yoga,
        "skincare": row.skincare,
        "haircare": row.haircare,
        "herbs": row.herbs,
        "routine": row.routine,
    }
    
    # Record history — fail silently so a DB error never breaks the recommendation response
    try:
        now = datetime.now(timezone.utc)
        cutoff = now - timedelta(seconds=60)
        recent = (
            db.query(UserHistory)
            .filter(
                UserHistory.user_id == str(user_id),
                UserHistory.dosha == dosha_lower,
                UserHistory.event_type == "recommendations_viewed",
                UserHistory.created_at >= cutoff,
            )
            .first()
        )
        if not recent:
            db.add(UserHistory(
                user_id=str(user_id),
                dosha=dosha_lower,
                event_type="recommendations_viewed",
            ))
            db.commit()
    except Exception:
        db.rollback()
        
    return data

@app.post("/calculate-result")
def calculate_result(submission: QuizSubmission):
    """Calculates the Dosha percentages based on quiz answers."""
    counts = {
        "Vata": 0,
        "Pitta": 0,
        "Kapha": 0
    }

    for answer in submission.answers:
        counts[answer.dosha] += 1

    total = len(submission.answers)

    if total == 0:
        return {
            "counts": counts,
            "percentages": {"Vata": 0, "Pitta": 0, "Kapha": 0},
            "dominant_dosha": None
        }

    percentages = {
        "Vata": round((counts["Vata"] / total) * 100, 2),
        "Pitta": round((counts["Pitta"] / total) * 100, 2),
        "Kapha": round((counts["Kapha"] / total) * 100, 2)
    }

    dominant_dosha = max(counts, key=counts.get)

    return {
        "counts": counts,
        "percentages": percentages,
        "dominant_dosha": dominant_dosha
    }