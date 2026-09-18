/**
 * Guest-only outlet — redirects away when session + profile are already selected.
 * Host supplies product home path via `redirectTo`.
 */
import { hasSelectedProfile, useAuthStore } from "@/stores/auth";
import { Navigate, Outlet } from "react-router";

export interface GuestRouteProps {
  /** Where to send authenticated users with a selected profile (e.g. ROUTES.HOME). */
  redirectTo: string;
}

export function GuestRoute({ redirectTo }: GuestRouteProps) {
  const isAuthValid = useAuthStore((state) => state.isAuthValid);
  const currentProfileId = useAuthStore((state) => state.currentProfileId);

  if (isAuthValid && hasSelectedProfile(currentProfileId)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
