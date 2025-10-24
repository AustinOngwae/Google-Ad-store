import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Navigate } from "react-router-dom";
import { useSession } from "@/contexts/SessionContext";
// Removed: import { LoadingSpinner } from "@/components/LoadingSpinner";

const Login = () => {
  const { session, loading } = useSession();

  // The global LoadingScreen handles the initial loading state
  if (loading) {
    return null; // Or a minimal placeholder if needed, but LoadingScreen covers it
  }

  if (session) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8">
        <h1 className="text-2xl font-bold text-center">Welcome</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={["google"]}
          theme="light"
        />
      </div>
    </div>
  );
};

export default Login;