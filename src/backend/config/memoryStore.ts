import bcrypt from 'bcryptjs';

export interface MemoryUser {
  _id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface MemoryTask {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'Completed';
  dueDate: string | null;
  userId: string;
  createdAt: Date;
}

class MemoryStore {
  users: MemoryUser[] = [];
  tasks: MemoryTask[] = [];

  constructor() {
    // Seed default demo user for instant testing if desired
    const demoPasswordHash = bcrypt.hashSync('password123', 10);
    const demoUserId = 'user_demo_123';
    this.users.push({
      _id: demoUserId,
      name: 'Demo Student',
      email: 'student@example.com',
      passwordHash: demoPasswordHash,
      createdAt: new Date(),
    });

    // Seed sample tasks for demo user
    this.tasks.push(
      {
        _id: 'task_1',
        title: 'Complete MERN Stack Assignment',
        description: 'Build backend API routes and responsive React frontend for Task Manager.',
        status: 'Pending',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        userId: demoUserId,
        createdAt: new Date(),
      },
      {
        _id: 'task_2',
        title: 'Review JWT Auth & Security',
        description: 'Ensure token expiration, password hashing with bcrypt, and protected middleware.',
        status: 'Completed',
        dueDate: new Date(Date.now() - 86400000).toISOString(),
        userId: demoUserId,
        createdAt: new Date(Date.now() - 86400000 * 2),
      },
      {
        _id: 'task_3',
        title: 'Deploy & Test MongoDB Atlas Connection',
        description: 'Configure environment variables MONGODB_URI and JWT_SECRET.',
        status: 'Pending',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        userId: demoUserId,
        createdAt: new Date(Date.now() - 86400000 * 3),
      }
    );
  }

  // User operations
  findUserByEmail(email: string) {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  findUserById(id: string) {
    return this.users.find((u) => u._id === id);
  }

  createUser(name: string, email: string, passwordHash: string) {
    const newUser: MemoryUser = {
      _id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.toLowerCase(),
      passwordHash,
      createdAt: new Date(),
    };
    this.users.push(newUser);
    return newUser;
  }

  // Task operations
  getTasksForUser(userId: string, search?: string, status?: string) {
    let list = this.tasks.filter((t) => t.userId === userId);

    if (status && status !== 'All') {
      list = list.filter((t) => t.status === status);
    }

    if (search && search.trim() !== '') {
      const q = search.toLowerCase();
      list = list.filter(
        (t) => t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  createTask(userId: string, title: string, description?: string, dueDate?: string | null, status: 'Pending' | 'Completed' = 'Pending') {
    const newTask: MemoryTask = {
      _id: `task_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title,
      description: description || '',
      status,
      dueDate: dueDate || null,
      userId,
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    return newTask;
  }

  updateTask(taskId: string, userId: string, updates: Partial<MemoryTask>) {
    const taskIndex = this.tasks.findIndex((t) => t._id === taskId && t.userId === userId);
    if (taskIndex === -1) return null;

    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
    };
    return this.tasks[taskIndex];
  }

  deleteTask(taskId: string, userId: string) {
    const initialLen = this.tasks.length;
    this.tasks = this.tasks.filter((t) => !(t._id === taskId && t.userId === userId));
    return this.tasks.length < initialLen;
  }
}

export const memoryStore = new MemoryStore();
