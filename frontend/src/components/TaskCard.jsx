import React from 'react';
import { Trash2, CheckCircle2, Calendar, Play } from 'lucide-react';

const TaskCard = ({ task, onStatusChange, onDelete }) => {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'badge-pending';
      case 'In Progress':
        return 'badge-progress';
      case 'Completed':
        return 'badge-completed';
      default:
        return '';
    }
  };

  return (
    <div className="task-card">
      <div>
        <div className="task-header">
          <h3 className="task-title">{task.title}</h3>
          <span className={`badge ${getStatusBadgeClass(task.status)}`}>
            {task.status}
          </span>
        </div>
        <p className="task-desc">{task.description}</p>
      </div>

      <div className="task-footer">
        <div className="task-date" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Calendar size={14} />
          <span>{formatDate(task.created_at)}</span>
        </div>

        <div className="task-actions">
          {task.status === 'Pending' && (
            <button 
              onClick={() => onStatusChange(task.id, 'In Progress')} 
              className="btn btn-success-outline"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', gap: '0.25rem' }}
              title="Start Task"
            >
              <Play size={12} />
              <span>Start</span>
            </button>
          )}

          {task.status !== 'Completed' && (
            <button 
              onClick={() => onStatusChange(task.id, 'Completed')} 
              className="btn btn-success-outline"
              style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem', gap: '0.25rem' }}
              title="Complete Task"
            >
              <CheckCircle2 size={12} />
              <span>Complete</span>
            </button>
          )}

          <button 
            onClick={() => onDelete(task.id)} 
            className="btn btn-danger-outline"
            style={{ padding: '0.35rem', borderRadius: '6px' }}
            title="Delete Task"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
