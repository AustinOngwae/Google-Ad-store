import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types";
import { promiseWithTimeout } from "@/utils/promiseWithTimeout"; // Import the new utility

interface SessionContextValue {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  loadingProgress: number;
  loadingMessage: string;
}

const SessionContext = createContext<SessionContextValue>({
  session: null,
  user: null,
  profile: null,
  loading: true,
  loadingProgress: 0,
  loadingMessage: "Initializing...",
});

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Starting application...");

  useEffect(() => {
    const fetchInitialSession = async () => {
      try {
        setLoadingProgress(25);
        setLoadingMessage("Checking user session...");

        // Wrap getSession with a timeout
        const { data: { session: initialSession } } = await promiseWithTimeout(
          supabase.auth.getSession(),
          4000, // Changed to 4-second timeout
          new Error("Session check timed out. Please try logging in again.")
        );
        
        setSession(initialSession);
        const currentUser = initialSession?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          setLoadingProgress(50);
          setLoadingMessage("Fetching user profile...");
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile:", profileError);
            setProfile(null);
            setLoadingMessage("Error loading profile. Redirecting to login.");
            // If profile fails, treat as unauthenticated for this session
            setSession(null);
            setUser(null);
          } else {
            setProfile(profileData);
            setLoadingProgress(75);
            setLoadingMessage("Profile loaded. Preparing application...");
          }
        } else {
          setProfile(null);
          setLoadingProgress(75);
          setLoadingMessage("No active session. Redirecting to login...");
        }
      } catch (error: any) {
        console.error("Error during initial session fetch:", error.message);
        setLoadingMessage(error.message || "An error occurred during startup. Redirecting to login.");
        // Clear session and user if any error occurs during initial fetch
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoadingProgress(100);
        setLoadingMessage("Application ready!");
        setLoading(false);
      }
    };

    fetchInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        const currentUser = session?.user;
        setUser(currentUser ?? null);

        if (currentUser) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();
          
          if (profileError) {
            console.error("Error fetching profile on auth change:", profileError);
            setProfile(null);
          } else {
            setProfile(profileData);
          }
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <SessionContext.Provider value={{ session, user, profile, loading, loadingProgress, loadingMessage }}>
      {children}
    </SessionContext.Provider>
  );
};