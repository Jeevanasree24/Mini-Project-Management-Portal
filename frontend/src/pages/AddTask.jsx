import React, { useState } from 'react';
import API from '../services/api';
import { PlusCircle, ArrowLeft } from 'lucide-react';

const AddTask = ({ navigate }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task Title is required.';
    }
    if (!description.trim()) {
      newErrors.description = 'Description is required.';
    } else if (description.trim().length < 20) {
      newErrors.description = `Description must be at least 20 characters. Current: ${description.trim().length}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await API.post('/tasks', {
        title: title.trim(),
        description: description.trim(),
        status
      });
      navigate('#/dashboard');
    } catch (err) {
      console.error(err);
      setApiError(err.response?.data?.message || 'Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content fade-in">
      <div className="form-card glass-panel">
        <div style={{ marginBottom: '1.5rem' }}>
          <button 
            onClick={() => navigate('#/dashboard')} 
            className="btn btn-secondary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={15} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        <h2 className="form-header-title">
          <PlusCircle size={24} className="empty-icon" style={{ margin: 0, color: 'var(--color-primary)' }} />
          <span>Create New Task</span>
        </h2>

        {apiError && (
          <div className="alert-message alert-error">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="title">Task Title</label>
            <input
              type="text"
              id="title"
              className="form-input"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors({ ...errors, title: '' });
              }}
              placeholder="What needs to be done?"
              required
            />
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="description">Description</label>
              <span style={{ fontSize: '0.75rem', color: description.trim().length >= 20 ? 'var(--color-completed)' : 'var(--color-text-muted)' }}>
                {description.trim().length} / 20 characters min
              </span>
            </div>
            <textarea
              id="description"
              className="form-textarea"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: '' });
              }}
              placeholder="Provide context or detailed steps for this task (minimum 20 characters)..."
              required
            />
            {errors.description && <span className="error-text">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="status">Initial Status</label>
            <select
              id="status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
            </select>
          </div>

          <div className="form-actions-row">
            <button 
              type="button" 
              onClick={() => navigate('#/dashboard')} 
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
