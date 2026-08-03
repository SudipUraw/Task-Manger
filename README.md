# Task Manager

A full-stack task management app built with React, Vite, Express, TypeScript, and MongoDB Atlas. The current project runs from a single root server and serves the frontend through Vite middleware in development.

## Features

- Secure user registration and login
- JWT-based authenticated routes
- Protected task CRUD flows
- Search and status filtering
- Dashboard statistics and task overview
- MongoDB Atlas support with an in-memory preview fallback

## Tech Stack

- Frontend: React, Vite, React Router, Axios, Tailwind-style UI
- Backend: Express, TypeScript, Mongoose, JWT, bcryptjs
- Database: MongoDB Atlas

## Current Project Structure

```text
Task-Manager/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── backend/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   └── routes/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── services/
├── server.ts
├── .env.example
├── package.json
└── README.md
```

## Important Notes

- The active runtime is the root server in [server.ts](server.ts).
- The frontend source is under [src](src).
- The backend implementation used by the running app is under [src/backend](src/backend).
- Legacy duplicate folders such as the old standalone JavaScript backend and the split frontend workspace are no longer part of the active runtime.

## Environment Variables

Create a root `.env` file from the sample in `.env.example`:

```env
PORT=3000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
VITE_API_URL=/api
```

## Run the App

Install dependencies:

```bash
npm install
```

Start the development app:

```bash
npm run dev
```

The app will run at:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm run start
```

## API Overview

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Tasks
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`
- `PATCH /api/tasks/:id/status`

## Notes

- In development, the server uses Vite middleware to serve the React app.
- If `MONGODB_URI` is missing, the app will gracefully fall back to its in-memory preview database mode.
- The actual environment file for the current app should live at the repository root as `.env`.
