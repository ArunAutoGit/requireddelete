import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { RoleBasedRouteProps } from '../../admin/types/login';

// interface RoleBasedRouteProps {
//   children: React.ReactNode;
//   allowedRoles: string[];
//   redirectTo?: string;
// }

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/unauthorized' 
}) => {
  const { user, isLoading } = useAuth();

  // Debug logging
  console.log('RoleBasedRoute - User:', user);
  console.log('RoleBasedRoute - Allowed roles:', allowedRoles);
  console.log('RoleBasedRoute - User role:', user?.role);
  console.log('RoleBasedRoute - Role allowed:', allowedRoles.includes(user?.role || ''));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    console.log('RoleBasedRoute - No user, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    console.log('RoleBasedRoute - Role not allowed, redirecting to:', redirectTo);
    return <Navigate to={redirectTo} replace />;
  }

  console.log('RoleBasedRoute - Access granted, rendering children');
  return <>{children}</>;
};
