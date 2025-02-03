import { cn } from "@/lib/utils";

interface StatusIndicatorProps {
  status: "online" | "away" | "offline";
  className?: string;
}

const StatusIndicator = ({ status, className }: StatusIndicatorProps) => {
  const statusColors = {
    online: "bg-green-500",
    away: "bg-yellow-500",
    offline: "bg-gray-400"
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className={cn("w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center", statusColors[status])}>
        <div className="w-8 h-8 rounded-full bg-white/90" />
      </div>
      <span className="text-sm text-muted-foreground capitalize">{status}</span>
    </div>
  );
};

export default StatusIndicator;