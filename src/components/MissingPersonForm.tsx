
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";
import { useAuth } from "./AuthProvider";
import ImageUploadSection from "./missing-person/ImageUploadSection";
import PersonalDetailsForm from "./missing-person/PersonalDetailsForm";

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
      <div className="h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
          <p className="mb-4">You need to be logged in to submit a missing person report.</p>
          <Button onClick={() => navigate('/auth')}>Sign In</Button>
        </div>
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

  const handleFormChange = (field: string, value: string) => {
    setMissingPerson(prev => ({
      ...prev,
      [field]: value
    }));
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
    <section id="report-missing" className="h-screen py-6 px-4 flex items-center">
      <div className="max-w-4xl mx-auto w-full">
        <h2 className="text-3xl font-bold text-[#ea384c] mb-6">Report Missing Person</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-[250px,1fr] gap-4">
            <ImageUploadSection
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onImageRemove={() => {
                setImagePreview(null);
                setMissingPerson({ ...missingPerson, image: null });
              }}
            />
            <PersonalDetailsForm
              name={missingPerson.name}
              lastSeen={missingPerson.lastSeen}
              age={missingPerson.age}
              gender={missingPerson.gender}
              features={missingPerson.features}
              contact={missingPerson.contact}
              onChange={handleFormChange}
            />
          </div>

          <div className="border-2 rounded-lg p-2 bg-white h-48">
            <LocationPicker
              onLocationSelected={handleLocationSelected}
              initialLat={missingPerson.latitude}
              initialLng={missingPerson.longitude}
            />
          </div>

          <div className="flex justify-between items-center">
            <Button 
              type="submit" 
              className="bg-[#ea384c] hover:bg-[#d42d3f] text-white px-8 py-2 rounded-lg"
              disabled={loading}
            >
              Submit Report
            </Button>
            <Button 
              type="button"
              onClick={() => navigate('/missing-persons-list')}
              className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white px-8 py-2 rounded-lg"
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
