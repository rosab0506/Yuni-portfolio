import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Protected Route Guard
 * 
 * Ensures only authenticated admin users can access protected routes.
 * Shows loading state while checking authentication.
 * Redirects to login page if not authenticated.
 */
export function ProtectedRoute({
  children,
  redirectTo,
}: {
  children: ReactNode;
  redirectTo: string;
}) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B1320] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#C77DFF] animate-spin" />
          <p className="text-white/60 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${redirectTo}?next=${next}`} replace />;
  }

  return children;
}
