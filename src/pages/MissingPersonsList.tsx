import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

interface MissingPerson {
  id: string;
  name: string;
  age: number | null;
  image_url: string | null;
}

const MissingPersonsList = () => {
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
        <h1 className="text-4xl font-bold text-[#ea384c] text-center mb-12">
          Previous Missing Reports
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {missingPersons.map((person, index) => (
            <div
              key={person.id}
              className="relative bg-white rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <div className="absolute -left-2 -top-2 w-10 h-10 bg-[#ea384c] rounded-full flex items-center justify-center text-white font-bold z-10">
                {index + 1}
              </div>
              
              <div className="absolute left-4 top-4">
                <Button
                  variant="link"
                  className="text-[#ea384c] hover:text-[#d42d3f] font-semibold p-0"
                  onClick={() => navigate(`/missing-persons/${person.id}`)}
                >
                  See More
                </Button>
              </div>

              <div className="aspect-square">
                {person.image_url ? (
                  <img
                    src={person.image_url}
                    alt={`${person.name}'s photo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                    Photo
                    <br />
                    (submitted before by users)
                  </div>
                )}
              </div>

              <div className="bg-[#ea384c] text-white p-4">
                <p className="text-center text-lg">
                  {person.name} - {person.age || 'Unknown'} Age
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissingPersonsList;