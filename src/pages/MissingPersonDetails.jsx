
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import PersonExpandedDetails from "@/components/missing-persons/PersonExpandedDetails";
import Comments from "@/components/missing-persons/Comments";

const MissingPersonDetails = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const { toast } = useToast();
  const { session } = useAuth();

  useEffect(() => {
    const fetchPerson = async () => {
      try {
        const { data, error } = await supabase
          .from('missing_persons')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPerson(data);

        // Fetch comments after person data is loaded
        const { data: commentsData, error: commentsError } = await supabase
          .from('missing_person_comments')
          .select(`
            *,
            profiles (
              username
            )
          `)
          .eq('missing_person_id', id)
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;
        setComments(commentsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [id, toast]);

  const handleStatusUpdate = async (personId, newStatus) => {
    try {
      const { error } = await supabase
        .from('missing_persons')
        .update({ status: newStatus })
        .eq('id', personId);

      if (error) throw error;

      setPerson(prev => ({ ...prev, status: newStatus }));
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

  const handleCommentAdded = (newComment) => {
    setComments(prev => [newComment, ...prev]);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!person) {
    return <div className="min-h-screen flex items-center justify-center">Person not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <PersonExpandedDetails
            person={person}
            isOwner={session?.user?.id === person.reporter_id}
            showMap={showMap}
            onShowMapToggle={() => setShowMap(!showMap)}
            onStatusUpdate={handleStatusUpdate}
            onToggleComments={() => setShowComments(!showComments)}
          />
          
          {showComments && (
            <div className="mt-6 border-t pt-6">
              <Comments
                comments={comments}
                personId={person.id}
                session={session}
                onCommentAdded={handleCommentAdded}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissingPersonDetails;
