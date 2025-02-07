
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { MapPin } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import Comments from "@/components/Comments";

interface Profile {
  username: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  image_url: string | null;
  likes: number | null;
  user_likes: string[] | null;
  profiles: Profile;
}

interface MissingPerson {
  id: string;
  name: string;
  last_seen_location: string;
  age: number | null;
  gender: string | null;
  identifying_features: string | null;
  image_url: string | null;
  status: string;
  reporter_contact: string | null;
  reporter_id: string | null;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
}

const MissingPersonsList = () => {
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    fetchMissingPersons();
  }, []);

  const fetchMissingPersons = async () => {
    try {
      const { data, error } = await supabase
        .from('missing_persons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMissingPersons(data || []);

      const commentsPromises = data?.map(async (person) => {
        const { data: commentData, error: commentError } = await supabase
          .from('missing_person_comments')
          .select(`
            id,
            content,
            created_at,
            user_id,
            image_url,
            likes,
            user_likes,
            profiles (
              username
            )
          `)
          .eq('missing_person_id', person.id)
          .order('created_at', { ascending: true });

        if (commentError) throw commentError;
        return { personId: person.id, comments: commentData };
      });

      if (commentsPromises) {
        const commentsResults = await Promise.all(commentsPromises);
        const commentsMap: Record<string, Comment[]> = {};
        commentsResults.forEach(({ personId, comments }) => {
          commentsMap[personId] = comments;
        });
        setComments(commentsMap);
      }
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

  const handleCommentAdded = (personId: string, newComment: Comment) => {
    setComments(prev => ({
      ...prev,
      [personId]: [...(prev[personId] || []), newComment]
    }));
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
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#ea384c] mb-4">
            Previous Missing Reports
          </h1>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={() => navigate('/')}
              className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white transition-colors"
            >
              Back to Home
            </Button>
          </div>
        </header>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {missingPersons.map((person) => (
            <div
              key={person.id}
              className="bg-white rounded-3xl shadow-sm overflow-hidden transition-all hover:shadow-md"
            >
              {person.image_url ? (
                <div className="aspect-square overflow-hidden">
                  <img
                    src={person.image_url}
                    alt={`${person.name}'s photo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400">No Photo Available</span>
                </div>
              )}

              <div className="p-4">
                <div className="bg-[#ea384c] text-white py-2 px-4 rounded-full mb-4">
                  <p className="text-center">
                    {person.name} - {person.age} years
                  </p>
                </div>

                {expandedId === person.id ? (
                  <>
                    <div className="space-y-4 mb-4">
                      <div>
                        <h3 className="font-semibold">Identifying Features:</h3>
                        <p className="text-gray-600">{person.identifying_features || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Gender:</h3>
                        <p className="text-gray-600">{person.gender || 'Not specified'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Contact Information:</h3>
                        <p className="text-gray-600">{person.reporter_contact || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold">Last Seen:</h3>
                        <p className="text-gray-600">{person.last_seen_location}</p>
                      </div>
                      
                      {person.latitude && person.longitude && (
                        <div className="mt-4">
                          <LocationPicker
                            initialLat={person.latitude}
                            initialLng={person.longitude}
                            onLocationSelected={() => {}}
                            readOnly={true}
                          />
                        </div>
                      )}

                      <Comments
                        comments={comments[person.id] || []}
                        itemId={person.id}
                        session={session}
                        onCommentAdded={handleCommentAdded}
                        tableName="missing_person_comments"
                      />

                      <Button
                        onClick={() => setExpandedId(null)}
                        className="w-full mt-4 bg-gray-100 text-gray-600 hover:bg-gray-200"
                      >
                        See Less
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button
                    onClick={() => setExpandedId(person.id)}
                    className="w-full bg-[#ea384c] text-white hover:bg-[#d42d3f]"
                  >
                    See More
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissingPersonsList;
