import React from 'react';
import { Calendar, CheckCircle2, Clock, Edit2, Trash2, Check } from 'lucide-react';
import { TaskData } from './TaskModal';

interface TaskCardProps {
  task: TaskData & { createdAt?: string };
  onToggleStatus: (task: TaskData) => void;
  onEdit: (task: TaskData) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isCompleted = task.status === 'Completed';

  // Format Due Date
  const formatDueDate = (dateStr: string | null) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;

    const isOverdue = !isCompleted && date < new Date(new Date().setHours(0, 0, 0, 0));
    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return { formatted, isOverdue };
  };

  const dueInfo = formatDueDate(task.dueDate);

  return (
    <div
      className={`group bg-white rounded-xl p-5 border transition-all duration-200 shadow-xs hover:shadow-md ${
        isCompleted
          ? 'border-slate-200 bg-slate-50/70'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Toggle Status Checkbox */}
        <button
          onClick={() => onToggleStatus(task)}
          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
            isCompleted
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'border-slate-300 hover:border-blue-500 text-transparent hover:text-blue-500 bg-white'
          }`}
          title={isCompleted ? 'Mark as Pending' : 'Mark as Completed'}
        >
          <Check className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
            <h4
              className={`text-base font-semibold leading-snug break-words ${
                isCompleted ? 'line-through text-slate-400 font-normal' : 'text-slate-900'
              }`}
            >
              {task.title}
            </h4>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Completed</span>
                </>
              ) : (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Pending</span>
                </>
              )}
            </span>
          </div>

          {/* Description */}
          {task.description && (
            <p
              className={`text-sm mb-3 whitespace-pre-line leading-relaxed ${
                isCompleted ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Footer metadata & actions */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-3 text-xs text-slate-500">
            {/* Due Date Indicator */}
            {dueInfo ? (
              <div
                className={`flex items-center gap-1.5 font-medium ${
                  dueInfo.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-500'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Due: {dueInfo.formatted}
                  {dueInfo.isOverdue && ' (Overdue)'}
                </span>
              </div>
            ) : (
              <span className="text-slate-400 italic">No due date</span>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Edit Task"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => task._id && onDelete(task._id)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Delete Task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
