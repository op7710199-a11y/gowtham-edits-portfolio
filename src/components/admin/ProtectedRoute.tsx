import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/database';

interface Props {
  children: ReactNode;
  roles?: UserRole[];
}

export function ProtectedRoute({ children, roles }: Props) {
  const { session, profile, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // If we have a session but no profile (trigger didn't fire or RLS blocked the
  // read), show a retry screen instead of redirecting back to login (which
  // would cause a redirect loop after successful auth)
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 text-stone-400">
        <div className="text-center">
          <p className="text-sm">Unable to load your profile. Please try refreshing the page.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full border border-gold-500/30 px-5 py-2.5 text-xs text-gold-100 hover:border-gold-400"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  if (roles && !roles.includes(profile.role)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-ink-950 px-6 text-center">
        <h1 className="font-display text-2xl font-bold text-white">Access denied</h1>
        <p className="max-w-sm text-sm text-stone-400">
          Your role ({profile.role}) does not have access to this page.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
