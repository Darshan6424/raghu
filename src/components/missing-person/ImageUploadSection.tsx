
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ImageUploadSectionProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const ImageUploadSection = ({ imagePreview, onImageChange, onImageRemove }: ImageUploadSectionProps) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center space-y-4 bg-white relative">
      {imagePreview ? (
        <div className="w-full h-[250px] relative">
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="w-full h-full object-cover rounded-lg"
          />
          <Button
            type="button"
            onClick={onImageRemove}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
          >
            ×
          </Button>
        </div>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full border-2 border-[#ea384c] flex items-center justify-center">
            <Plus className="w-8 h-8 text-[#ea384c]" />
          </div>
          <span className="text-gray-600">Add Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="cursor-pointer text-sm text-gray-500 hover:text-gray-700"
          >
            Click to upload
          </label>
        </>
      )}
    </div>
  );
};

export default ImageUploadSection;
