
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import LocationPicker from "./LocationPicker";
import { useAuth } from "./AuthProvider";

const DamageReportForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  const [damageReport, setDamageReport] = useState({
    location: "",
    description: "",
    image: null as File | null,
    latitude: 28.3949,
    longitude: 84.1240,
    hasCasualties: "no",
  });

  if (!session) {
    return (
      <div className="min-h-screen py-20 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
        <p className="mb-4">You need to be logged in to submit a damage report.</p>
        <Button onClick={() => navigate('/auth')}>Sign In</Button>
      </div>
    );
  }

  const handleImageUpload = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `damage-reports/${fileName}`;

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
    setDamageReport(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (damageReport.image) {
        imageUrl = await handleImageUpload(damageReport.image);
      }

      const { error } = await supabase
        .from('damage_reports')
        .insert([{
          location: damageReport.location,
          description: damageReport.description,
          image_url: imageUrl,
          latitude: damageReport.latitude,
          longitude: damageReport.longitude,
          has_casualties: damageReport.hasCasualties === "yes",
          reporter_id: session.user.id,
        }]);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Damage report submitted successfully",
      });
      
      navigate('/damage-reports-list');
    } catch (error) {
      console.error('Error submitting damage report:', error);
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
    <section id="damage-report" className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold mb-8 text-center text-[#ea384c]">Report Damage</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6">
            {/* Image Upload Section */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center space-y-4 bg-white relative min-h-[300px]">
              {damageReport.image ? (
                <div className="w-full h-full relative">
                  <img 
                    src={URL.createObjectURL(damageReport.image)} 
                    alt="Preview" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <Button
                    type="button"
                    onClick={() => setDamageReport({ ...damageReport, image: null })}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <label className="cursor-pointer text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setDamageReport({ ...damageReport, image: e.target.files?.[0] || null })}
                    className="hidden"
                  />
                  <Plus className="w-12 h-12 text-[#ea384c] mx-auto mb-2" />
                  <span className="text-gray-600">Add Photo</span>
                </label>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <Input
                placeholder="Location"
                value={damageReport.location}
                onChange={(e) => setDamageReport({ ...damageReport, location: e.target.value })}
                required
                className="border-2 border-gray-200 rounded-lg h-12"
              />
              <Textarea
                placeholder="Describe The Damage"
                value={damageReport.description}
                onChange={(e) => setDamageReport({ ...damageReport, description: e.target.value })}
                required
                className="border-2 border-gray-200 rounded-lg min-h-[120px] resize-none"
              />
              <div className="space-y-2">
                <p className="text-lg">Do You Suspect Human Casualties?</p>
                <RadioGroup
                  value={damageReport.hasCasualties}
                  onValueChange={(value) => setDamageReport({ ...damageReport, hasCasualties: value })}
                  className="flex items-center gap-8"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" className="border-2 border-[#ea384c]" />
                    <Label htmlFor="yes" className="text-lg">YES</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" className="border-2 border-[#ea384c]" />
                    <Label htmlFor="no" className="text-lg">NO</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="border-2 border-gray-200 rounded-lg p-4">
            <LocationPicker
              onLocationSelected={handleLocationSelected}
              initialLat={damageReport.latitude}
              initialLng={damageReport.longitude}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4">
            <Button 
              type="submit" 
              className="bg-[#ea384c] hover:bg-[#d62e3f] text-white px-8"
              disabled={loading}
            >
              Submit Report
            </Button>
            <Button 
              type="button"
              variant="outline" 
              className="border-2 border-[#ea384c] text-[#ea384c] hover:bg-[#ea384c] hover:text-white px-8"
              onClick={() => navigate('/damage-reports-list')}
            >
              View All Reports
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default DamageReportForm;
