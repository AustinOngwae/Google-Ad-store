import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
// Removed: import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const { session, loading } = useSession();

  // The global LoadingScreen handles the initial loading state
  if (loading) {
    return null; // Or a minimal placeholder if needed, but LoadingScreen covers it
  }

  if (session) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;