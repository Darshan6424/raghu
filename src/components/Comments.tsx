
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
  tableName: "missing_person_comments" | "damage_report_comments";
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
      const foreignKeyField = tableName === 'missing_person_comments' ? 'missing_person_id' : 'damage_report_id';
      
      const { data, error } = await supabase
        .from(tableName)
        .insert([{
          [foreignKeyField]: itemId,
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
    <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
      <h4 className="text-xl font-semibold mb-4 text-[#ea384c]">Comments</h4>
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
        {comments?.map((comment, index) => (
          <div 
            key={comment.id} 
            className={`p-4 rounded-lg transition-shadow hover:shadow-md ${
              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-gray-800">
                {comment.profiles?.username || 'Anonymous'}
              </p>
              <span className="text-sm text-gray-500">
                {new Date(comment.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-600">{comment.content}</p>
          </div>
        ))}
      </div>
      {session?.user ? (
        <div className="flex gap-3 mt-4">
          <Input
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="flex-1 rounded-lg border-gray-200 focus:border-[#ea384c] focus:ring-[#ea384c]"
          />
          <Button
            onClick={handleCommentSubmit}
            className="bg-[#ea384c] hover:bg-[#d42d3f] text-white shadow-sm hover:shadow transition-all"
          >
            Post
          </Button>
        </div>
      ) : (
        <p className="text-sm text-gray-500 italic">Please log in to comment</p>
      )}
    </div>
  );
};

export default Comments;
