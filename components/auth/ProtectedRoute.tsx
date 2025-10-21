'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    const timer = setTimeout(() => {
      setIsChecking(false);
      
      // Redirect to login if not authenticated
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // Check admin role if required
      if (requireAdmin && !isAdmin) {
        router.push('/');
        return;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isAdmin, requireAdmin, router]);

  // Show loading during hydration check
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render children if not authenticated or not admin (when required)
  if (!isAuthenticated) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <main className="flex items-center justify-center min-h-screen" role="main">
        <div className="text-center space-y-4" role="alert" aria-live="polite">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have permission to access this page.
          </p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
