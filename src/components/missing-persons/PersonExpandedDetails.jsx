
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Maximize2, ArrowLeft } from "lucide-react";
import LocationPicker from "../LocationPicker";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const PersonExpandedDetails = ({ 
  person, 
  isOwner,
  showMap,
  onShowMapToggle,
  onStatusUpdate,
  onDelete,
  onToggleComments,
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#ea384c]">Previous Missing Reports</h1>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate('/missing-persons-list')}
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
      </div>

      <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8">
        <div className="grid grid-cols-[300px,1fr] gap-8">
          {/* Left column with photo and Mark as Found button */}
          <div className="space-y-4">
            <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2">
              <div className="absolute top-2 left-2 z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#ea384c] text-white flex items-center justify-center">
                    1
                  </div>
                  <Button
                    variant="link"
                    className="text-[#ea384c] hover:text-[#ea384c]/80 p-0 h-auto font-semibold"
                    onClick={() => navigate('/missing-persons-list')}
                  >
                    See Less
                  </Button>
                </div>
              </div>

              <div className="w-[300px] h-[300px] bg-white rounded-lg overflow-hidden">
                {person.image_url ? (
                  <img
                    src={person.image_url}
                    alt={`${person.name}'s photo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    <p className="text-center">
                      Photo<br />
                      (submitted<br />
                      before by users)
                    </p>
                  </div>
                )}
              </div>
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

          {/* Right column with details */}
          <div className="space-y-6">
            <div className="border-2 border-gray-200 rounded-lg p-6 space-y-6">
              <div>
                <p className="text-gray-600 mb-1">Name</p>
                <p className="text-xl font-semibold">{person.name}</p>
              </div>
              
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
                  <p className="text-gray-600 mb-1">Contact</p>
                  <p className="text-gray-900">{person.reporter_contact}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-gray-600 mb-1">Last Seen at</p>
                  <Input 
                    value={person.last_seen_location}
                    readOnly
                    className="bg-gray-50"
                  />
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

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="flex items-baseline gap-2">
                    <span className="text-2xl">Can You</span>
                    <span className="text-[#ea384c] text-3xl font-bold">HELP?</span>
                  </h2>
                  <Button
                    variant="link"
                    className="text-[#ea384c] hover:text-[#ea384c]/80 p-0 h-auto font-semibold"
                    onClick={onToggleComments}
                  >
                    All Comments
                  </Button>
                </div>

                <Input
                  placeholder="Comment Any clues"
                  className="border-2 rounded-lg"
                />

                <div className="grid grid-cols-[1fr,auto] gap-4">
                  <div className="space-y-2">
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

                  <Button
                    variant="outline"
                    className="h-auto border-2 rounded-lg px-6 py-8 flex flex-col items-center gap-2 self-end"
                    onClick={() => {}}
                  >
                    <Plus className="h-6 w-6 text-[#ea384c]" />
                    <span>Add Photo</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonExpandedDetails;

