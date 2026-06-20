import React from 'react';
import { ListTodo, Clock, PlayCircle, CheckCircle2 } from 'lucide-react';

const StatsDashboard = ({ stats }) => {
  const { total = 0, pending = 0, inProgress = 0, completed = 0 } = stats || {};

  return (
    <section className="stats-grid">
      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Total Tasks</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-icon total">
          <ListTodo size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Pending</span>
          <span className="stat-value">{pending}</span>
        </div>
        <div className="stat-icon pending">
          <Clock size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">In Progress</span>
          <span className="stat-value">{inProgress}</span>
        </div>
        <div className="stat-icon progress">
          <PlayCircle size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-info">
          <span className="stat-label">Completed</span>
          <span className="stat-value">{completed}</span>
        </div>
        <div className="stat-icon completed">
          <CheckCircle2 size={24} />
        </div>
      </div>
    </section>
  );
};

export default StatsDashboard;
