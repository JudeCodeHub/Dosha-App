# MarinZen 🌿 

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

MarinZen is a modern, full-stack wellness application built on a **scalable microservices architecture**. It helps users discover their Ayurvedic body constitution (Dosha - Vata, Pitta, Kapha) through an interactive assessment and provides personalized wellness, diet, and lifestyle recommendations.

It natively supports dynamic, real-time **Bilingual i18n Translation (English & Tamil)** across both the React frontend and Python backend endpoints.

---

## ✨ Features
- **Prakriti Quiz Engine**: 21-question fast assessment tool to determine your primary Dosha.
- **Microservices Backend**: Dedicated, containerized FastAPI services orchestrating Routing, Authentication, Quizzes, and Result generation.
- **Bilingual Support (Tamil & English)**: Real-time UI updates and backend payload transitions using custom HTTP `X-Language` headers and `react-i18next`.
- **JWT Authentication**: Secure user login and registration protocols using encrypted tokens.
- **Responsive Glassmorphism UI**: High-end UX utilizing TailwindCSS variants and Lucide icons.

## 🏗️ Architecture Overview

The project relies entirely on **Docker Compose** to run distinct microservices. The Frontend only speaks to the **API Gateway**, which securely reverse-proxies requests into the internal Docker network.

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
                       (Internal Docker Network strictly isolating sub-services)
```

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, `react-i18next`, `lucide-react`
- **Backend / Microservices**: FastAPI, Uvicorn (Python)
- **Data Persistence**: SQLAlchemy / SQLModel, Neon Serverless PostgreSQL instances (or local SQLite)
- **Containerization**: Docker & Docker Compose

---

## 🛠️ Step-by-Step Setup Instructions

Anyone can securely clone and boot this environment locally. 

### 1. Prerequisites
- **Docker** and **Docker Compose** installed.
- **Node.js (v18+)** installed.
- **A PostgreSQL instance URI** (Local or Cloud like NeonDB).

### 2. Clone the Repository
```bash
git clone https://github.com/your-username/prakriti-dosha.git
cd prakriti-dosha
```

### 3. Environment Configuration
You need to establish `.env` files for the microservices requiring database or security keys. Create these `.env` files in their respective subsystem folders:

**`services/auth-service/.env`**
```env
# Change secret to a long random hash in production
SECRET_KEY="your-super-secret-key-12345"
DATABASE_URL="postgresql://user:pass@host/dbname"
```

**`services/result-service/.env`**
```env
# Must identically match auth-service for JWT token validation
SECRET_KEY="your-super-secret-key-12345"
DATABASE_URL="postgresql://user:pass@host/dbname"
```

**`frontend/.env`**
```env
VITE_API_GATEWAY_URL="http://localhost:8000"
```

### 4. Boot Microservices (Docker)
Ensure Docker daemon is running, execute the following from the root directory to generate the python images and boot the proxy.
```bash
docker compose up --build -d
```
All python services employ auto-reloading (`--reload` with volume mounts) so that codebase edits inherently reflect live.

### 5. Seed Bilingual Recommendations (Required)
The dashboard strictly requires existing records in the database to map Dosha suggestions. We run the native seed script from *inside* the active Docker container to push data to Postgres:
```bash
docker compose exec result-service python seed_recommendations.py
```
> *This automatically drops old schema structures, builds composite Multi-Language indexes natively into Postgres, and populates 6 distinct entries (3 Doshas x 2 Languages).*

### 6. Boot Frontend Client
In a new terminal, launch the Vite dev server:
```bash
cd frontend
npm install
npm run dev
```

The application is now live at `http://localhost:5173`. 

---

## 📡 Gateway Routing Table
Our API Gateway intelligently isolates logic. If you are developing and hit `http://localhost:8000`:

| Proxy Endpoint | Internal Destination Service | Purpose |
| :--- | :--- | :--- |
| **`/auth/*`** | Auth Service (Port 8003) | JWT creation, User Profiles |
| **`/api/questions`** | Quiz Service (Port 8001) | Bilingual Array processing |
| **`/recommendations/*`** | Result Service (Port 8002) | PostgreSQL recommendations fetch |

> **Note on Languages**: All GET/POST endpoints that deliver text data read for the custom `X-Language` header flag sent natively by the Frontend (`en` or `ta`).
