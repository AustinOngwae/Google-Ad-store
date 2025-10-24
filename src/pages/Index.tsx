import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = () => {
  const { session, loading } = useSession();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (session) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;