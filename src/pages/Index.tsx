import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { session, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (session) {
    return <Navigate to="/home" replace />;
  }

  return <Navigate to="/login" replace />;
};

export default Index;