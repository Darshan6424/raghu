
import { useState } from "react";
import Comments from "../Comments";
import PersonImage from "./PersonImage";
import PersonBasicInfo from "./PersonBasicInfo";
import PersonExpandedDetails from "./PersonExpandedDetails";

const PersonCard = ({ 
  person, 
  index,
  comments = [], 
  session, 
  onStatusUpdate, 
  onDelete, 
  onCommentAdded 
}) => {
  const [showMap, setShowMap] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isOwner = session?.user?.id === person.reporter_id;

  const handleDelete = () => {
    onDelete(person.id);
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setShowComments(false);
    }
  };

  return (
    <div className="relative">
      <div className="absolute -top-4 -left-4 w-10 h-10 bg-[#ea384c] rounded-full flex items-center justify-center text-white font-bold z-10">
        {index}
      </div>
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <PersonImage 
          person={person} 
          isExpanded={isExpanded} 
          onToggleExpand={toggleExpand} 
        />

        {isExpanded && (
          <div className="p-4">
            <PersonExpandedDetails 
              person={person}
              isOwner={isOwner}
              showMap={showMap}
              onShowMapToggle={() => setShowMap(!showMap)}
              onStatusUpdate={onStatusUpdate}
              onDelete={handleDelete}
              onToggleComments={() => setShowComments(!showComments)}
            />

            {showComments && (
              <div className="mt-4">
                <Comments 
                  comments={comments} 
                  personId={person.id}
                  session={session}
                  onCommentAdded={onCommentAdded}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
