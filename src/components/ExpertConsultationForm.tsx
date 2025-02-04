
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ExpertConsultationForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
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
    <section id="expert-consultation" className="min-h-screen py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Ask an Expert</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
  );
};

export default ExpertConsultationForm;
