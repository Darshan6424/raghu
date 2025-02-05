
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface MissingPerson {
  id: string;
  name: string;
  last_seen_location: string;
  age: number;
  gender: string;
  identifying_features: string;
  image_url: string | null;
  status: string;
  reporter_contact: string;
  created_at: string;
}

const MissingPersonsList = () => {
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      } finally {
        setLoading(false);
      }
    };

    fetchMissingPersons();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Missing Persons Reports</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missingPersons.map((person) => (
            <div 
              key={person.id} 
              className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/missing-persons/${person.id}`)}
            >
              {person.image_url && (
                <img
                  src={person.image_url}
                  alt={`${person.name}'s photo`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{person.name}</h3>
              <p className="text-gray-600 mb-1">Last seen: {person.last_seen_location}</p>
              {person.age && <p className="text-gray-600 mb-1">Age: {person.age}</p>}
              {person.gender && <p className="text-gray-600 mb-1">Gender: {person.gender}</p>}
              {person.identifying_features && (
                <p className="text-gray-600 mb-1">Features: {person.identifying_features}</p>
              )}
              <p className="text-gray-600 mb-1">Status: {person.status}</p>
              <p className="text-gray-600 mb-1">Contact: {person.reporter_contact}</p>
              <p className="text-sm text-gray-400">
                Reported: {new Date(person.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissingPersonsList;
