import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import PersonCard from "@/components/missing-persons/PersonCard";

const MissingPersonsList = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    const fetchMissingPersons = async () => {
      try {
        const { data, error } = await supabase
          .from('missing_persons')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setMissingPersons(data || []);
      } catch (error) {
        console.error('Error fetching missing persons:', error);
        toast({
          title: "Error",
          description: "Failed to load missing persons reports",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMissingPersons();
  }, [toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary text-center mb-12">
          Previous Missing Reports
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {missingPersons.map((person, index) => (
            <div
              key={person.id}
              className="relative bg-white rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <div className="absolute -left-2 -top-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold z-10">
                {index + 1}
              </div>
              
              <div className="absolute left-4 top-4">
                <Button
                  variant="link"
                  className="text-primary hover:text-primary/90 font-semibold p-0"
                  onClick={() => navigate(`/missing-persons/${person.id}`)}
                >
                  See More
                </Button>
              </div>

              <div className="aspect-w-1 aspect-h-1 w-full">
                {person.image_url ? (
                  <img
                    src={person.image_url}
                    alt={`${person.name}'s photo`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-center p-4">
                    No photo available
                  </div>
                )}
              </div>

              <div className="bg-primary text-white p-4">
                <p className="text-center text-lg">
                  {person.name} {person.age ? `- ${person.age} years` : ''}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissingPersonsList;