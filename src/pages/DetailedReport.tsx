
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import LocationPicker from "@/components/LocationPicker";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { MapPin, MessageSquare } from "lucide-react";
import ImageUploadSection from "@/components/missing-person/ImageUploadSection";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Comments from "@/components/Comments";
import { useToast } from "@/hooks/use-toast";

const DetailedReport = () => {
  const navigate = useNavigate();
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

  const handleSubmitComment = () => {
    // Handle comment submission here
    console.log("Comment submitted with location:", commentLocation);
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
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#ea384c]">Previous Missing Reports</h1>
          <Button 
            onClick={() => navigate('/previous-detail-report')}
            className="bg-white text-[#ea384c] border-2 border-[#ea384c] hover:bg-[#ea384c] hover:text-white transition-colors"
          >
            Back to Reports
          </Button>
        </div>

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

            <div className="space-y-4">
              <Input 
                value={missingPerson?.name || ''} 
                className="w-full bg-gray-50" 
                readOnly 
              />
              <Textarea 
                value={missingPerson?.identifying_features || ''} 
                className="w-full bg-gray-50" 
                readOnly 
              />
              
              <div className="grid grid-cols-2 gap-4">
                <Input 
                  value={missingPerson?.age || ''} 
                  type="number" 
                  className="bg-gray-50"
                  readOnly 
                />
                <Input 
                  value={missingPerson?.gender || ''} 
                  className="bg-gray-50"
                  readOnly 
                />
              </div>
              
              <Input 
                value={missingPerson?.reporter_contact || ''} 
                className="bg-gray-50"
                readOnly 
              />
              
              <div className="flex gap-4 items-start">
                <Input 
                  value={missingPerson?.last_seen_location || ''} 
                  className="flex-1 bg-gray-50"
                  readOnly 
                />
                <Button 
                  onClick={() => setShowMap(true)}
                  className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white flex items-center gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  View Location
                </Button>
              </div>
            </div>
          </div>
        </div>

        {showComments && (
          <Comments
            comments={comments}
            itemId={id || ''}
            tableName="missing_person_comments"
            session={null}
            onCommentAdded={(itemId, comment) => {
              console.log('Comment added:', comment);
              toast({
                title: "Success",
                description: "Comment added successfully",
              });
            }}
          />
        )}

        <div className="mt-8 bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-[#ea384c]">Can You HELP?</h2>
          
          <div className="space-y-6">
            <Textarea 
              placeholder="Comment Any clues" 
              className="w-full min-h-[120px]" 
            />

            <div className="grid md:grid-cols-[300px,1fr] gap-6">
              <div>
                <ImageUploadSection
                  imagePreview={commentImage}
                  onImageChange={handleImageChange}
                  onImageRemove={handleImageRemove}
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Pinpoint Location:</label>
                <div className="h-[300px] w-full">
                  <LocationPicker
                    onLocationSelected={(lat, lng) => setCommentLocation({ lat, lng })}
                    initialLat={missingPerson?.latitude || commentLocation.lat}
                    initialLng={missingPerson?.longitude || commentLocation.lng}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button
                onClick={handleSubmitComment}
                className="bg-[#ea384c] hover:bg-[#ea384c]/90 text-white px-8"
              >
                Submit Comment
              </Button>
            </div>
          </div>
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

