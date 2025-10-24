import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdCard } from "@/components/AdCard";
import { AdWithStatus } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const SavedAds = () => {
  const { session, loading, user } = useSession();
  const [savedAds, setSavedAds] = useState<AdWithStatus[]>([]);
  const [isLoadingAds, setIsLoadingAds] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedAds();
    }
  }, [user]);

  const fetchSavedAds = async () => {
    if (!user) return;
    setIsLoadingAds(true);
    try {
      const { data, error } = await supabase
        .from('user_ad_status')
        .select(`
          is_saved,
          is_blocked,
          ads (*)
        `)
        .eq('user_id', user.id)
        .eq('is_saved', true)
        .neq('is_blocked', true);

      if (error) throw error;

      const formattedAds: AdWithStatus[] = data
        .map(item => ({
          ...item.ads,
          is_saved: item.is_saved,
          is_blocked: item.is_blocked,
        }))
        .filter(ad => ad.id);

      setSavedAds(formattedAds);
    } catch (error) {
      console.error("Error fetching saved ads:", error);
      showError("Failed to load saved ads.");
    } finally {
      setIsLoadingAds(false);
    }
  };

  const handleSave = async (adId: string, newSaveState: boolean) => {
    if (!user) return;
    
    setSavedAds(currentAds => currentAds.filter(ad => ad.id !== adId));

    const { error } = await supabase
      .from("user_ad_status")
      .upsert({ user_id: user.id, ad_id: adId, is_saved: newSaveState }, { onConflict: 'user_id,ad_id' });

    if (error) {
      showError("Failed to unsave ad.");
      fetchSavedAds();
    } else {
      showSuccess("Ad unsaved.");
    }
  };

  const handleBlock = async (adId: string) => {
    if (!user) return;
    setSavedAds(currentAds => currentAds.filter(ad => ad.id !== adId));

    const { error } = await supabase
      .from("user_ad_status")
      .upsert({ user_id: user.id, ad_id: adId, is_blocked: true, is_saved: false }, { onConflict: 'user_id,ad_id' });

    if (error) {
      showError("Failed to block ad.");
      fetchSavedAds();
    } else {
      showSuccess("Ad blocked.");
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <header className="my-8">
          <h1 className="text-3xl font-bold">Your Saved Ads</h1>
        </header>
        
        <main>
          {isLoadingAds ? (
            <p>Loading saved ads...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {savedAds.length > 0 ? (
                savedAds.map(ad => (
                  <AdCard key={ad.id} ad={ad} onSave={handleSave} onBlock={handleBlock} />
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-16">
                  <p>You haven't saved any ads yet.</p>
                  <Button variant="link" asChild>
                    <Link to="/home">Explore Ads</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SavedAds;