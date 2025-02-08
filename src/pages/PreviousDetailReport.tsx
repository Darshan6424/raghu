
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface MissingPerson {
  id: string;
  name: string;
  age: number | null;
  image_url: string | null;
}

const PreviousDetailReport = () => {
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchMissingPersons();
  }, []);

  const fetchMissingPersons = async () => {
    try {
      const { data, error } = await supabase
        .from('missing_persons')
        .select('id, name, age, image_url')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissingPersons(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to load missing persons reports",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[#ea384c]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-[#ea384c]">
            Previous Missing Reports
          </h1>
          <Button 
            onClick={() => navigate('/')}
            className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white transition-colors"
          >
            Back to Home
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {missingPersons.map((person, index) => (
            <div key={person.id} className="relative">
              <div className="absolute -left-4 -top-4 w-10 h-10 bg-[#ea384c] rounded-full flex items-center justify-center text-white font-bold z-10">
                {index + 1}
              </div>
              
              <div className="bg-white rounded-lg overflow-hidden shadow-md">
                <Button
                  variant="link"
                  className="text-[#ea384c] hover:text-[#ea384c]/90 font-semibold underline absolute -left-4 top-8"
                  onClick={() => navigate(`/missing-persons/${person.id}`)}
                >
                  See More
                </Button>

                <div className="aspect-square bg-gray-100">
                  {person.image_url ? (
                    <img
                      src={person.image_url}
                      alt={`${person.name}'s photo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-center p-4">
                      Photo<br />(submitted<br />before by<br />users)
                    </div>
                  )}
                </div>

                <div className="bg-[#ea384c] text-white py-2 px-4 flex justify-between items-center">
                  <span>{person.name}</span>
                  <span>{person.age ? `${person.age}` : ''}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PreviousDetailReport;
