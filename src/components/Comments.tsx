
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface CommentsProps {
  comments: any[];
  itemId: string;
  session: any;
  onCommentAdded: (itemId: string, comment: any) => void;
  tableName: string;
}

const Comments = ({ comments, itemId, session, onCommentAdded, tableName }: CommentsProps) => {
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
        .from(tableName)
        .insert([{
          [`${tableName.replace("_comments", "")}_id`]: itemId,
          content: commentContent,
          user_id: session.user.id
        }])
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
        .single();

      if (error) throw error;

      onCommentAdded(itemId, data);
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
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold mb-2">Comments</h4>
      <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
        {comments?.map((comment) => (
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
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button
            size="sm"
            onClick={handleCommentSubmit}
          >
            Post
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">Please log in to comment</p>
      )}
    </div>
  );
};

export default Comments;
