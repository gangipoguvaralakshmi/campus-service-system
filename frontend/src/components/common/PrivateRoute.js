import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const PrivateRoute = ({ role }) => {
  const { user, isAuthenticated, loading } = useAuth();

  console.log('PrivateRoute - user:', user);
  console.log('PrivateRoute - isAuthenticated:', isAuthenticated);
  console.log('PrivateRoute - loading:', loading);
  console.log('PrivateRoute - required role:', role);

  if (loading) {
    return <div className="loader">Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    console.log(`User role ${user?.role} does not have access to ${role} route`);
    return <Navigate to="/dashboard" />;
  }

  console.log('Authenticated, rendering protected route');
  return <Outlet />;
};

export default PrivateRoute;