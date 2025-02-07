
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const PersonImage = ({ person, isExpanded, onToggleExpand }) => {
  return (
    <div className="relative rounded-t-lg overflow-hidden">
      {person.image_url ? (
        <img
          src={person.image_url}
          alt={`${person.name}'s photo`}
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">No photo available</span>
        </div>
      )}
      <div className="absolute top-4 right-4">
        <Badge variant={person.status === 'found' ? 'success' : 'destructive'}>
          {person.status === 'found' ? 'Found' : 'Missing'}
        </Badge>
      </div>
      <div className="absolute top-4 left-4">
        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:bg-gray-100"
          onClick={onToggleExpand}
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-1" />
              Show Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              Show More
            </>
          )}
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-[#ea384c] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{person.name}</span>
            <span>•</span>
            <span>{person.age} years</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonImage;
