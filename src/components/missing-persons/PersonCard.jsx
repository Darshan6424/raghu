
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Comments from "../Comments";

const PersonCard = ({ 
  person, 
  comments = [], 
  session, 
  onStatusUpdate, 
  onDelete, 
  onCommentAdded 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {person.image_url && (
        <img
          src={person.image_url}
          alt={`${person.name}'s photo`}
          className="w-full h-48 object-cover rounded-md mb-4"
        />
      )}
      <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
      <p className="text-gray-600 mb-1">Last seen: {person.last_seen_location}</p>
      {person.age && <p className="text-gray-600 mb-1">Age: {person.age}</p>}
      {person.gender && <p className="text-gray-600 mb-1">Gender: {person.gender}</p>}
      {person.identifying_features && (
        <p className="text-gray-600 mb-1">Features: {person.identifying_features}</p>
      )}
      <div className="flex items-center gap-2 mb-1">
        <p className="text-gray-600">Status: {person.status}</p>
        {session?.user?.id === person.reporter_id && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate(person.id, person.status === 'found' ? 'missing' : 'found')}
            >
              Mark as {person.status === 'found' ? 'Missing' : 'Found'}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(person.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <p className="text-gray-600 mb-1">Contact: {person.reporter_contact}</p>
      <p className="text-sm text-gray-400 mb-4">
        Reported: {new Date(person.created_at).toLocaleDateString()}
      </p>

      <Comments 
        comments={comments} 
        itemId={person.id}
        session={session}
        onCommentAdded={onCommentAdded}
        tableName="missing_person_comments"
      />
    </div>
  );
};

export default PersonCard;
