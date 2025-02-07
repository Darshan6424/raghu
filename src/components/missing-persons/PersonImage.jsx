
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

const PersonImage = ({ person, isExpanded, onToggleExpand }) => {
  return (
    <div className="relative">
      {person.image_url ? (
        <img
          src={person.image_url}
          alt={`${person.name}'s photo`}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
          <span className="text-gray-400">No image available</span>
        </div>
      )}
      <div className="absolute top-4 right-4 flex gap-2">
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
              See Less
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-1" />
              See More
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default PersonImage;
