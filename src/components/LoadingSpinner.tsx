
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
}

const LoadingSpinner = ({ className }: LoadingSpinnerProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50 rounded-md">
      <div className={cn("animate-spin rounded-full h-8 w-8 border-b-2 border-primary", className)} />
    </div>
  );
};

export default LoadingSpinner;
