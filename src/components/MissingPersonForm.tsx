
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";
import { useAuth } from "./AuthProvider";

const MissingPersonForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [missingPerson, setMissingPerson] = useState({
    name: "",
    lastSeen: "",
    age: "",
    gender: "",
    features: "",
    contact: "",
    image: null as File | null,
    latitude: 28.3949,
    longitude: 84.1240,
  });

  if (!session) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-4">You need to be logged in to submit a missing person report.</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `missing-persons/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from('disaster-images')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('disaster-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleLocationSelected = (lat: number, lng: number) => {
    setMissingPerson(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMissingPerson({ ...missingPerson, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (missingPerson.image) {
        imageUrl = await handleImageUpload(missingPerson.image);
      }

      const { error } = await supabase
        .from('missing_persons')
        .insert([{
          name: missingPerson.name,
          last_seen_location: missingPerson.lastSeen,
          age: parseInt(missingPerson.age),
          gender: missingPerson.gender,
          identifying_features: missingPerson.features,
          reporter_contact: missingPerson.contact,
          image_url: imageUrl,
          latitude: missingPerson.latitude,
          longitude: missingPerson.longitude,
          reporter_id: session.user.id,
        }]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Missing person report submitted successfully",
      });
      
      navigate('/missing-persons-list');
    } catch (error) {
      console.error('Error submitting missing person report:', error);
      toast({
        title: "Error",
        description: "Failed to submit report",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="report-missing" className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-[#ea384c]">Report Missing Person</h2>
          <Button 
            onClick={() => navigate('/missing-persons-list')}
            className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white transition-colors"
          >
            View All Reports
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            {/* Image Upload Section */}
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
                    onClick={() => {
                      setImagePreview(null);
                      setMissingPerson({ ...missingPerson, image: null });
                    }}
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
                    onChange={handleImageChange}
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

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                placeholder="Name of the Lost Person"
                value={missingPerson.name}
                onChange={(e) => setMissingPerson({ ...missingPerson, name: e.target.value })}
                required
                className="border-2 rounded-lg py-3 px-4"
              />
              <Input
                placeholder="Last Seen At"
                value={missingPerson.lastSeen}
                onChange={(e) => setMissingPerson({ ...missingPerson, lastSeen: e.target.value })}
                required
                className="border-2 rounded-lg py-3 px-4"
              />
              <div className="grid grid-cols-[1fr,1fr,2fr] gap-4">
                <Input
                  placeholder="Age"
                  type="number"
                  value={missingPerson.age}
                  onChange={(e) => setMissingPerson({ ...missingPerson, age: e.target.value })}
                  className="border-2 rounded-lg py-3 px-4"
                />
                <Input
                  placeholder="Gender"
                  value={missingPerson.gender}
                  onChange={(e) => setMissingPerson({ ...missingPerson, gender: e.target.value })}
                  className="border-2 rounded-lg py-3 px-4"
                />
                <Input
                  placeholder="Phone Number (Yours)"
                  value={missingPerson.contact}
                  onChange={(e) => setMissingPerson({ ...missingPerson, contact: e.target.value })}
                  required
                  className="border-2 rounded-lg py-3 px-4"
                />
              </div>
              <Textarea
                placeholder="Identifying Features"
                value={missingPerson.features}
                onChange={(e) => setMissingPerson({ ...missingPerson, features: e.target.value })}
                className="border-2 rounded-lg py-3 px-4 min-h-[100px]"
              />
            </div>
          </div>

          {/* Map Section */}
          <div className="border-2 rounded-lg p-4 bg-white">
            <LocationPicker
              onLocationSelected={handleLocationSelected}
              initialLat={missingPerson.latitude}
              initialLng={missingPerson.longitude}
            />
          </div>

          <div className="flex justify-between items-center">
            <Button 
              type="submit" 
              className="bg-[#ea384c] hover:bg-[#d42d3f] text-white px-8 py-3 rounded-lg"
              disabled={loading}
            >
              Submit Report
            </Button>
            <Button 
              type="button"
              onClick={() => navigate('/missing-persons-list')}
              className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white px-8 py-3 rounded-lg"
            >
              View All Reports
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default MissingPersonForm;
