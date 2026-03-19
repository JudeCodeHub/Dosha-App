# MarinZen 🌿

MarinZen is a professional full-stack wellness application built on a microservices architecture. It helps users discover their Ayurvedic body constitution (Dosha) through an interactive quiz and provides personalized wellness recommendations, including diet, yoga, and lifestyle tips.

## 🏗️ Architecture Overview

The project follows a clean microservices pattern where the **Frontend** communicates exclusively with the **API Gateway**.

```text
                                  +-------------------+
                                  |      Frontend     |
                                  |  (React + Vite)   |
                                  +---------+---------+
                                            |
                                            v (Port 8000)
                                  +---------+---------+
                                  |   API Gateway     |
                                  |    (FastAPI)      |
                                  +----+----+----+----+
                                       |    |    |
            +--------------------------+    |    +--------------------------+
            |                               |                               |
            v (Port 8001)                   v (Port 8002)                   v (Port 8003)
  +---------+---------+           +---------+---------+           +---------+---------+
  |   Quiz Service    |           |  Result Service   |           |   Auth Service    |
  |    (FastAPI)      |           |    (FastAPI)      |           |    (FastAPI)      |
  +-------------------+           +-------------------+           +-------------------+
```

## 🚀 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend**: FastAPI (Python), SQLModel/SQLAlchemy
- **Database**: PostgreSQL (Neon) or SQLite (Local)
- **Authentication**: JWT (JSON Web Tokens)

## 🛠️ Setup Instructions

### 1. Prerequisites

- **Python 3.9+**
- **Node.js 18+**
- **PostgreSQL** (Optional, falls back to SQLite by default)

### 2. Environment Configuration

Each service requires a `.env` file to function.

1. Use the `.env.example` in the root or each subdirectory as a template.
2. **Key Variable**: Ensure `SECRET_KEY` is consistent across `auth-service` and `result-service`.
3. **Frontend**: Only `VITE_API_GATEWAY_URL` (Port 8000) is required for the frontend.

### 3. Backend Setup

For each service in `services/` (`api-gateway`, `auth-service`, `quiz-service`, `result-service`):

```bash
cd services/<service-name>
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 4. Data Seeding (Required)

The dashboard recommendations require initial data. Run the seed script once your `result-service` environment is set up:

```bash
cd services/result-service
python seed_recommendations.py
```

### 5. Frontend Setup

```bash
cd frontend
npm install
```

## ⏻ How to Run

To run the full stack, you must start the backend services first, followed by the frontend.

### 1. Start Microservices

Open 4 separate terminals and run:

| Service | Command (from service directory) | Port |
| :--- | :--- | :--- |
| **API Gateway** | `uvicorn app.main:app --reload --port 8000` | 8000 |
| **Quiz Service** | `uvicorn app.main:app --reload --port 8001` | 8001 |
| **Result Service** | `uvicorn app.main:app --reload --port 8002` | 8002 |
| **Auth Service** | `uvicorn app.main:app --reload --port 8003` | 8003 |

### 2. Start Frontend

```bash
cd frontend
npm run dev
```

The app will be live at `http://localhost:5173`.

## 📡 API Proxy Strategy
The **API Gateway** acts as a reverse proxy. The frontend should never call internal services (8001-8003) directly.

- `/auth/*` -> Proxied to Auth Service
- `/quiz/*` -> Proxied to Quiz Service
- `/recommendations/*` -> Proxied to Result Service
