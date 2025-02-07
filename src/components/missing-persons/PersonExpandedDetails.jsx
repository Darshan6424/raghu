
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Maximize2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";

const PersonExpandedDetails = ({ 
  person, 
  isOwner,
  showMap,
  onShowMapToggle,
  onStatusUpdate,
  onDelete,
  onToggleComments,
}) => {
  return (
    <div className="flex-1 space-y-6">
      <div className="space-y-4">
        <div className="p-4 border-2 rounded-lg">
          <h2 className="text-2xl font-semibold mb-2">{person.name}</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-gray-600 mb-1">Identifying Features</p>
              <p className="text-gray-900">{person.identifying_features || "Not provided"}</p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 mb-1">Age</p>
                <p className="text-gray-900">{person.age}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Gender</p>
                <p className="text-gray-900">{person.gender}</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Contacts of the person who reported</p>
                <p className="text-gray-900">{person.reporter_contact}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <p className="text-gray-600 mb-1">Last Seen at</p>
                <p className="text-gray-900">{person.last_seen_location}</p>
              </div>
              {person.latitude && person.longitude && (
                <Button
                  onClick={onShowMapToggle}
                  className="bg-[#ea384c] text-white hover:bg-[#ea384c]/90"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View Location
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h2 className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl">Can You</span>
            <span className="text-[#ea384c] text-3xl font-bold">HELP?</span>
          </h2>

          <Input
            placeholder="Comment Any clues"
            className="mb-4 border-2 rounded-lg"
          />

          <div className="border-2 rounded-lg p-4 space-y-2">
            <p className="font-medium">Pinpoint Location:</p>
            <div className="relative h-[200px] bg-gray-100 rounded-lg">
              {showMap && person.latitude && person.longitude ? (
                <>
                  <div className="absolute top-2 right-2 z-10">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white"
                      onClick={() => {}}
                    >
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                  </div>
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
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-center">
                  ---Space for Map---<br />
                  *Keep map section as it is*
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="link"
            className="text-[#ea384c] hover:text-[#ea384c]/80 p-0 h-auto font-semibold"
            onClick={onToggleComments}
          >
            All Comments
          </Button>

          <Button
            variant="outline"
            className="border-2 rounded-lg p-6 flex flex-col items-center gap-2"
            onClick={() => {}}
          >
            <Plus className="h-6 w-6 text-[#ea384c]" />
            <span>Add Photo</span>
          </Button>
        </div>

        {isOwner && (
          <Button
            variant="default"
            onClick={() => onStatusUpdate(person.id, person.status === 'found' ? 'missing' : 'found')}
            className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white font-semibold py-6"
          >
            Mark As Found
          </Button>
        )}
      </div>
    </div>
  );
};

export default PersonExpandedDetails;

