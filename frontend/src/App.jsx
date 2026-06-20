import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddTask from './pages/AddTask';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#/dashboard');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash || '#/dashboard');
    };

    window.addEventListener('hashchange', handleHashChange);
    
    // Initial redirect check
    const token = localStorage.getItem('token');
    const path = window.location.hash;
    
    if (!token && path !== '#/login' && path !== '#/register') {
      window.location.hash = '#/login';
    } else if (token && (path === '#/login' || path === '#/register' || !path)) {
      window.location.hash = '#/dashboard';
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const navigate = (hash) => {
    window.location.hash = hash;
    setCurrentPath(hash);
  };

  // Auth Guard helper
  const isAuthenticated = () => {
    return !!localStorage.getItem('token');
  };

  // Render match
  const renderPage = () => {
    switch (currentPath) {
      case '#/login':
        if (isAuthenticated()) {
          window.location.hash = '#/dashboard';
          return null;
        }
        return <Login navigate={navigate} />;
        
      case '#/register':
        if (isAuthenticated()) {
          window.location.hash = '#/dashboard';
          return null;
        }
        return <Register navigate={navigate} />;
        
      case '#/add-task':
        return (
          <ProtectedRoute>
            <AddTask navigate={navigate} />
          </ProtectedRoute>
        );
        
      case '#/dashboard':
      default:
        return (
          <ProtectedRoute>
            <Dashboard navigate={navigate} />
          </ProtectedRoute>
        );
    }
  };

  return (
    <div className="app-container">
      <Navbar currentPath={currentPath} navigate={navigate} />
      {renderPage()}
    </div>
  );
}

export default App;
