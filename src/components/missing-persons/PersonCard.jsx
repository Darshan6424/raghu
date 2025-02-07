
import { useState } from "react";
import Comments from "../Comments";
import PersonImage from "./PersonImage";
import PersonBasicInfo from "./PersonBasicInfo";
import PersonExpandedDetails from "./PersonExpandedDetails";

const PersonCard = ({ 
  person, 
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
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-300">
      <PersonImage 
        person={person} 
        isExpanded={isExpanded} 
        onToggleExpand={toggleExpand} 
      />

      <div className="p-4">
        {!isExpanded ? (
          <PersonBasicInfo 
            person={person} 
            comments={comments}
            showComments={showComments}
            onToggleComments={() => setShowComments(!showComments)}
          />
        ) : (
          <PersonExpandedDetails 
            person={person}
            isOwner={isOwner}
            showMap={showMap}
            onShowMapToggle={() => setShowMap(!showMap)}
            onStatusUpdate={onStatusUpdate}
            onDelete={handleDelete}
            onToggleComments={() => setShowComments(!showComments)}
          />
        )}

        {showComments && (
          <div className="mt-4 animate-fade-in">
            <Comments 
              comments={comments} 
              itemId={person.id}
              session={session}
              onCommentAdded={onCommentAdded}
              tableName="missing_person_comments"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
