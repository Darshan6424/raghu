
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ImageUploadSectionProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const ImageUploadSection = ({ imagePreview, onImageChange, onImageRemove }: ImageUploadSectionProps) => {
  return (
    <div className="relative">
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
        <div className="w-[200px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-2">
          <Plus className="w-6 h-6 text-[#ea384c]" />
          <span className="text-gray-600 text-sm">Add Photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
            id="photo-upload"
          />
          <label
            htmlFor="photo-upload"
            className="absolute inset-0 cursor-pointer"
            aria-label="Upload photo"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;
