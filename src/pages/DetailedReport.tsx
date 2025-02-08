
import { useState } from "react";
import { useParams } from "react-router-dom";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import LocationPicker from "@/components/LocationPicker";
import Comments from "@/components/Comments";
import DetailedReportHeader from "@/components/missing-person/DetailedReportHeader";
import PersonInfoDisplay from "@/components/missing-person/PersonInfoDisplay";
import CommentForm from "@/components/missing-person/CommentForm";

const DetailedReport = () => {
  const { id } = useParams();
  const [showMap, setShowMap] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentLocation, setCommentLocation] = useState({ lat: 28.3949, lng: 84.1240 });
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: missingPerson, isLoading: isLoadingPerson } = useQuery({
    queryKey: ['missingPerson', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missing_persons')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    }
  });

  const { data: comments = [], isLoading: isLoadingComments } = useQuery({
    queryKey: ['missingPersonComments', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('missing_person_comments')
        .select(`
          *,
          profiles (username)
        `)
        .eq('missing_person_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setCommentImage(null);
  };

  const handleSubmitComment = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('missing_person_comments')
        .insert([{
          missing_person_id: id,
          content: "New comment",
          latitude: commentLocation.lat,
          longitude: commentLocation.lng,
          image_url: commentImage
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Comment added successfully",
      });

      // Reset form
      setCommentImage(null);
      setCommentLocation({ lat: 28.3949, lng: 84.1240 });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive"
      });
    }
  };

  if (isLoadingPerson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <DetailedReportHeader />

        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid md:grid-cols-[300px,1fr] gap-8">
            <div>
              {missingPerson?.image_url ? (
                <div className="w-full aspect-square rounded-lg overflow-hidden">
                  <img 
                    src={missingPerson.image_url} 
                    alt={missingPerson.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-center">
                  No Photo<br />Available
                </div>
              )}

              <div className="mt-4">
                <Button
                  onClick={() => setShowComments(!showComments)}
                  className="w-full bg-[#ea384c] hover:bg-[#ea384c]/90 text-white flex items-center justify-center gap-2"
                >
                  <MessageSquare className="h-4 w-4" />
                  {showComments ? 'Hide Comments' : 'Show Comments'}
                </Button>
              </div>
            </div>

            <PersonInfoDisplay 
              missingPerson={missingPerson}
              onViewLocation={() => setShowMap(true)}
            />
          </div>
        </div>

        {showComments && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-6 text-[#ea384c]">Previous Comments</h2>
            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b pb-6 last:border-0">
                  <div className="grid md:grid-cols-[1fr,300px] gap-6">
                    <div>
                      <p className="text-gray-700 mb-4">{comment.content}</p>
                      {(comment.latitude && comment.longitude) && (
                        <div className="h-[200px] rounded-lg overflow-hidden">
                          <LocationPicker
                            onLocationSelected={() => {}}
                            initialLat={Number(comment.latitude)}
                            initialLng={Number(comment.longitude)}
                            readOnly={true}
                          />
                        </div>
                      )}
                    </div>
                    {comment.image_url && (
                      <div className="h-[200px] rounded-lg overflow-hidden">
                        <img 
                          src={comment.image_url}
                          alt="Comment attachment"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
                    <span>{comment.profiles?.username || 'Anonymous'}</span>
                    <span>{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-[#ea384c]">Can You HELP?</h2>
          
          <CommentForm 
            commentImage={commentImage}
            commentLocation={commentLocation}
            onImageChange={handleImageChange}
            onImageRemove={handleImageRemove}
            onLocationSelected={(lat, lng) => setCommentLocation({ lat, lng })}
            onSubmit={handleSubmitComment}
            initialLat={missingPerson?.latitude}
            initialLng={missingPerson?.longitude}
          />
        </div>

        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogContent className="max-w-4xl">
            <div className="h-[600px]">
              <LocationPicker
                onLocationSelected={() => {}}
                initialLat={missingPerson?.latitude || 28.3949}
                initialLng={missingPerson?.longitude || 84.1240}
                readOnly={true}
                markers={[
                  {
                    lat: missingPerson?.latitude || 28.3949,
                    lng: missingPerson?.longitude || 84.1240,
                    popup: "Last known location"
                  }
                ]}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DetailedReport;
