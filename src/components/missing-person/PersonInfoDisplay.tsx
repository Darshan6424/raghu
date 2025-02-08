
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

interface PersonInfoDisplayProps {
  missingPerson: any;
  onViewLocation: () => void;
}

const PersonInfoDisplay = ({ missingPerson, onViewLocation }: PersonInfoDisplayProps) => {
  return (
    <div className="space-y-4">
      <Input 
        value={missingPerson?.name || ''} 
        className="w-full bg-gray-50" 
        readOnly 
      />
      <Textarea 
        value={missingPerson?.identifying_features || ''} 
        className="w-full bg-gray-50" 
        readOnly 
      />
      
      <div className="grid grid-cols-2 gap-4">
        <Input 
          value={missingPerson?.age || ''} 
          type="number" 
          className="bg-gray-50"
          readOnly 
        />
        <Input 
          value={missingPerson?.gender || ''} 
          className="bg-gray-50"
          readOnly 
        />
      </div>
      
      <Input 
        value={missingPerson?.reporter_contact || ''} 
        className="bg-gray-50"
        readOnly 
      />
      
      <div className="flex gap-4 items-start">
        <Input 
          value={missingPerson?.last_seen_location || ''} 
          className="flex-1 bg-gray-50"
          readOnly 
        />
        <Button 
          onClick={onViewLocation}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white flex items-center gap-2"
        >
          <MapPin className="h-4 w-4" />
          View Location
        </Button>
      </div>
    </div>
  );
};

export default PersonInfoDisplay;
