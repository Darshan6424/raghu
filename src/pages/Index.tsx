import { Button } from "@/components/ui/button";
import MainButtons from "@/components/MainButtons";
import AskExpert from "@/components/AskExpert";
import NewsSection from "@/components/NewsSection";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-12 text-primary">Averted</h1>
        <MainButtons />
      </section>

      {/* Expert Consultation Section */}
      <section className="min-h-screen bg-muted/30 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-12">Expert Consultation</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <AskExpert />
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4">AI Assistant</h3>
              <p className="text-muted-foreground mb-4">
                Get instant assistance with our AI-powered helper
              </p>
              <Button className="w-full">Ask AI Assistant</Button>
            </div>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="min-h-screen py-20">
        <NewsSection />
      </section>

      {/* Resources Section */}
      <section className="bg-muted/30 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-8">Important Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/blog/earthquake-drills" className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Earthquake Drills</h3>
              <p className="text-sm text-muted-foreground">Learn essential earthquake safety procedures</p>
            </a>
            <a href="/blog/earthquake-history" className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Earthquake History</h3>
              <p className="text-sm text-muted-foreground">Understanding past earthquakes and their impact</p>
            </a>
            <a href="/blog/preparedness" className="p-6 bg-card rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Be Prepared</h3>
              <p className="text-sm text-muted-foreground">Essential tips for earthquake preparedness</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;