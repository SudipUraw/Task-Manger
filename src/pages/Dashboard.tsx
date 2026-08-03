import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Navbar } from '../components/Navbar';
import { TaskCard } from '../components/TaskCard';
import { TaskModal, TaskData } from '../components/TaskModal';
import {
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ListTodo,
  TrendingUp,
  X,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);

  // Delete confirm modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'All') params.status = statusFilter;

      const { data } = await api.get('/tasks', { params });
      setTasks(data);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchTasks]);

  // Statistics calculation
  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const pendingCount = tasks.filter((t) => t.status === 'Pending').length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Recent tasks (top 3 created)
  const recentTasks = [...tasks].slice(0, 3);

  // Handlers
  const handleOpenAdd = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: TaskData) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData: TaskData) => {
    if (taskData._id) {
      // Update
      await api.put(`/tasks/${taskData._id}`, taskData);
      showToast('Task updated successfully', 'success');
    } else {
      // Create
      await api.post('/tasks', taskData);
      showToast('New task added successfully', 'success');
    }
    fetchTasks();
  };

  const handleToggleStatus = async (task: TaskData) => {
    if (!task._id) return;
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      await api.patch(`/tasks/${task._id}/status`, { status: newStatus });
      showToast(
        newStatus === 'Completed' ? 'Task marked as Completed! 🎉' : 'Task marked as Pending',
        'success'
      );
      fetchTasks();
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setDeleting(true);
    try {
      await api.delete(`/tasks/${deleteTargetId}`);
      showToast('Task deleted', 'info');
      setDeleteTargetId(null);
      fetchTasks();
    } catch (err) {
      showToast('Failed to delete task', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden border border-slate-800">
          <div className="space-y-2 relative z-10">
            <span className="inline-block px-3 py-1 rounded-md bg-blue-500/20 text-blue-300 text-xs font-semibold tracking-wide border border-blue-400/20">
              Personal Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.name || 'User'} 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Here is your daily task overview. Track progress, check off completed items, and keep your goals organized.
            </p>
          </div>

          <button
            onClick={handleOpenAdd}
            className="relative z-10 shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-95"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>Add New Task</span>
          </button>
        </div>

        {/* Dashboard Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <ListTodo className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Tasks</p>
              <p className="text-2xl font-bold text-slate-800">{totalCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completed</p>
              <p className="text-2xl font-bold text-slate-800">{completedCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</p>
              <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Completion Rate</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl font-bold text-slate-800">{completionRate}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Task Management Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Tasks List Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Control Bar: Search & Status Filters */}
            <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
              {/* Search Bar */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search tasks by title or description..."
                  className="w-full pl-9 pr-8 py-2 rounded-lg bg-slate-100 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-slate-800 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {(['All', 'Pending', 'Completed'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                      statusFilter === tab
                        ? 'bg-white text-blue-600 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Task List Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>Task List</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 font-medium text-slate-700">
                  {tasks.length}
                </span>
              </h2>

              <button
                onClick={fetchTasks}
                className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Refresh tasks"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Loading State Skeleton */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="bg-white rounded-2xl p-5 border border-slate-200 animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded-md w-2/3" />
                    <div className="h-3 bg-slate-100 rounded-md w-5/6" />
                    <div className="h-3 bg-slate-100 rounded-md w-1/3" />
                  </div>
                ))}
              </div>
            ) : tasks.length === 0 ? (
              /* Empty State */
              <div className="bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
                  <ListTodo className="w-8 h-8" />
                </div>
                <div className="max-w-xs mx-auto">
                  <h3 className="text-base font-bold text-slate-900">No tasks found</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {search || statusFilter !== 'All'
                      ? 'Try clearing your search query or status filter to see all tasks.'
                      : 'You haven’t added any tasks yet. Click below to create your first task!'}
                  </p>
                </div>
                {!search && statusFilter === 'All' && (
                  <button
                    onClick={handleOpenAdd}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs shadow-md shadow-indigo-100 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Task</span>
                  </button>
                )}
              </div>
            ) : (
              /* Task Items */
              <div className="space-y-3">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleOpenEdit}
                    onDelete={(id) => setDeleteTargetId(id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Sidebar / Recent Tasks & Quick Summary Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">Recent Tasks</h3>
                <span className="text-xs text-slate-400 font-medium">Latest {recentTasks.length}</span>
              </div>

              {recentTasks.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <div
                      key={task._id}
                      onClick={() => handleOpenEdit(task)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-100 hover:border-indigo-100 cursor-pointer transition-all flex items-start gap-3"
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          task.status === 'Completed' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{task.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {task.status} • {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Tips Box */}
            <div className="bg-indigo-50/50 rounded-2xl p-5 border border-indigo-100 text-xs text-indigo-900 space-y-2">
              <p className="font-bold text-indigo-950 flex items-center gap-1.5">
                💡 Quick Productivity Tip
              </p>
              <p className="text-indigo-800 leading-relaxed">
                Break large tasks into smaller descriptions and assign due dates to keep your focus sharp and meet deadlines consistently.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Task Modal (Add/Edit) */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Delete Task</h3>
            </div>
            <p className="text-sm text-slate-600">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs disabled:opacity-60 flex items-center gap-1.5"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
