
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ThumbsUp } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

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
  };
}

interface DamageReport {
  id: string;
  location: string;
  description: string;
  image_url: string | null;
  created_at: string;
  verified: boolean | null;
}

const DamageReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [damageReport, setDamageReport] = useState<DamageReport | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDamageReport = async () => {
      if (!id) return;

      const { data: reportData, error: reportError } = await supabase
        .from("damage_reports")
        .select("*")
        .eq("id", id)
        .single();

      if (reportError) {
        console.error("Error fetching damage report:", reportError);
        navigate("/damage-reports-list");
        return;
      }

      setDamageReport(reportData);

      // Subscribe to real-time comments
      const channel = supabase
        .channel("schema-db-changes")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "damage_report_comments",
            filter: `damage_report_id=eq.${id}`,
          },
          async () => {
            // Refresh comments when changes occur
            await fetchComments();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const fetchComments = async () => {
      const { data: commentsData, error: commentsError } = await supabase
        .from("damage_report_comments")
        .select(`
          *,
          profiles (
            username
          )
        `)
        .eq("damage_report_id", id)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        return;
      }

      setComments(commentsData);
      setLoading(false);
    };

    fetchDamageReport();
    fetchComments();
  }, [id, navigate]);

  const handleSubmitComment = async () => {
    if (!session?.user?.id || !newComment.trim()) return;

    try {
      const { error } = await supabase.from("damage_report_comments").insert({
        damage_report_id: id,
        user_id: session.user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
      toast({
        title: "Success",
        description: "Comment posted successfully",
      });
    } catch (error) {
      console.error("Error posting comment:", error);
      toast({
        title: "Error",
        description: "Failed to post comment",
        variant: "destructive",
      });
    }
  };

  const handleLikeComment = async (commentId: string, currentLikes: number, userLikes: string[]) => {
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "Please sign in to like comments",
        variant: "destructive",
      });
      return;
    }

    const userId = session.user.id;
    const hasLiked = userLikes.includes(userId);
    const newUserLikes = hasLiked
      ? userLikes.filter((id) => id !== userId)
      : [...userLikes, userId];

    try {
      const { error } = await supabase
        .from("damage_report_comments")
        .update({
          likes: hasLiked ? currentLikes - 1 : currentLikes + 1,
          user_likes: newUserLikes,
        })
        .eq("id", commentId);

      if (error) throw error;
    } catch (error) {
      console.error("Error updating like:", error);
      toast({
        title: "Error",
        description: "Failed to update like",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!damageReport) {
    return null;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Damage Report</h1>
        <Button onClick={() => navigate("/damage-reports-list")}>Back to List</Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        {damageReport.image_url && (
          <img
            src={damageReport.image_url}
            alt={`Damage at ${damageReport.location}`}
            className="w-full h-64 object-cover rounded-md mb-4"
          />
        )}
        <h2 className="text-2xl font-semibold mb-4">{damageReport.location}</h2>
        <div className="space-y-2">
          <p>{damageReport.description}</p>
          {damageReport.verified && (
            <p className="text-green-600 font-medium">✓ Verified Report</p>
          )}
          <p className="text-gray-500">
            Reported: {new Date(damageReport.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Comments</h3>
        {session ? (
          <div className="space-y-4">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
              Post Comment
            </Button>
          </div>
        ) : (
          <p className="text-gray-500">Please sign in to comment</p>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{comment.profiles?.username || "Anonymous"}</p>
                  <p className="text-gray-600 mt-1">{comment.content}</p>
                  {comment.image_url && (
                    <img
                      src={comment.image_url}
                      alt="Comment attachment"
                      className="mt-2 max-w-sm rounded-md"
                    />
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLikeComment(comment.id, comment.likes, comment.user_likes)}
                    className={
                      session?.user?.id && comment.user_likes.includes(session.user.id)
                        ? "text-blue-500"
                        : ""
                    }
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {comment.likes}
                  </Button>
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-2">
                {new Date(comment.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DamageReportDetail;
