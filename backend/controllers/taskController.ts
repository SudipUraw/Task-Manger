import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Task } from '../models/Task';
import { isUsingMemoryDb } from '../config/db';
import { memoryStore } from '../config/memoryStore';

// @desc    Get user tasks with optional search & filter
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || 'All';

    if (isUsingMemoryDb) {
      const tasks = memoryStore.getTasksForUser(userId, search, status);
      res.json(tasks);
      return;
    }

    // Mongoose query filter
    const query: any = { user: userId };

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error: any) {
    console.error('getTasks Error:', error);
    res.status(500).json({ message: error.message || 'Server Error fetching tasks' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { title, description, dueDate, status } = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ message: 'Task title is required' });
      return;
    }

    const taskStatus = status === 'Completed' ? 'Completed' : 'Pending';

    if (isUsingMemoryDb) {
      const newTask = memoryStore.createTask(
        userId,
        title,
        description,
        dueDate ? new Date(dueDate).toISOString() : null,
        taskStatus
      );
      res.status(201).json(newTask);
      return;
    }

    const task = await Task.create({
      title,
      description: description || '',
      status: taskStatus,
      dueDate: dueDate ? new Date(dueDate) : null,
      user: userId,
    });

    res.status(201).json(task);
  } catch (error: any) {
    console.error('createTask Error:', error);
    res.status(500).json({ message: error.message || 'Server Error creating task' });
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    const { title, description, dueDate, status } = req.body;

    if (isUsingMemoryDb) {
      const updated = memoryStore.updateTask(taskId, userId, {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate).toISOString() : null }),
        ...(status !== undefined && { status }),
      });

      if (!updated) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
      res.json(updated);
      return;
    }

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== userId) {
      res.status(401).json({ message: 'Not authorized to modify this task' });
      return;
    }

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error: any) {
    console.error('updateTask Error:', error);
    res.status(500).json({ message: error.message || 'Server Error updating task' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (isUsingMemoryDb) {
      const removed = memoryStore.deleteTask(taskId, userId);
      if (!removed) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
      res.json({ message: 'Task removed successfully' });
      return;
    }

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== userId) {
      res.status(401).json({ message: 'Not authorized to delete this task' });
      return;
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error: any) {
    console.error('deleteTask Error:', error);
    res.status(500).json({ message: error.message || 'Server Error deleting task' });
  }
};

// @desc    Quick update task status (Pending / Completed)
// @route   PATCH /api/tasks/:id/status
// @access  Private
export const updateTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    const taskId = req.params.id;
    const { status } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    if (!status || (status !== 'Pending' && status !== 'Completed')) {
      res.status(400).json({ message: 'Status must be Pending or Completed' });
      return;
    }

    if (isUsingMemoryDb) {
      const updated = memoryStore.updateTask(taskId, userId, { status });
      if (!updated) {
        res.status(404).json({ message: 'Task not found or unauthorized' });
        return;
      }
      res.json(updated);
      return;
    }

    const task = await Task.findById(taskId);

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    if (task.user.toString() !== userId) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error: any) {
    console.error('updateTaskStatus Error:', error);
    res.status(500).json({ message: error.message || 'Server Error updating task status' });
  }
};
