import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSuperAdmin } from '../../context/superadmin/SuperAdminContext';

const SuperAdminProtectedRoute = ({ children }) => {
  const { isSuperAdmin, loading } = useSuperAdmin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          <p className="mt-4 text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/superadmin/login" replace />;
  }

  return children;
};

export default SuperAdminProtectedRoute;
