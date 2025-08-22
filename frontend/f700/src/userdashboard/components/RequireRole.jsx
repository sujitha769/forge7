import React from 'react';
import { Navigate } from 'react-router-dom';

// Guard a route by requiring authentication and an optional role
const RequireRole = ({ role, children }) => {
  const isAuthenticated = !!localStorage.getItem('logintoken');
  const userRole = localStorage.getItem('role');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    // Redirect to their correct home if role mismatches
    const target = userRole === 'doctor' ? '/doctor/overview' : '/profile';
    return <Navigate to={target} replace />;
  }

  return children;
};

export default RequireRole;




