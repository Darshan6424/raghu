import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MainButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 w-full max-w-md">
      <Button 
        className="h-16 text-lg font-semibold hover:bg-primary/90 transition-all"
        onClick={() => navigate("/report-missing")}
      >
        Report Missing Person
      </Button>
      <Button 
        className="h-16 text-lg font-semibold hover:bg-primary/90 transition-all"
        onClick={() => navigate("/first-aid")}
      >
        First Aid Information
      </Button>
      <Button 
        className="h-16 text-lg font-semibold hover:bg-primary/90 transition-all"
        onClick={() => navigate("/contribute")}
      >
        Contribute Information
      </Button>
    </div>
  );
};

export default MainButtons;