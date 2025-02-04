
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
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
      </div>
    </section>
  );
};

export default HeroSection;
