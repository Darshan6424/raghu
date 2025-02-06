
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const DamageReportForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [damageReport, setDamageReport] = useState({
    location: "",
    description: "",
    image: null as File | null,
  });

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
    <section id="damage-report" className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Report Damage</h2>
          <Button onClick={() => navigate('/damage-reports-list')}>
            View All Reports
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            placeholder="Location"
            value={damageReport.location}
            onChange={(e) => setDamageReport({ ...damageReport, location: e.target.value })}
            required
          />
          <Textarea
            placeholder="Describe the damage"
            value={damageReport.description}
            onChange={(e) => setDamageReport({ ...damageReport, description: e.target.value })}
            required
          />
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setDamageReport({ ...damageReport, image: e.target.files?.[0] || null })}
              className="flex-1"
            />
            <Upload className="text-gray-400" />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            Submit Damage Report
          </Button>
        </form>
      </div>
    </section>
  );
};

export default DamageReportForm;
