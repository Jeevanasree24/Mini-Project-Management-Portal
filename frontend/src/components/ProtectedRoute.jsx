import React from 'react';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    // Standard react redirect via script if router isn't used
    // or standard window redirect. Since we want standard spa feel, we will implement standard window redirect or state control.
    // In our app, we will use a simple state check in App.jsx or direct window.location redirect.
    // Let's use window.location redirect for maximum reliability without adding React Router router overhead.
    // Wait! Let's build a simple custom client-side router inside App.jsx to handle pages dynamically and efficiently!
    // That means we don't need to install react-router-dom, which reduces dependencies and works incredibly fast.
    if (typeof window !== 'undefined') {
      window.location.hash = '#/login';
    }
    return null;
  }

  return children;
};

export default ProtectedRoute;
