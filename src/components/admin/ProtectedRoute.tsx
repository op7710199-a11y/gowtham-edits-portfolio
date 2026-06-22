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
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center" style={{ minHeight: 64 }}>
            <img src="/logo.svg" alt="GOWTHAM EDITS" className="h-16 w-auto animate-pulse" onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.insertAdjacentHTML('afterend', '<span class="font-display text-2xl font-extrabold text-white">Gowtham<span class="text-gold-400">edits</span></span>'); }} />
          </div>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-ink-800">
            <div className="h-full w-full animate-[shimmer_1.5s_linear_infinite] bg-gold-gradient" />
          </div>
        </div>
      </div>
    );
  }

  if (!session || !profile) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!profile.is_active) {
    return <Navigate to="/admin/login" state={{ from: location, error: 'Your account is inactive.' }} replace />;
  }

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}
