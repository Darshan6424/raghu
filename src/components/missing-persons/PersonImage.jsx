
import { Button } from "@/components/ui/button";

const PersonImage = ({ person, isExpanded, onToggleExpand }) => {
  return (
    <div className="relative">
      {person.image_url ? (
        <img
          src={person.image_url}
          alt={`${person.name}'s photo`}
          className="w-full h-64 object-cover bg-white"
        />
      ) : (
        <div className="w-full h-64 bg-white flex items-center justify-center text-gray-500">
          <span>Photo<br/>(submitted before by users)</span>
        </div>
      )}
      
      <div className="absolute top-4 left-4">
        <Button
          variant="link"
          className="text-[#ea384c] hover:text-[#ea384c]/80 font-medium p-0"
          onClick={onToggleExpand}
        >
          See More
        </Button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-[#ea384c] text-white py-3 px-4">
        <div className="flex items-center gap-2">
          <span className="font-medium">{person.name}</span>
          <span>-</span>
          <span>{person.age}</span>
        </div>
      </div>
    </div>
  );
};

export default PersonImage;
