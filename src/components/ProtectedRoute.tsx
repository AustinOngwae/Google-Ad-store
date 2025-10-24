import { useSession } from "@/contexts/SessionContext";
import { Navigate, Outlet } from "react-router-dom";
// Removed: import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { profile, loading } = useSession();

  // The global LoadingScreen handles the initial loading state
  if (loading) {
    return null; // Or a minimal placeholder if needed, but LoadingScreen covers it
  }

  if (!profile || !allowedRoles.includes(profile.role ?? '')) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;