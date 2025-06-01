import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const PublicRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  // If user is logged in, redirect to upload-data page
  if (isLoggedIn) {
    return <Navigate to="/upload-data" replace />;
  }
  
  // Otherwise, render the public route (login/signup)
  return children;
};

export default PublicRoute; 