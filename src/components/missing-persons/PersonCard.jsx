
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const PersonCard = ({ person, index }) => {
  const navigate = useNavigate();

  const handleSeeMore = () => {
    navigate(`/missing-person/${person.id}`);
  };

  return (
    <div className="relative p-4">
      <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center text-white font-medium text-sm z-10">
        {index}
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2">
          <Button
            variant="link"
            className="absolute top-2 right-2 text-[#ea384c] hover:text-[#ea384c]/80 p-0 h-auto font-semibold"
            onClick={handleSeeMore}
          >
            See More
          </Button>

          <div className="w-full aspect-square bg-white rounded-lg overflow-hidden mb-2">
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

          <div className="bg-[#ea384c] text-white p-2 rounded-lg text-center">
            <p className="truncate">
              {person.name} - {person.age}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonCard;
