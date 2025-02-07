
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Trash2 } from "lucide-react";
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

const PersonExpandedDetails = ({ 
  person, 
  isOwner, 
  showMap, 
  onShowMapToggle, 
  onStatusUpdate, 
  onDelete, 
  onToggleComments 
}) => {
  return (
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
              <Button variant="destructive" size="sm">
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
                <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
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
            onClick={onShowMapToggle}
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
          onClick={onToggleComments}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          View Comments
        </Button>
      </div>
    </div>
  );
};

export default PersonExpandedDetails;
