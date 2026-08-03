import express from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  updateTaskStatus,
} from '../controllers/taskController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateTaskStatus);

export default router;
