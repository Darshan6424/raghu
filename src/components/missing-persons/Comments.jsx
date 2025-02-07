
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "../LocationPicker";

const Comments = ({ comments = [], personId, session, onCommentAdded }) => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleCommentSubmit = async () => {
    if (!session?.user) {
      toast({
        title: "Error",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }

    const commentContent = newComment?.trim();
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
          id,
          content,
          created_at,
          user_id,
          image_url,
          profiles (
            username
          )
        `)
        .single();

      if (error) throw error;

      onCommentAdded(data);
      setNewComment('');

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Previous Comments:</h2>
      
      <div className="space-y-6">
        {comments.map((comment, index) => (
          <div key={comment.id} className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-[#ea384c] rounded-full flex items-center justify-center text-white">
                {index + 1}
              </div>
              <div className="flex-1">
                <Input 
                  value={comment.content}
                  readOnly
                  className="w-full bg-gray-50"
                />
              </div>
              {comment.image_url && (
                <div className="w-32 h-32 rounded-lg overflow-hidden">
                  <img 
                    src={comment.image_url} 
                    alt="Comment attachment" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
            
            {comment.latitude && comment.longitude && (
              <div className="relative h-[200px] rounded-lg overflow-hidden">
                <LocationPicker
                  initialLat={comment.latitude}
                  initialLng={comment.longitude}
                  readOnly={true}
                  onLocationSelected={() => {}}
                  markers={[
                    {
                      lat: comment.latitude,
                      lng: comment.longitude,
                      popup: "Location specified in comment"
                    }
                  ]}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {session?.user ? (
        <div className="space-y-4">
          <Input
            placeholder="Comment Any clues"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full"
          />
          <Button
            onClick={handleCommentSubmit}
            className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white"
          >
            Submit Comment
          </Button>
        </div>
      ) : (
        <p className="text-gray-500">Please log in to comment</p>
      )}
    </div>
  );
};

export default Comments;
