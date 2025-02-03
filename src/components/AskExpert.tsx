import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AskExpert = () => {
  return (
    <div className="w-full mt-8 bg-card rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Ask an Expert</h2>
      <div className="space-y-4">
        <Input
          placeholder="Enter your question here..."
          className="w-full"
        />
        <div className="flex gap-2">
          {["Expert 1", "Expert 2", "Expert 3"].map((expert) => (
            <Button
              key={expert}
              variant="outline"
              className="flex-1"
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