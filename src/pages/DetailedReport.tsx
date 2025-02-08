
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import LocationPicker from "@/components/LocationPicker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapPin, Plus } from "lucide-react";
import ImageUploadSection from "@/components/missing-person/ImageUploadSection";

const DetailedReport = () => {
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);
  const [commentLocation, setCommentLocation] = useState({ lat: 28.3949, lng: 84.1240 });
  const [commentImage, setCommentImage] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setCommentImage(null);
  };

  const handleSubmitComment = () => {
    // Handle comment submission here
    console.log("Comment submitted with location:", commentLocation);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#ea384c]">Previous Missing Reports</h1>
          <Button 
            onClick={() => navigate('/previous-detail-report')}
            className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white transition-colors"
          >
            Back to Reports
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            <div className="space-y-4">
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-center">
                Photo<br />(submitted<br />before by<br />users)
              </div>
              <div className="flex justify-center">
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Photo
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <Input placeholder="Name" className="w-full" />
              <Textarea placeholder="Identifying Features" className="w-full" />
              
              <div className="grid grid-cols-2 gap-4">
                <Input placeholder="Age" type="number" />
                <Input placeholder="Gender" />
              </div>
              
              <Input placeholder="Contacts of the person who reported" />
              
              <div className="flex gap-4 items-start">
                <Input placeholder="Last Seen at" className="flex-1" />
                <Button 
                  onClick={() => setShowMap(true)}
                  className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  View Location
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-[#ea384c]">Can You HELP?</h2>
          
          <div className="space-y-6">
            <Textarea 
              placeholder="Comment Any clues" 
              className="w-full min-h-[120px]" 
            />

            <div className="grid md:grid-cols-[300px,1fr] gap-6">
              <div>
                <ImageUploadSection
                  imagePreview={commentImage}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Pinpoint Location:</label>
                <div className="h-[300px] w-full">
                  <LocationPicker
                    onLocationSelected={(lat, lng) => setCommentLocation({ lat, lng })}
                    initialLat={commentLocation.lat}
                    initialLng={commentLocation.lng}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSubmitComment}
                className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white px-8"
              >
                Submit Comment
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogContent className="max-w-4xl">
            <div className="h-[600px]">
              <LocationPicker
                onLocationSelected={() => {}}
                initialLat={28.3949}
                initialLng={84.1240}
                readOnly={true}
                markers={[
                  {
                    lat: 28.3949,
                    lng: 84.1240,
                    popup: "Last known location"
                  }
                ]}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DetailedReport;
