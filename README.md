# Task Manager

A full-stack task management application with a React + Vite frontend and a TypeScript + Express backend. The project is designed as two independently runnable services that communicate through HTTP APIs.

## Overview

This repository currently contains:

- A secure authentication flow with registration, login, and JWT-protected profile access
- A task dashboard for creating, editing, deleting, searching, and filtering tasks
- A backend that can use either MongoDB Atlas or an in-memory fallback store for local preview/development use
- A frontend that renders protected routes and consumes the API through a shared Axios client

## Tech Stack

### Frontend
- React 19
- Vite 6
- React Router
- Axios
- Tailwind CSS
- Lucide icons

### Backend
- Express 4
- TypeScript
- Mongoose
- MongoDB Atlas support
- JWT authentication using `jsonwebtoken`
- Password hashing using `bcryptjs`
- In-memory store fallback for environments where `MONGODB_URI` is not configured

## Current Project Structure

```text
Task-Manager/
├── backend/
│   ├── .env.example
│   ├── config/
│   │   ├── db.ts
│   │   └── memoryStore.ts
│   ├── controllers/
│   │   ├── authController.ts
│   │   └── taskController.ts
│   ├── middleware/
│   │   └── authMiddleware.ts
│   ├── models/
│   │   ├── Task.ts
│   │   └── User.ts
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   └── taskRoutes.ts
│   ├── package.json
│   └── server.ts
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       ├── index.css
│       └── main.tsx
└── README.md
```

## Environment Setup

### Backend environment

Copy the sample file in [backend/.env.example](backend/.env.example) to a real environment file such as `backend/.env` and fill in the values.

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/task-manager
JWT_SECRET=replace-with-a-long-random-secret
```

### Frontend environment

The frontend reads `VITE_API_URL` from the Vite environment when present. In normal development, the Vite proxy forwards `/api` requests to the backend automatically.

```env
VITE_API_URL=/api
```

## Running the App

### 1. Install dependencies

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Start the backend

```bash
cd backend
npm run dev
```

Backend server:
- Runs on `http://localhost:5000`
- Exposes `GET /api/health` and `GET /api/db-status`

### 3. Start the frontend

```bash
cd frontend
npm run dev
```

Frontend app:
- Runs on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile` (protected)

### Tasks

- `GET /api/tasks` (protected, supports `search` and `status` query params)
- `POST /api/tasks` (protected)
- `PUT /api/tasks/:id` (protected)
- `DELETE /api/tasks/:id` (protected)
- `PATCH /api/tasks/:id/status` (protected)

## Behavior Notes

- The backend initializes with `cors`, JSON parsing, and URL-encoded body support.
- The frontend uses a central Axios instance in [frontend/src/services/api.ts](frontend/src/services/api.ts) to attach the JWT token from `localStorage`.
- The Vite frontend proxy routes `/api/*` to `http://127.0.0.1:5000`, so the browser can use relative API paths during development.
- If `MONGODB_URI` is missing or invalid, the backend automatically falls back to the in-memory store and continues working in preview/dev mode.

## Build Commands

### Backend

```bash
cd backend
npm run build
npm run start
```

### Frontend

```bash
cd frontend
npm run build
```

## Notes

- The app currently follows a split-service architecture rather than a single root server.
- Normal development uses one terminal for the backend and another terminal for the frontend.
- The dashboard UI includes search, status filtering, task cards, and completion statistics.
