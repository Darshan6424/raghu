import StatusIndicator from "@/components/StatusIndicator";
import VideoSection from "@/components/VideoSection";
import ScrollingCards from "@/components/ScrollingCards";
import AskExpert from "@/components/AskExpert";

const Index = () => {
  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto">
      {/* Header with status indicators */}
      <header className="flex justify-center gap-8">
        <StatusIndicator status="online" />
        <StatusIndicator status="away" />
        <StatusIndicator status="offline" />
      </header>

      {/* Main content */}
      <main className="mt-8">
        <VideoSection />
        <ScrollingCards />
        <AskExpert />
      </main>
    </div>
  );
};

export default Index;