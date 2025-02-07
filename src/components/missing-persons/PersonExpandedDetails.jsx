
import { Button } from "@/components/ui/button";
import { MapPin, MessageSquare, Camera } from "lucide-react";
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
    <div className="space-y-4">
      <div className="text-xl font-semibold mb-4">{person.name}</div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-500 text-sm">Identifying Features:</p>
          <p>{person.identifying_features || "Not provided"}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500 text-sm">Age:</p>
            <p>{person.age || "Not provided"}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Gender:</p>
            <p>{person.gender || "Not provided"}</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-gray-500 text-sm">Contact Information:</p>
        <p>{person.reporter_contact}</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-grow">
          <p className="text-gray-500 text-sm">Last Seen at:</p>
          <p>{person.last_seen_location}</p>
        </div>
        {person.latitude && person.longitude && (
          <Button
            variant="outline"
            className="text-[#ea384c] border-[#ea384c] hover:bg-[#ea384c] hover:text-white"
            onClick={onShowMapToggle}
          >
            <MapPin className="h-4 w-4 mr-2" />
            View Location
          </Button>
        )}
      </div>

      {showMap && person.latitude && person.longitude && (
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

      {isOwner && (
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => onStatusUpdate(person.id, person.status === 'found' ? 'missing' : 'found')}
            className="bg-[#ea384c] text-white hover:bg-[#d42d3f]"
          >
            Mark as {person.status === 'found' ? 'Missing' : 'Found'}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-[#ea384c] text-[#ea384c]">
                Delete Report
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

      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Can You <span className="text-[#ea384c]">HELP?</span></h3>
        <Button
          variant="outline"
          className="w-full justify-start text-left border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white"
          onClick={onToggleComments}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          All Comments
        </Button>
      </div>

      <div className="absolute top-4 right-4">
        <Button variant="outline" className="bg-white hover:bg-gray-100">
          <Camera className="h-4 w-4 mr-2" />
          Add Photo
        </Button>
      </div>
    </div>
  );
};

export default PersonExpandedDetails;
