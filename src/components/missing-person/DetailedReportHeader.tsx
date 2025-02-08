
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DetailedReportHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-4xl font-bold text-[#ea384c]">Previous Missing Reports</h1>
      <Button 
        onClick={() => navigate('/previous-detail-report')}
        className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white transition-colors"
      >
        Back to Reports
      </Button>
    </div>
  );
};

export default DetailedReportHeader;
