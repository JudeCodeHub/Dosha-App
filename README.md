# MarinZen 🌿

MarinZen is a professional full-stack wellness application built on a microservices architecture. It helps users discover their Ayurvedic body constitution (Dosha) through an interactive quiz and provides personalized wellness recommendations, including diet, yoga, and lifestyle tips.

## 🏗️ Architecture Overview

The project follows a modern microservices pattern for scalability and separation of concerns.

```text
                                  +-------------------+
                                  |      Frontend     |
                                  |  (React + Vite)   |
                                  +---------+---------+
                                            |
                                            v
                                  +---------+---------+
                                  |   API Gateway     |
                                  |    (FastAPI)      |
                                  +----+----+----+----+
                                       |    |    |
            +--------------------------+    |    +--------------------------+
            |                               |                               |
            v                               v                               v
  +---------+---------+           +---------+---------+           +---------+---------+
  |   Quiz Service    |           |  Result Service   |           |   Auth Service    |
  |    (FastAPI)      |           |    (FastAPI)      |           |    (FastAPI)      |
  +-------------------+           +-------------------+           +-------------------+
```

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: FastAPI (Python), HTTPX (for service-to-service communication)
- **Database**: SQLAlchemy (supporting PostgreSQL/SQLite)
- **Authentication**: JWT (JSON Web Tokens)

## ✨ Features

- **Dosha Quiz**: A comprehensive assessment to determine your Vata, Pitta, and Kapha balance.
- **Personalized Dashboard**: View unique recommendations tailored to your dominant Dosha.
- **Wellness Insights**: Specialized tips for diet, yoga, skincare, and more.
- **User Authentication**: Secure signup and login to track your wellness journey.

## 📁 Project Structure

```text
marinzen/
├ frontend/              # React + Vite application
├ services/              # Microservices directory
│  ├ api-gateway/        # Main entry point and request router (Port 8000)
│  ├ quiz-service/       # Quiz question management (Port 8001)
│  ├ result-service/     # Result calculation and recommendations (Port 8002)
│  └ auth-service/       # User authentication and profiles (Port 8003)
├ .gitignore             # Unified project-wide ignore rules
└ README.md              # Project documentation
```

## 🛠️ Setup Instructions

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- npm or yarn

### 2. Environment Configuration
Each service requires its own `.env` file. A `.env.example` template is provided in each service directory and the frontend.

1. Copy the example files:
   ```bash
   cp frontend/.env.example frontend/.env
   cp services/api-gateway/.env.example services/api-gateway/.env
   # Repeat for other services
   ```
2. Update the `.env` files with your local configuration (e.g., `DATABASE_URL`, `SECRET_KEY`).

### 3. Backend Setup
For each service in `services/`:
```bash
cd services/<service-name>
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Frontend Setup
```bash
cd frontend
npm install
```

## ⏻ How to Run

### Start Backend Services
Run each service in a separate terminal:
```bash
# API Gateway
cd services/api-gateway
uvicorn app.main:app --reload --port 8000

# Quiz Service
cd services/quiz-service
uvicorn app.main:app --reload --port 8001

# Result Service
cd services/result-service
uvicorn app.main:app --reload --port 8002

# Auth Service
cd services/auth-service
uvicorn app.main:app --reload --port 8003
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📡 API Endpoints Overview

| Service | Endpoint | Method | Description |
|---------|----------|--------|-------------|
| **Gateway** | `/api/questions` | GET | Proxy to Quiz Service |
| **Gateway** | `/api/result` | POST | Proxy to Result Service |
| **Auth** | `/auth/signup` | POST | Register a new user |
| **Auth** | `/auth/login` | POST | Authenticate and get JWT |
| **Quiz** | `/questions` | GET | Fetch quiz questions |
| **Result** | `/calculate-result` | POST | Calculate dominant Dosha |
| **Result** | `/recommendations/{dosha}` | GET | Get specific recommendations |
