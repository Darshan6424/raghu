
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Brain, HeartPulse } from "lucide-react";
import VideoSection from "@/components/VideoSection";

const AskExpert = () => {
  return (
    <div className="w-full mt-8 bg-white rounded-xl p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-[#ea384c]">Ask The Expert</h2>
        <HeartPulse className="w-8 h-8 text-[#ea384c]" />
      </div>

      <div className="space-y-6">
        {/* Emergency Contact Numbers */}
        <div className="flex items-start space-x-4">
          <div className="relative">
            <User className="w-12 h-12 text-blue-600" />
            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-500 text-xs">★</span>
              </div>
            </div>
          </div>
          <div className="space-y-1 text-left">
            <p className="text-[#ea384c] font-semibold">100 - Rescue police</p>
            <p className="text-[#ea384c] font-semibold">101 - Fire Department</p>
            <p className="text-[#ea384c] font-semibold">102 - Ambulance</p>
          </div>
        </div>

        {/* Video Section */}
        <VideoSection />

        {/* Expert Query Input */}
        <div className="relative">
          <Input
            placeholder="Describe your query to an Expert"
            className="w-full pl-4 pr-12 py-3 border-2 border-[#ea384c] rounded-full text-gray-700"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#ea384c] w-5 h-5" />
        </div>

        {/* AI Helper Input */}
        <div className="relative">
          <Input
            placeholder="Ask Our AI Helper"
            className="w-full pl-4 pr-12 py-3 border-2 border-[#ea384c] rounded-full text-gray-700"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            <Brain className="text-blue-600 w-6 h-6" />
          </div>
        </div>

        {/* Contact Information */}
        <Input
          placeholder="Your Contact information"
          className="w-full py-3 border-2 border-gray-300 rounded-full text-gray-700"
        />

        {/* Expert Selection Buttons */}
        <div className="flex gap-2">
          {["Expert 1", "Expert 2", "Expert 3"].map((expert) => (
            <Button
              key={expert}
              variant="outline"
              className="flex-1 border-2 border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white transition-colors"
            >
              {expert}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AskExpert;
