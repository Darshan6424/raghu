
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const HeroSection = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAuthClick = async () => {
    if (session) {
      try {
        await supabase.auth.signOut();
        toast({
          title: "Success",
          description: "You have been logged out",
        });
      } catch (error: any) {
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
    <section className="h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-primary/10 to-white">
      <h1 className="text-6xl md:text-8xl font-bold mb-8 text-primary">Raghu</h1>
      <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
        Emergency Response & Support System
      </p>
      <div className="flex flex-wrap gap-4 justify-center">
        <Button
          className="text-lg px-8 py-6"
          onClick={() => scrollToSection('report-missing')}
        >
          Report Missing
        </Button>
        <Button
          className="text-lg px-8 py-6"
          onClick={() => scrollToSection('damage-report')}
        >
          Report Damage
        </Button>
        <Button
          className="text-lg px-8 py-6"
          onClick={() => scrollToSection('first-aid')}
        >
          First Aid
        </Button>
        <Button
          className="text-lg px-8 py-6"
          variant="outline"
          onClick={handleAuthClick}
        >
          {session ? "Sign Out" : "Sign In"}
        </Button>
      </div>
    </section>
  );
};

export default HeroSection;
