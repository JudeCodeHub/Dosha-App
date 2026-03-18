import os
import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="MarinZen API Gateway",
    description="Main entry point for MarinZen microservices",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
QUIZ_SERVICE_URL = os.getenv("QUIZ_SERVICE_URL", "http://127.0.0.1:8001")
RESULT_SERVICE_URL = os.getenv("RESULT_SERVICE_URL", "http://127.0.0.1:8002")

@app.get("/")
def read_root():
    """Health check endpoint for the API Gateway."""
    return {"message": "API Gateway is running"}

@app.get("/api/questions")
async def get_questions():
    """Proxies request to the Quiz Service to fetch questions."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{QUIZ_SERVICE_URL}/questions")
            response.raise_for_status()
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=500, detail="Quiz service is unavailable")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)

@app.post("/api/result")
async def calculate_result(payload: dict):
    """Proxies request to the Result Service to calculate dosha result."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.post(f"{RESULT_SERVICE_URL}/calculate-result", json=payload)
            response.raise_for_status()
            return response.json()
    except httpx.RequestError:
        raise HTTPException(status_code=500, detail="Result service is unavailable")
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail=e.response.text)