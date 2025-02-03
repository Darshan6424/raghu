import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Missing Person Form State
  const [missingPerson, setMissingPerson] = useState({
    name: "",
    lastSeen: "",
    age: "",
    gender: "",
    features: "",
    contact: ""
  });

  // Damage Report Form State
  const [damageReport, setDamageReport] = useState({
    location: "",
    description: ""
  });

  // Expert Question State
  const [question, setQuestion] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleMissingPersonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('missing_persons')
        .insert([{
          name: missingPerson.name,
          last_seen_location: missingPerson.lastSeen,
          age: parseInt(missingPerson.age),
          gender: missingPerson.gender,
          identifying_features: missingPerson.features,
          reporter_contact: missingPerson.contact
        }]);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Missing person report submitted successfully",
      });
      setMissingPerson({
        name: "",
        lastSeen: "",
        age: "",
        gender: "",
        features: "",
        contact: ""
      });
    } catch (error) {
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
      const { error } = await supabase
        .from('damage_reports')
        .insert([{
          location: damageReport.location,
          description: damageReport.description,
        }]);

      if (error) throw error;
      toast({
        title: "Success",
        description: "Damage report submitted successfully",
      });
      setDamageReport({
        location: "",
        description: ""
      });
    } catch (error) {
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
      <section className="h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-6xl md:text-8xl font-bold mb-8 text-primary">Raghu</h1>
        <p className="text-xl text-gray-600 mb-12 text-center max-w-2xl">
          Emergency Response & Support System
        </p>
        <div className="flex gap-4">
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('report-missing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Report Missing
          </Button>
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('first-aid')?.scrollIntoView({ behavior: 'smooth' })}
          >
            First Aid
          </Button>
          <Button
            className="text-lg px-8 py-6"
            onClick={() => document.getElementById('contribute')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Contribute
          </Button>
        </div>
      </section>

      {/* Report Missing Section */}
      <section id="report-missing" className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Report Missing Person</h2>
          <form onSubmit={handleMissingPersonSubmit} className="space-y-6">
            <Input
              placeholder="Name"
              value={missingPerson.name}
              onChange={(e) => setMissingPerson({ ...missingPerson, name: e.target.value })}
            />
            <Input
              placeholder="Last Seen Location"
              value={missingPerson.lastSeen}
              onChange={(e) => setMissingPerson({ ...missingPerson, lastSeen: e.target.value })}
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
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Submit Report
            </Button>
          </form>
        </div>
      </section>

      {/* First Aid Section */}
      <section id="first-aid" className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">First Aid Information</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { title: "Head Injuries", content: "Common in earthquakes. Keep person still..." },
              { title: "Fractures", content: "Immobilize the injured area..." },
              { title: "Cuts & Bleeding", content: "Apply direct pressure..." },
              { title: "Crush Injuries", content: "Call emergency services immediately..." }
            ].map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{info.title}</h3>
                <p className="text-gray-600">{info.content}</p>
                <Button variant="link" className="mt-4">Read More</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section id="contribute" className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Contribute Information</h2>
          <form onSubmit={handleDamageReportSubmit} className="space-y-6 mb-12">
            <h3 className="text-xl font-semibold">Report Damage</h3>
            <Input
              placeholder="Location"
              value={damageReport.location}
              onChange={(e) => setDamageReport({ ...damageReport, location: e.target.value })}
            />
            <Textarea
              placeholder="Describe the damage"
              value={damageReport.description}
              onChange={(e) => setDamageReport({ ...damageReport, description: e.target.value })}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Submit Damage Report
            </Button>
          </form>
        </div>
      </section>

      {/* Ask Expert Section */}
      <section className="min-h-screen py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Ask an Expert</h2>
          <form onSubmit={handleExpertQuestion} className="space-y-6">
            <Textarea
              placeholder="Your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <Input
              placeholder="Your contact information"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              Submit Question
            </Button>
          </form>
        </div>
      </section>

      {/* Blog Links Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Important Resources</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a href="/blog/earthquake-drills" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Earthquake Drills</h3>
              <p className="text-sm text-gray-600">Learn essential safety procedures</p>
            </a>
            <a href="/blog/earthquake-history" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Earthquake History</h3>
              <p className="text-sm text-gray-600">Understanding past events</p>
            </a>
            <a href="/blog/preparedness" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold mb-2">Be Prepared</h3>
              <p className="text-sm text-gray-600">Essential preparation tips</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;