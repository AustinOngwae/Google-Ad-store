import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { session, loading } = useSession();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Ads</h1>
        <Button onClick={handleLogout}>Logout</Button>
      </div>
      <p>Welcome, {session.user.email}!</p>
      <div className="mt-8 text-center">
        <p className="text-gray-500">Ad display area coming soon.</p>
      </div>
    </div>
  );
};

export default Home;