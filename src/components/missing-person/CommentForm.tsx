
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadSection from "./ImageUploadSection";
import LocationPicker from "@/components/LocationPicker";
import { Maximize2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface CommentFormProps {
  commentImage: string | null;
  commentLocation: { lat: number; lng: number };
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
  onLocationSelected: (lat: number, lng: number) => void;
  onSubmit: () => void;
  initialLat?: number;
  initialLng?: number;
}

const CommentForm = ({
  commentImage,
  commentLocation,
  onImageChange,
  onImageRemove,
  onLocationSelected,
  onSubmit,
  initialLat,
  initialLng
}: CommentFormProps) => {
  const [showFullMap, setShowFullMap] = useState(false);

  return (
    <div className="space-y-6">
      <Textarea 
        placeholder="Comment Any clues" 
        className="w-full min-h-[120px]" 
      />

      <div className="grid md:grid-cols-[300px,1fr] gap-6">
        <div>
          <ImageUploadSection
            imagePreview={commentImage}
            onImageChange={onImageChange}
            onImageRemove={onImageRemove}
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-700">Pinpoint Location:</label>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFullMap(true)}
              className="flex items-center gap-2"
            >
              <Maximize2 className="h-4 w-4" />
              Maximize Map
            </Button>
          </div>
          <div className="h-[300px] w-full">
            <LocationPicker
              onLocationSelected={onLocationSelected}
              initialLat={initialLat || commentLocation.lat}
              initialLng={initialLng || commentLocation.lng}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <Button
          onClick={onSubmit}
          className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white px-8"
        >
          Submit Comment
        </Button>
      </div>

      <Dialog open={showFullMap} onOpenChange={setShowFullMap}>
        <DialogContent className="max-w-4xl">
          <div className="h-[600px]">
            <LocationPicker
              onLocationSelected={onLocationSelected}
              initialLat={initialLat || commentLocation.lat}
              initialLng={initialLng || commentLocation.lng}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentForm;
