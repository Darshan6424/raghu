
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import PersonCard from "@/components/missing-persons/PersonCard";

const MissingPersonsList = () => {
  const [missingPersons, setMissingPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({});
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
          return { 
            personId: person.id, 
            comments: commentData 
          };
        });

        if (commentsPromises) {
          const commentsResults = await Promise.all(commentsPromises);
          const commentsMap = {};
          commentsResults.forEach(({ personId, comments }) => {
            commentsMap[personId] = comments;
          });
          setComments(commentsMap);
        }
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-[#ea384c] text-center mb-12">Previous Missing Reports</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {missingPersons.map((person, index) => (
            <PersonCard
              key={person.id}
              person={person}
              index={index + 1}
              comments={comments[person.id] || []}
              session={session}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissingPersonsList;
