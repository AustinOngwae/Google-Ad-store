import { useSession } from "@/contexts/SessionContext";
import { Navigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import GoogleAd from "@/components/GoogleAd";

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
          <h1 className="text-3xl font-bold">Personalized Ads</h1>
          <p className="text-muted-foreground">Ads tailored for you by Google.</p>
        </header>
        
        <main className="flex flex-col items-center gap-8">
          {/* Ad Slot 1: Adstoresquare */}
          <div className="w-full max-w-4xl min-h-[250px] flex items-center justify-center">
             <GoogleAd 
               client="ca-pub-3657670648504430" 
               slot="2276326504" 
               style={{ display: 'block', width: '100%', height: '100%' }} 
             />
          </div>
          {/* Ad Slot 2: Adstorevertical */}
           <div className="w-full max-w-4xl min-h-[250px] flex items-center justify-center">
             <GoogleAd 
               client="ca-pub-3657670648504430" 
               slot="4720965940" 
               style={{ display: 'block', width: '100%', height: '100%' }} 
             />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;