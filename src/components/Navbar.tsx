import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Home, Bookmark } from "lucide-react";

export const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="container mx-auto p-4 md:px-8 border-b">
      <nav className="flex justify-between items-center">
        <Link to="/home" className="text-xl font-bold flex items-center gap-2">
          AdFeed
        </Link>
        <div className="flex items-center gap-1 md:gap-2">
          <Button variant="ghost" asChild>
            <Link to="/home">
              <Home className="mr-2 h-4 w-4" />
              Home
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/saved">
              <Bookmark className="mr-2 h-4 w-4" />
              Saved
            </Link>
          </Button>
          <Button onClick={handleLogout} className="ml-2">Logout</Button>
        </div>
      </nav>
    </header>
  );
};