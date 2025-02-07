
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

        // Fetch comments for all missing persons
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

  const handleStatusUpdate = async (personId, newStatus) => {
    try {
      const { error } = await supabase
        .from('missing_persons')
        .update({ status: newStatus })
        .eq('id', personId);

      if (error) throw error;

      setMissingPersons(prev => 
        prev.map(person => 
          person.id === personId ? { ...person, status: newStatus } : person
        )
      );

      toast({
        title: "Success",
        description: "Status updated successfully",
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (personId) => {
    try {
      const { error } = await supabase
        .from('missing_persons')
        .delete()
        .eq('id', personId);

      if (error) throw error;

      setMissingPersons(prev => prev.filter(person => person.id !== personId));
      toast({
        title: "Success",
        description: "Report deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      toast({
        title: "Error",
        description: "Failed to delete report",
        variant: "destructive",
      });
    }
  };

  const handleCommentAdded = (personId, newComment) => {
    setComments(prev => ({
      ...prev,
      [personId]: [...(prev[personId] || []), newComment]
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Missing Persons Reports</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {missingPersons.map((person, index) => (
            <PersonCard
              key={person.id}
              person={person}
              index={index + 1}
              comments={comments[person.id] || []}
              session={session}
              onStatusUpdate={handleStatusUpdate}
              onDelete={handleDelete}
              onCommentAdded={handleCommentAdded}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissingPersonsList;
