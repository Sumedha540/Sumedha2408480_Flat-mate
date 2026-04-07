// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // Not logged in - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role - redirect to correct dashboard
  if (!allowedRoles.includes(user.role)) {
    // Redirect to the correct dashboard based on user role
    if (user.role === 'admin') {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (user.role === 'landlord' || user.role === 'owner') {
      return <Navigate to="/dashboard/owner" replace />;
    } else if (user.role === 'tenant') {
      return <Navigate to="/dashboard/tenant" replace />;
    }
    // Fallback to login if role is unknown
    return <Navigate to="/login" replace />;
  }

  // Correct role - render the component
  return <>{children}</>;
}
