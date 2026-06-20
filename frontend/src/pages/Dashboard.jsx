import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import StatsDashboard from '../components/StatsDashboard';
import TaskCard from '../components/TaskCard';
import Loader from '../components/Loader';
import { Search, FolderOpen, Plus, AlertCircle } from 'lucide-react';

const Dashboard = ({ navigate }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Pagination State
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 6; // Grid layout of 3x2

  // Fetch Tasks and Stats
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      // 1. Fetch stats
      const statsRes = await API.get('/tasks/stats');
      setStats(statsRes.data);

      // 2. Fetch tasks with filters
      const tasksRes = await API.get('/tasks', {
        params: {
          status: statusFilter,
          search: searchQuery,
          sortBy,
          sortOrder,
          page,
          limit
        }
      });
      setTasks(tasksRes.data.tasks);
      setTotalPages(tasksRes.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please reload the page.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset page when filter or search changes
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery, sortBy, sortOrder]);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.put(`/tasks/${taskId}`, { status: newStatus });
      fetchData(); // Refresh list and stats
    } catch (err) {
      console.error(err);
      alert('Failed to update task status.');
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    try {
      await API.delete(`/tasks/${taskId}`);
      fetchData(); // Refresh list and stats
    } catch (err) {
      console.error(err);
      alert('Failed to delete task.');
    }
  };

  const handleSortChange = (e) => {
    const val = e.target.value;
    if (val === 'newest') {
      setSortBy('created_at');
      setSortOrder('DESC');
    } else if (val === 'oldest') {
      setSortBy('created_at');
      setSortOrder('ASC');
    } else if (val === 'title-asc') {
      setSortBy('title');
      setSortOrder('ASC');
    } else if (val === 'title-desc') {
      setSortBy('title');
      setSortOrder('DESC');
    }
  };

  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const completionRate = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;
  const activeTasks = stats.pending + stats.inProgress;

  const getSortSelectValue = () => {
    if (sortBy === 'created_at') {
      return sortOrder === 'DESC' ? 'newest' : 'oldest';
    }
    if (sortBy === 'title') {
      return sortOrder === 'ASC' ? 'title-asc' : 'title-desc';
    }
    return 'newest';
  };

  return (
    <div className="main-content fade-in">
      <section className="dashboard-hero glass-panel">
        <div className="dashboard-hero-text">
          <span className="hero-label">Productivity Workspace</span>
          <h1 className="hero-title">Make every task count, {user?.username || 'Planner'}.</h1>
          <p className="hero-copy">Track priorities, stay on schedule, and deliver stronger results with a clean modern task workflow.</p>
          <div className="hero-actions">
            <button onClick={() => navigate('#/add-task')} className="btn btn-primary">
              Start a new task
            </button>
            <button onClick={() => setStatusFilter('All')} className="btn btn-secondary">
              Reset filters
            </button>
          </div>
        </div>

        <div className="dashboard-hero-cards">
          <div className="hero-stat-card">
            <span>Active Tasks</span>
            <strong>{activeTasks}</strong>
          </div>
          <div className="hero-stat-card">
            <span>Completion Rate</span>
            <strong>{completionRate}%</strong>
          </div>
          <div className="hero-stat-card">
            <span>Updated</span>
            <strong>{new Date().toLocaleDateString()}</strong>
          </div>
        </div>
      </section>

      <section className="dashboard-overview-grid">
        <div className="dashboard-summary-card glass-panel">
          <h2>Performance insights</h2>
          <p>Accelerate your workflow with smarter task management and a polished team dashboard.</p>
          <div className="dashboard-summary-list">
            <div>
              <span>Pending tasks</span>
              <strong>{stats.pending}</strong>
            </div>
            <div>
              <span>In progress</span>
              <strong>{stats.inProgress}</strong>
            </div>
            <div>
              <span>Completed</span>
              <strong>{stats.completed}</strong>
            </div>
          </div>
        </div>
        <StatsDashboard stats={stats} />
      </section>

      {error && (
        <div className="alert-message alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filters, Search & Sort Panel */}
      <div className="controls-container glass-panel">
        <div className="filters-wrapper">
          {['All', 'Pending', 'In Progress', 'Completed'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`btn-filter ${statusFilter === status ? 'active' : ''}`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="search-sort-wrapper">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <select
            value={getSortSelectValue()}
            onChange={handleSortChange}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Main Tasks List */}
      {loading ? (
        <Loader />
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <FolderOpen size={48} className="empty-icon" />
          <h3 className="empty-title">No tasks found</h3>
          <p className="empty-desc">
            {searchQuery || statusFilter !== 'All' 
              ? 'No tasks match your filter/search criteria.' 
              : "You haven't created any tasks yet. Let's get started!"}
          </p>
          <button onClick={() => navigate('#/add-task')} className="btn btn-primary">
            <Plus size={16} />
            <span>Create First Task</span>
          </button>
        </div>
      ) : (
        <>
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="btn-page"
              >
                &laquo;
              </button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setPage(index + 1)}
                  className={`btn-page ${page === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page === totalPages}
                className="btn-page"
              >
                &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
