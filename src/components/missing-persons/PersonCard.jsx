
import { Button } from "@/components/ui/button";
import { Trash2, MapPin, Eye, MessageSquare, ChevronDown, ChevronUp, Plus } from "lucide-react";
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
            onClick={toggleExpand}
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

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{person.name}</h3>
              <span className="text-gray-500">-</span>
              <span className="text-gray-500">{person.age} years</span>
            </div>
            {!isExpanded && (
              <p className="text-gray-600 text-sm">Last seen: {person.last_seen_location}</p>
            )}
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-500 text-sm">Identifying Features:</p>
                <p>{person.identifying_features || "Not provided"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Gender:</p>
                <p>{person.gender || "Not provided"}</p>
              </div>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Last Seen Location:</p>
              <p>{person.last_seen_location}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Contact Information:</p>
              <p>{person.reporter_contact}</p>
            </div>

            {isOwner && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onStatusUpdate(person.id, person.status === 'found' ? 'missing' : 'found')}
                  className="bg-[#ea384c] text-white hover:bg-[#d42d3f]"
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

            {person.latitude && person.longitude && (
              <div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                  className="mb-2"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {showMap ? 'Hide Location' : 'View Location'}
                </Button>
                {showMap && (
                  <div className="mt-2 rounded-lg overflow-hidden border">
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

            <div className="mt-4 pt-4 border-t">
              <h3 className="text-lg font-semibold mb-2">Can You Help?</h3>
              <Button
                variant="outline"
                className="w-full justify-start text-left"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {comments.length} Comments
              </Button>
            </div>
          </div>
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

        {!isExpanded && (
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
            <p className="text-sm text-gray-400">
              {new Date(person.created_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonCard;
