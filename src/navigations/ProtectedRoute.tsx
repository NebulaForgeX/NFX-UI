/**
 * Auth-gated outlet — redirects to login when session/profile missing.
 * Host supplies product login path via `redirectTo`.
 */
import { hasSelectedProfile, useAuthStore } from "nfx-ui/stores/auth";
import { Navigate, Outlet, useLocation } from "react-router";

export interface ProtectedRouteProps {
  /** Where to send unauthenticated users (e.g. ROUTES.LOGIN). */
  redirectTo: string;
}

export function ProtectedRoute({ redirectTo }: ProtectedRouteProps) {
  const location = useLocation();
  const isAuthValid = useAuthStore((state) => state.isAuthValid);
  const currentProfileId = useAuthStore((state) => state.currentProfileId);

  if (!isAuthValid || !hasSelectedProfile(currentProfileId)) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
