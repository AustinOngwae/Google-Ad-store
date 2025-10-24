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
          {/* 
            This is a placeholder for a Google Ad. 
            You need to replace 'ca-pub-YOUR_CLIENT_ID' and 'YOUR_SLOT_ID'
            with your actual IDs from your Google AdSense account.
          */}
          <div className="w-full max-w-4xl h-64 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
             <GoogleAd client="ca-pub-YOUR_CLIENT_ID" slot="YOUR_SLOT_ID" style={{ display: 'block', width: '100%', height: '100%' }} />
          </div>
           <div className="w-full max-w-4xl h-64 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center">
             <GoogleAd client="ca-pub-YOUR_CLIENT_ID" slot="YOUR_SLOT_ID" style={{ display: 'block', width: '100%', height: '100%' }} />
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;