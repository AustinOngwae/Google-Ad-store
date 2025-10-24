import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";

const Home = () => {
  const { session, loading } = useSession();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <header className="my-8">
          <h1 className="text-3xl font-bold">Welcome Home</h1>
          <p className="text-muted-foreground">Your personalized content will appear here.</p>
        </header>
        
        <main className="flex flex-col items-center gap-8">
          {/* Ad content has been temporarily removed for performance testing. */}
        </main>
      </div>
    </>
  );
};

export default Home;