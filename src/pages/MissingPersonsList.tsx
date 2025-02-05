
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

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
  reporter_id: string | null;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  image_url: string | null;
  likes: number;
  user_likes: string[];
  profiles: {
    username: string | null;
  } | null;
}

const MissingPersonsList = () => {
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});
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
              *,
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

  const handleStatusUpdate = async (personId: string, newStatus: string) => {
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

  const handleCommentSubmit = async (personId: string) => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    const commentContent = newComments[personId]?.trim();
    if (!commentContent) return;

    try {
      const { data, error } = await supabase
        .from('missing_person_comments')
        .insert([{
          missing_person_id: personId,
          content: commentContent,
          user_id: session.user.id
        }])
        .select(`
          *,
          profiles (
            username
          )
        `)
        .single();

      if (error) throw error;

      setComments(prev => ({
        ...prev,
        [personId]: [...(prev[personId] || []), data]
      }));
      setNewComments(prev => ({ ...prev, [personId]: '' }));

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

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
            <div key={person.id} className="bg-white rounded-lg shadow-sm p-6">
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
              <div className="flex items-center gap-2 mb-1">
                <p className="text-gray-600">Status: {person.status}</p>
                {session?.user?.id === person.reporter_id && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusUpdate(person.id, person.status === 'found' ? 'missing' : 'found')}
                  >
                    Mark as {person.status === 'found' ? 'Missing' : 'Found'}
                  </Button>
                )}
              </div>
              <p className="text-gray-600 mb-1">Contact: {person.reporter_contact}</p>
              <p className="text-sm text-gray-400 mb-4">
                Reported: {new Date(person.created_at).toLocaleDateString()}
              </p>

              {/* Comments section */}
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold mb-2">Comments</h4>
                <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                  {comments[person.id]?.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 p-2 rounded">
                      <p className="text-sm">{comment.content}</p>
                      <p className="text-xs text-gray-500">
                        By {comment.profiles?.username || 'Anonymous'} • 
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
                {session?.user ? (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComments[person.id] || ''}
                      onChange={(e) => setNewComments(prev => ({
                        ...prev,
                        [person.id]: e.target.value
                      }))}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleCommentSubmit(person.id)}
                    >
                      Post
                    </Button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Please log in to comment</p>
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
