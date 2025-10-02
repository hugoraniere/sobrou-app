
import React from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useSafeAuth } from '@/hooks/useSafeAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useSafeAuth();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/suporte';

  // Show loading state while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to={`/?auth=1&redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
