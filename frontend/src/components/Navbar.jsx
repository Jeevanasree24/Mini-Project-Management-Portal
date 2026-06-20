import React, { useEffect, useState } from 'react';
import { Sun, Moon, LogOut, Plus, Home, Layers } from 'lucide-react';

const Navbar = ({ currentPath, navigate }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('#/login');
  };

  return (
    <header className="navbar glass-panel">
      <div className="nav-brand" style={{ cursor: 'pointer' }} onClick={() => navigate('#/dashboard')}>
        <Layers size={24} />
        <span>TaskManager</span>
      </div>

      <div className="nav-actions">
        <button 
          onClick={toggleTheme} 
          className="btn-theme-toggle" 
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {user && (
          <div className="nav-user">
            <span className="user-tag">{user.username}</span>
            {currentPath === '#/add-task' ? (
              <button onClick={() => navigate('#/dashboard')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Home size={15} />
                <span>Dashboard</span>
              </button>
            ) : (
              <button onClick={() => navigate('#/add-task')} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                <Plus size={15} />
                <span>New Task</span>
              </button>
            )}
            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '8px' }} title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
