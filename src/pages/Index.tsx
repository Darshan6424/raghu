import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Missing Person Form State
  const [missingPerson, setMissingPerson] = useState({
    name: "",
    lastSeen: "",
    age: "",
    gender: "",
    features: "",
    contact: "",
    image: null as File | null
  });

  // Damage Report Form State
  const [damageReport, setDamageReport] = useState({
    location: "",
    description: "",
    image: null as File | null
  });

  // Expert Question State
  const [question, setQuestion] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleImageUpload = async (file: File, path: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;

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

  const handleMissingPersonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (missingPerson.image) {
        imageUrl = await handleImageUpload(missingPerson.image, 'missing-persons');
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
          image_url: imageUrl
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

  const handleDamageReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = null;
      if (damageReport.image) {
        imageUrl = await handleImageUpload(damageReport.image, 'damage-reports');
      }

      const { error } = await supabase
        .from('damage_reports')
        .insert([{
          location: damageReport.location,
          description: damageReport.description,
          image_url: imageUrl
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

  const handleExpertQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('expert_consultations')
        .insert([{
          question: question,
          contact_info: contactInfo,
        }]);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Question submitted successfully",
      });
      setQuestion("");
      setContactInfo("");
    } catch (error) {
      console.error('Error submitting question:', error);
      toast({
        title: "Error",
        description: "Failed to submit question",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-primary/10 to-white">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-primary">Raghu</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
          Emergency Response & Support System
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('report-missing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Report Missing
          </Button>
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('damage-report')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Report Damage
          </Button>
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('first-aid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            First Aid
          </Button>
        </div>
      </section>

      {/* Report Missing Section */}
      <section id="report-missing" className="min-h-screen py-20 px-4 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Report Missing Person</h2>
          <form onSubmit={handleMissingPersonSubmit} className="space-y-6">
            <Input
              placeholder="Name"
              value={missingPerson.name}
              onChange={(e) => setMissingPerson({ ...missingPerson, name: e.target.value })}
              required
            />
            <Input
              placeholder="Last Seen Location"
              value={missingPerson.lastSeen}
              onChange={(e) => setMissingPerson({ ...missingPerson, lastSeen: e.target.value })}
              required
            />
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

      {/* Damage Report Section */}
      <section id="damage-report" className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Report Damage</h2>
          <form onSubmit={handleDamageReportSubmit} className="space-y-6">
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

      {/* First Aid Section */}
      <section id="first-aid" className="min-h-screen py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">First Aid Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Head Injuries", content: "Common in earthquakes. Keep person still, check breathing, and call emergency services immediately." },
              { title: "Fractures", content: "Immobilize the injured area, apply ice packs, and seek medical attention." },
              { title: "Cuts & Bleeding", content: "Apply direct pressure with clean cloth, elevate the wound, and clean with antiseptic if available." },
              { title: "Crush Injuries", content: "Call emergency services immediately. Do not attempt to free the person without professional help." }
            ].map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">{info.title}</h3>
                <p className="text-gray-600 mb-4">{info.content}</p>
                <Button variant="link" onClick={() => navigate(`/first-aid/${info.title.toLowerCase().replace(/\s+/g, '-')}`)}>
                  Read More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Consultation Section */}
      <section id="expert-consultation" className="min-h-screen py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Ask an Expert</h2>
          <form onSubmit={handleExpertQuestion} className="space-y-6">
            <Textarea
              placeholder="Your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
            <Input
              placeholder="Your contact information"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Submit Question
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Index;