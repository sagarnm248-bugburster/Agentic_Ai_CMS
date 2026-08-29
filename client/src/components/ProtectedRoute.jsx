import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuthStore();

  if (loading) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-slate-950">
        <div class="flex flex-col items-center gap-3">
          <div class="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          <p class="text-slate-400 text-sm animate-pulse">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role mismatch: redirect student to student dashboard, admin to admin dashboard
    const fallback = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
