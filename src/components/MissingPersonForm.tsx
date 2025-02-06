
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";

const MissingPersonForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [missingPerson, setMissingPerson] = useState({
    name: "",
    lastSeen: "",
    age: "",
    gender: "",
    features: "",
    contact: "",
    image: null as File | null,
    latitude: null as number | null,
    longitude: null as number | null
  });

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
          longitude: missingPerson.longitude
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

  const handleLocationSelect = (latitude: number, longitude: number, locationName: string) => {
    setMissingPerson(prev => ({
      ...prev,
      lastSeen: locationName,
      latitude,
      longitude
    }));
  };

  return (
    <section id="report-missing" className="min-h-screen py-20 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Report Missing Person</h2>
          <Button onClick={() => navigate('/missing-persons-list')}>
            View All Reports
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            placeholder="Name"
            value={missingPerson.name}
            onChange={(e) => setMissingPerson({ ...missingPerson, name: e.target.value })}
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Last Seen Location
            </label>
            <LocationPicker onLocationSelect={handleLocationSelect} />
            <Input
              placeholder="Last Seen Location"
              value={missingPerson.lastSeen}
              onChange={(e) => setMissingPerson({ ...missingPerson, lastSeen: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              placeholder="Age"
              type="number"
              value={missingPerson.age}
              onChange={(e) => setMissingPerson({ ...missingPerson, age: e.target.value })}
            />
            <Input
              placeholder="Gender"
              value={missingPerson.gender}
              onChange={(e) => setMissingPerson({ ...missingPerson, gender: e.target.value })}
            />
          </div>
          <Textarea
            placeholder="Identifying Features"
            value={missingPerson.features}
            onChange={(e) => setMissingPerson({ ...missingPerson, features: e.target.value })}
          />
          <Input
            placeholder="Your Contact Information"
            value={missingPerson.contact}
            onChange={(e) => setMissingPerson({ ...missingPerson, contact: e.target.value })}
            required
          />
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setMissingPerson({ ...missingPerson, image: e.target.files?.[0] || null })}
              className="flex-1"
            />
            <Upload className="text-gray-400" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Submit Report
          </Button>
        </form>
      </div>
    </section>
  );
};

export default MissingPersonForm;
