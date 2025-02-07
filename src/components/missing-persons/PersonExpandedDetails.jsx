
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare } from "lucide-react";
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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">Details</p>
          <p className="text-gray-900">{person.identifying_features || "Not provided"}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm font-medium mb-2">Contact Information</p>
          <p className="text-gray-900">{person.reporter_contact}</p>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-sm font-medium mb-2">Last Seen Location</p>
        <div className="flex items-center justify-between">
          <p className="text-gray-900">{person.last_seen_location}</p>
          {person.latitude && person.longitude && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShowMapToggle}
              className="text-gray-700"
            >
              <MapPin className="h-4 w-4 mr-2" />
              View on Map
            </Button>
          )}
        </div>
      </div>

      {showMap && person.latitude && person.longitude && (
        <div className="rounded-lg overflow-hidden border h-[300px]">
          <LocationPicker
            initialLat={person.latitude}
            initialLng={person.longitude}
            onLocationSelected={() => {}}
            readOnly={true}
            markers={[
              {
                lat: person.latitude,
                lng: person.longitude,
                popup: `${person.name} was last seen here`
              }
            ]}
          />
        </div>
      )}

      {isOwner && (
        <div className="flex gap-3">
          <Button
            variant="default"
            onClick={() => onStatusUpdate(person.id, person.status === 'found' ? 'missing' : 'found')}
            className="w-full bg-[#ea384c] hover:bg-[#d42d3f] text-white"
          >
            Mark as {person.status === 'found' ? 'Missing' : 'Found'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Delete Report
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Report</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this report? This action cannot be undone.
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

      <Button
        variant="outline"
        onClick={onToggleComments}
        className="w-full flex items-center justify-center gap-2"
      >
        <MessageSquare className="h-4 w-4" />
        View Comments
      </Button>
    </div>
  );
};

export default PersonExpandedDetails;
