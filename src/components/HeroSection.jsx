
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthClick = async () => {
    if (session) {
      try {
        await supabase.auth.signOut();
        toast({
          title: "Success",
          description: "You have been logged out",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <section className="min-h-screen relative">
      {/* Auth button in top right corner */}
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          onClick={handleAuthClick}
        >
          {session ? "Sign Out" : "Sign In"}
        </Button>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToTop}
          className="fixed bottom-4 right-4 rounded-full z-50"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}

      <div className="h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-primary/10 to-background dark:from-primary/5 dark:to-background">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-primary">Raghu</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 text-center max-w-2xl">
          Emergency Response & Support System
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('report-missing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Report Missing
          </Button>
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('damage-report')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Report Damage
          </Button>
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('first-aid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            First Aid
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
