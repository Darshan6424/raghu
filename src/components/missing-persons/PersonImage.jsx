
import { Button } from "@/components/ui/button";

const PersonImage = ({ person, isExpanded, onToggleExpand }) => {
  return (
    <div className="relative">
      {person.image_url ? (
        <img
          src={person.image_url}
          alt={`${person.name}'s photo`}
          className="w-full h-[280px] object-cover"
        />
      ) : (
        <div className="w-full h-[280px] bg-gray-100 flex items-center justify-center text-gray-400">
          <span className="text-sm">No photo available</span>
        </div>
      )}
      
      <div className="absolute top-4 right-4">
        <Button
          variant="outline"
          className="bg-white hover:bg-gray-50 text-gray-700"
          onClick={onToggleExpand}
        >
          {isExpanded ? 'See Less' : 'See More'}
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent pt-16 pb-4 px-4">
        <div className="text-white">
          <h3 className="text-xl font-semibold mb-1">{person.name}</h3>
          <div className="flex items-center gap-2 text-sm">
            <span>{person.age} years old</span>
            <span>•</span>
            <span>{person.gender}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonImage;
