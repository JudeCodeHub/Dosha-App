import os
import httpx
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="MarinZen API Gateway",
    description="Main entry point for MarinZen microservices",
    version="1.1.0"
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
AUTH_SERVICE_URL = os.getenv("AUTH_SERVICE_URL")
QUIZ_SERVICE_URL = os.getenv("QUIZ_SERVICE_URL")
RESULT_SERVICE_URL = os.getenv("RESULT_SERVICE_URL")

# Basic validation (optional but recommended)
if not all([AUTH_SERVICE_URL, QUIZ_SERVICE_URL, RESULT_SERVICE_URL]):
    # Provide local defaults if not set in environment (for easier development)
    AUTH_SERVICE_URL = AUTH_SERVICE_URL or "http://127.0.0.1:8003"
    QUIZ_SERVICE_URL = QUIZ_SERVICE_URL or "http://127.0.0.1:8001"
    RESULT_SERVICE_URL = RESULT_SERVICE_URL or "http://127.0.0.1:8002"


@app.get("/")
def read_root():
    """Health check endpoint for the API Gateway."""
    return {"message": "API Gateway is running"}

async def proxy_request(url: str, request: Request):
    """Generic proxy handler for service-to-service communication."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        method = request.method
        content = await request.body()
        headers = dict(request.headers)
        
        # Remove host header to avoid issues with target service
        headers.pop("host", None)
        
        try:
            response = await client.request(
                method,
                url,
                content=content,
                headers=headers,
                params=request.query_params
            )
            return JSONResponse(
                content=response.json() if response.headers.get("content-type") == "application/json" else response.text,
                status_code=response.status_code
            )
        except httpx.RequestError as exc:
            raise HTTPException(status_code=503, detail=f"Service unavailable: {str(exc)}")
        except Exception as exc:
            raise HTTPException(status_code=500, detail=str(exc))

# Auth Service Proxy
@app.api_route("/auth/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_auth(path: str, request: Request):
    return await proxy_request(f"{AUTH_SERVICE_URL}/auth/{path}", request)

# Quiz Service Proxy
@app.api_route("/quiz/{path:path}", methods=["GET", "POST"])
async def proxy_quiz(path: str, request: Request):
    return await proxy_request(f"{QUIZ_SERVICE_URL}/{path}", request)

# Recommendations / Result Service Proxy
@app.api_route("/recommendations/{path:path}", methods=["GET", "POST"])
async def proxy_result(path: str, request: Request):
    return await proxy_request(f"{RESULT_SERVICE_URL}/recommendations/{path}", request)

# Backward Compatibility / Legacy Routes
@app.get("/api/questions")
async def get_questions(request: Request):
    return await proxy_request(f"{QUIZ_SERVICE_URL}/questions", request)

@app.post("/api/result")
async def calculate_result(request: Request):
    return await proxy_request(f"{RESULT_SERVICE_URL}/calculate-result", request)