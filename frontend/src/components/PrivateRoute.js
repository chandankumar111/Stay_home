import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple auth check function
const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  // Optionally, add token validation logic here
  return !!token;
};

// PrivateRoute component to protect routes
const PrivateRoute = ({ children, allowedRoles }) => {
  if (!isAuthenticated()) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    try {
      const token = localStorage.getItem('token');
      const payload = JSON.parse(atob(token.split('.')[1]));
      const userRole = payload.role ? payload.role.toLowerCase().trim() : null;
      if (!allowedRoles.includes(userRole)) {
        // Role not authorized, redirect to home or unauthorized page
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      // Invalid token, redirect to login
      return <Navigate to="/login" replace />;
    }
  }

  // Authorized, render children
  return children;
};

export default PrivateRoute;
