
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import PersonCard from "@/components/missing-persons/PersonCard";
import { MapPin } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";

interface Profile {
  username: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  image_url: string | null;
  likes: number | null;
  user_likes: string[] | null;
  profiles: Profile;
}

interface MissingPerson {
  id: string;
  name: string;
  last_seen_location: string;
  age: number | null;
  gender: string | null;
  identifying_features: string | null;
  image_url: string | null;
  status: string;
  reporter_contact: string | null;
  reporter_id: string | null;
  created_at: string;
  latitude: number | null;
  longitude: number | null;
}

const MissingPersonsList = () => {
  const [missingPersons, setMissingPersons] = useState<MissingPerson[]>([]);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [showMap, setShowMap] = useState(false);
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
          return { 
            personId: person.id, 
            comments: commentData as unknown as Comment[] 
          };
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

  const handleDelete = async (personId: string) => {
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

  const handleCommentAdded = (personId: string, newComment: Comment) => {
    setComments(prev => ({
      ...prev,
      [personId]: [...(prev[personId] || []), newComment]
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Find reports with coordinates
  const reportsWithCoordinates = missingPersons.filter(person => person.latitude && person.longitude);
  const initialCoordinates = reportsWithCoordinates.length > 0 
    ? { lat: reportsWithCoordinates[0].latitude!, lng: reportsWithCoordinates[0].longitude! }
    : { lat: 28.3949, lng: 84.1240 }; // Nepal's center coordinates

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Missing Persons Reports</h1>
          <div className="flex gap-4">
            <Button 
              variant="outline"
              onClick={() => setShowMap(!showMap)}
              className="flex items-center gap-2"
            >
              <MapPin className="h-4 w-4" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>

        {showMap && reportsWithCoordinates.length > 0 && (
          <div className="mb-8">
            <LocationPicker
              initialLat={initialCoordinates.lat}
              initialLng={initialCoordinates.lng}
              onLocationSelected={() => {}}
              markers={reportsWithCoordinates.map(person => ({
                lat: person.latitude!,
                lng: person.longitude!,
                popup: `
                  <strong>${person.name}</strong><br/>
                  Last seen: ${person.last_seen_location}<br/>
                  Status: ${person.status}<br/>
                  ${new Date(person.created_at).toLocaleDateString()}
                `
              }))}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {missingPersons.map((person) => (
            <PersonCard
              key={person.id}
              person={person}
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
