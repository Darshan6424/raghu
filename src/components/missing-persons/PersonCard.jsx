
import { Button } from "@/components/ui/button";
import { Trash2, MapPin } from "lucide-react";
import Comments from "../Comments";
import { useState } from "react";
import LocationPicker from "../LocationPicker";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const PersonCard = ({ 
  person, 
  comments = [], 
  session, 
  onStatusUpdate, 
  onDelete, 
  onCommentAdded 
}) => {
  const [showMap, setShowMap] = useState(false);
  const isOwner = session?.user?.id === person.reporter_id;

  const handleDelete = () => {
    onDelete(person.id);
  };

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
        {isOwner && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStatusUpdate(person.id, person.status === 'found' ? 'missing' : 'found')}
            >
              Mark as {person.status === 'found' ? 'Missing' : 'Found'}
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the report.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
      <p className="text-gray-600 mb-1">Contact: {person.reporter_contact}</p>
      <p className="text-sm text-gray-400 mb-4">
        Reported: {new Date(person.created_at).toLocaleDateString()}
      </p>

      {person.latitude && person.longitude && (
        <div className="mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {showMap ? 'Hide Location' : 'View Location'}
          </Button>
          
          {showMap && (
            <div className="mt-4">
              <LocationPicker
                initialLat={person.latitude}
                initialLng={person.longitude}
                onLocationSelected={() => {}}
                readOnly={true}
                markers={[
                  {
                    lat: person.latitude,
                    lng: person.longitude,
                    popup: `<strong>${person.name}</strong><br/>Last seen: ${person.last_seen_location}`
                  }
                ]}
              />
            </div>
          )}
        </div>
      )}

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
