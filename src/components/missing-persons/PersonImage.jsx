
import { Button } from "@/components/ui/button";

const PersonImage = ({ person, isExpanded, onToggleExpand }) => {
  return (
    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2">
      <div className="absolute top-2 left-2 z-10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#ea384c] text-white flex items-center justify-center">
            1
          </div>
          <Button
            variant="link"
            className="text-[#ea384c] hover:text-[#ea384c]/80 p-0 h-auto font-semibold"
            onClick={onToggleExpand}
          >
            See Less
          </Button>
        </div>
      </div>

      <div className="w-[300px] h-[300px] bg-white rounded-lg overflow-hidden">
        {person.image_url ? (
          <img
            src={person.image_url}
            alt={`${person.name}'s photo`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <p className="text-center">
              Photo<br />
              (submitted<br />
              before by users)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonImage;
