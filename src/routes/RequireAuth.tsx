import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Guards all protected routes.
 * - While bootstrapping (isLoading=true), renders null to avoid redirect flicker.
 * - Unauthenticated users are redirected to login.
 */
export const RequireAuth = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Still restoring session from localStorage / refreshing token — don't redirect yet
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
