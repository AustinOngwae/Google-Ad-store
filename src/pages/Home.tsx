import { useSession } from "@/contexts/SessionContext";
import { supabase } from "@/integrations/supabase/client";
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AdCard } from "@/components/AdCard";
import { AdWithStatus } from "@/types";
import { showSuccess, showError } from "@/utils/toast";
import { Navbar } from "@/components/Navbar";

const Home = () => {
  const { session, loading, user } = useSession();
  const [ads, setAds] = useState<AdWithStatus[]>([]);
  const [isLoadingAds, setIsLoadingAds] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAds();
    }
  }, [user]);

  const fetchAds = async () => {
    if (!user) return;
    setIsLoadingAds(true);
    try {
      const { data: adsData, error: adsError } = await supabase.rpc('get_random_ads', { limit_count: 12 });
      if (adsError) throw adsError;

      const { data: statusesData, error: statusesError } = await supabase
        .from("user_ad_status")
        .select("*")
        .eq("user_id", user.id);
      if (statusesError) throw statusesError;

      const statusesMap = new Map(statusesData.map(s => [s.ad_id, s]));
      const mergedAds: AdWithStatus[] = adsData.map(ad => ({
        ...ad,
        is_saved: statusesMap.get(ad.id)?.is_saved || false,
        is_blocked: statusesMap.get(ad.id)?.is_blocked || false,
      }));

      setAds(mergedAds);
    } catch (error) {
      console.error("Error fetching ads:", error);
      showError("Failed to load ads.");
    } finally {
      setIsLoadingAds(false);
    }
  };

  const handleSave = async (adId: string, newSaveState: boolean) => {
    if (!user) return;
    setAds(currentAds =>
      currentAds.map(ad =>
        ad.id === adId ? { ...ad, is_saved: newSaveState } : ad
      )
    );

    const { error } = await supabase
      .from("user_ad_status")
      .upsert({ user_id: user.id, ad_id: adId, is_saved: newSaveState }, { onConflict: 'user_id,ad_id' });

    if (error) {
      showError("Failed to save ad.");
      setAds(currentAds =>
        currentAds.map(ad =>
          ad.id === adId ? { ...ad, is_saved: !newSaveState } : ad
        )
      );
    } else {
      showSuccess(newSaveState ? "Ad saved!" : "Ad unsaved.");
    }
  };

  const handleBlock = async (adId: string) => {
    if (!user) return;
    setAds(currentAds =>
      currentAds.map(ad =>
        ad.id === adId ? { ...ad, is_blocked: true } : ad
      )
    );

    const { error } = await supabase
      .from("user_ad_status")
      .upsert({ user_id: user.id, ad_id: adId, is_blocked: true }, { onConflict: 'user_id,ad_id' });

    if (error) {
      showError("Failed to block ad.");
      setAds(currentAds =>
        currentAds.map(ad =>
          ad.id === adId ? { ...ad, is_blocked: false } : ad
        )
      );
    } else {
      showSuccess("Ad blocked.");
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const visibleAds = ads.filter(ad => !ad.is_blocked);

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4 md:p-8">
        <header className="my-8">
          <h1 className="text-3xl font-bold">Recommended Ads</h1>
        </header>
        
        <main>
          {isLoadingAds ? (
            <p>Loading ads...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleAds.length > 0 ? (
                visibleAds.map(ad => (
                  <AdCard key={ad.id} ad={ad} onSave={handleSave} onBlock={handleBlock} />
                ))
              ) : (
                <div className="col-span-full text-center text-muted-foreground py-16">
                  <p>No more ads to show right now.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Home;