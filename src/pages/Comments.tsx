
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MessageSquare, Maximize2, MapPin, User, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LocationPicker from "@/components/LocationPicker";

const Comments = () => {
  const [selectedMapComment, setSelectedMapComment] = useState<number | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['missingPersonComments', id],
    queryFn: async () => {
      if (!id) throw new Error('Missing person ID is required');
      
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
    },
    enabled: !!id // Only run the query if we have an ID
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button
            onClick={() => navigate(`/detailed-report/${id}`)}
            variant="ghost"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Report
          </Button>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Previous Comments:</h2>
        
        <div className="space-y-8">
          {comments.map((comment, index) => (
            <div key={comment.id} className="relative border-b pb-8 last:border-0">
              <div className="absolute -left-4 -top-4 w-8 h-8 bg-[#ea384c] text-white rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              
              <div className="grid md:grid-cols-[1fr,300px] gap-6 mt-4">
                <div className="space-y-4">
                  <p className="text-gray-700 bg-white p-4 rounded-lg shadow-sm">
                    {comment.content}
                  </p>
                  
                  {(comment.latitude && comment.longitude) && (
                    <div className="relative">
                      <div className="h-[200px] rounded-lg overflow-hidden">
                        <LocationPicker
                          onLocationSelected={() => {}}
                          initialLat={Number(comment.latitude)}
                          initialLng={Number(comment.longitude)}
                          readOnly={true}
                        />
                      </div>
                      <button
                        onClick={() => setSelectedMapComment(index)}
                        className="absolute top-2 right-2 p-1 bg-white rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>{comment.profiles?.username || 'Anonymous'}</span>
                    <span>•</span>
                    <span>{new Date(comment.created_at).toLocaleString()}</span>
                  </div>
                </div>
                
                {comment.image_url && (
                  <div className="h-[200px] rounded-lg overflow-hidden bg-white shadow-sm">
                    <img 
                      src={comment.image_url}
                      alt="Comment attachment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <Dialog open={selectedMapComment !== null} onOpenChange={() => setSelectedMapComment(null)}>
          <DialogContent className="max-w-4xl">
            <div className="h-[600px]">
              {selectedMapComment !== null && comments[selectedMapComment] && (
                <LocationPicker
                  onLocationSelected={() => {}}
                  initialLat={Number(comments[selectedMapComment].latitude)}
                  initialLng={Number(comments[selectedMapComment].longitude)}
                  readOnly={true}
                  markers={[
                    {
                      lat: Number(comments[selectedMapComment].latitude),
                      lng: Number(comments[selectedMapComment].longitude),
                      popup: comments[selectedMapComment].content
                    }
                  ]}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Comments;
