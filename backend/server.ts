import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB, getDbStatus } from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

async function startServer() {
  await connectDB();

  const app = express();
  const PORT = Number(process.env.PORT) || 5000;

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api/auth', authRoutes);
  app.use('/api/tasks', taskRoutes);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), db: getDbStatus() });
  });

  app.get('/api/db-status', (_req, res) => {
    res.json(getDbStatus());
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Task Manager backend running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start backend server:', err);
});
