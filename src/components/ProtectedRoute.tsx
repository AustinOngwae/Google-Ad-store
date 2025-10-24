import { useSession } from "@/contexts/SessionContext";
import { Navigate, Outlet } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { profile, loading } = useSession();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!profile || !allowedRoles.includes(profile.role ?? '')) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;