import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PrivateRoute = ({ children }) => {
  const { isLoggedIn, loading } = useAuth();
  
  // Show nothing while checking authentication status
  if (loading) {
    return null;
  }
  
  // If user is not logged in, redirect to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Otherwise, render the protected route
  return children;
};

export default PrivateRoute; 