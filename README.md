# MERN Stack Task Manager Application

A modern, full-stack Task Management Web Application built using MongoDB, Express.js, React, and Node.js (MERN stack) with Tailwind CSS for clean UI styling and JWT for user authentication.

---

## 🚀 Features

- **User Authentication**:
  - Secure Registration & Login with bcrypt password hashing
  - JWT (JSON Web Token) authentication stored in `localStorage`
  - Protected API routes and client-side route guards
  - User profile display & logout functionality
- **Task Management (CRUD)**:
  - Create new tasks with title, description, due date, and status
  - View tasks organized cleanly on a modern dashboard
  - Edit task details
  - Delete tasks
  - Quick toggle task status between **Pending** and **Completed**
- **Search & Filtering**:
  - Real-time task search by title or description
  - Filter tasks by status (**All**, **Pending**, **Completed**)
- **Dashboard Overview**:
  - Personal welcome greeting
  - Task statistics summary cards (Total Tasks, Completed Tasks, Pending Tasks)
  - Recent tasks view
- **Handcrafted UI/UX**:
  - Responsive layout for desktop and mobile
  - Soft shadows, rounded cards, and clean typography
  - Toast notifications for user feedback
  - Loading skeletons, empty state displays, and error handling

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- **React Router DOM v7**
- **Axios** for HTTP API calls
- **Tailwind CSS** for responsive styling
- **Lucide React** for icons

### Backend
- **Node.js** & **Express.js**
- **MongoDB Atlas** & **Mongoose** ORM
- **JSON Web Token (JWT)**
- **bcryptjs** for password encryption
- **cors** & **dotenv**

---

## 📁 Folder Structure

```
Task-Manager/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Local Installation & Setup Steps

### 1. Clone the Repository
```bash
git clone <YOUR_REPOSITORY_URL>
cd Task-Manager
```

### 2. Setup & Run Backend
```bash
cd backend
npm install
npm run dev
```
> The backend server will start on `http://localhost:5000`.

### 3. Setup & Run Frontend
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
> The React development server will start on `http://localhost:3000`.

---

## 🔌 API Overview

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & receive JWT token
- `GET /api/auth/profile` - Get authenticated user profile (Protected)

### Tasks
- `GET /api/tasks?search=&status=` - Get user tasks with search & filter options (Protected)
- `POST /api/tasks` - Create a new task (Protected)
- `PUT /api/tasks/:id` - Update task details (Protected)
- `DELETE /api/tasks/:id` - Delete a task (Protected)
- `PATCH /api/tasks/:id/status` - Quick update task status (Protected)

---

## 📤 Git & GitHub Commands

To initialize and push this project to your GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <YOUR_REPOSITORY_URL>
git push -u origin main
```

---

## 🔮 Future Improvements

- Add task priority levels (High, Medium, Low)
- Implement category/tagging system
- Add user profile avatar uploads
- Email reminders for due tasks
