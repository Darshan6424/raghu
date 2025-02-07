
import { Button } from "@/components/ui/button";
import { Trash2, MapPin, Eye, MessageSquare } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

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
  const isOwner = session?.user?.id === person.reporter_id;

  const handleDelete = () => {
    onDelete(person.id);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold">{person.name}</h3>
            <p className="text-gray-600 text-sm">Last seen: {person.last_seen_location}</p>
          </div>
          {isOwner && (
            <div className="flex gap-2">
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
            </div>
          )}
        </div>

        <div className="space-y-2 mb-4">
          {person.age && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Age:</span>
              <span>{person.age}</span>
            </div>
          )}
          {person.gender && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Gender:</span>
              <span>{person.gender}</span>
            </div>
          )}
          {person.identifying_features && (
            <div className="flex items-center gap-2">
              <span className="text-gray-500">Features:</span>
              <span>{person.identifying_features}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Contact:</span>
            <span>{person.reporter_contact}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Reported:</span>
            <span>{new Date(person.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => setShowComments(!showComments)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length}</span>
            </Button>
            {person.view_count !== undefined && (
              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="h-4 w-4" />
                <span>{person.view_count}</span>
              </div>
            )}
          </div>
          {person.latitude && person.longitude && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {showMap ? 'Hide Location' : 'View Location'}
            </Button>
          )}
        </div>

        {showMap && person.latitude && person.longitude && (
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

        {showComments && (
          <div className="mt-4">
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
