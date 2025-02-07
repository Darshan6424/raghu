
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin, Eye, MessageSquare } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import { Badge } from "@/components/ui/badge";
import Comments from "@/components/Comments";
import { useAuth } from "@/components/AuthProvider";

interface DamageReport {
  id: string;
  location: string;
  description: string;
  image_url: string | null;
  created_at: string;
  verified: boolean;
  latitude: number | null;
  longitude: number | null;
  has_casualties: boolean;
  view_count: number;
  reporter_id: string | null;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  image_url: string | null;
  likes: number | null;
  user_likes: string[] | null;
  profiles: {
    username: string | null;
  } | null;
}

const DamageReportsList = () => {
  const [damageReports, setDamageReports] = useState<DamageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [showCommentsFor, setShowCommentsFor] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    const fetchDamageReports = async () => {
      try {
        const { data: reports, error } = await supabase
          .from('damage_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch comments for all damage reports
        const commentsPromises = reports?.map(async (report) => {
          const { data: commentData, error: commentError } = await supabase
            .from('damage_report_comments')
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
            .eq('damage_report_id', report.id)
            .order('created_at', { ascending: true });

          if (commentError) throw commentError;
          return { reportId: report.id, comments: commentData || [] };
        });

        if (commentsPromises) {
          const commentsResults = await Promise.all(commentsPromises);
          const commentsMap: Record<string, Comment[]> = {};
          commentsResults.forEach(({ reportId, comments }) => {
            commentsMap[reportId] = comments;
          });
          setComments(commentsMap);
        }

        setDamageReports(reports || []);
      } catch (error) {
        console.error('Error fetching damage reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDamageReports();
  }, []);

  const handleCommentAdded = (reportId: string, newComment: Comment) => {
    setComments(prev => ({
      ...prev,
      [reportId]: [...(prev[reportId] || []), newComment]
    }));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Find center point for reports with coordinates
  const reportsWithCoordinates = damageReports.filter(report => report.latitude && report.longitude);
  const initialCoordinates = reportsWithCoordinates.length > 0 
    ? { lat: reportsWithCoordinates[0].latitude!, lng: reportsWithCoordinates[0].longitude! }
    : { lat: 28.3949, lng: 84.1240 }; // Nepal's center coordinates

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Damage Reports</h1>
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
              readOnly={true}
              markers={reportsWithCoordinates.map(report => ({
                lat: report.latitude!,
                lng: report.longitude!,
                popup: `
                  <strong>${report.location}</strong><br/>
                  ${report.description}<br/>
                  ${new Date(report.created_at).toLocaleDateString()}
                `
              }))}
            />
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {damageReports.map((report) => (
            <div key={report.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="relative">
                {report.image_url ? (
                  <img
                    src={report.image_url}
                    alt={`Damage at ${report.location}`}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
                <div className="absolute top-4 right-4 flex gap-2">
                  {report.verified && (
                    <Badge variant="secondary">Verified</Badge>
                  )}
                  {report.has_casualties && (
                    <Badge variant="destructive">Casualties Reported</Badge>
                  )}
                </div>
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold mb-2">{report.location}</h3>
                  <p className="text-gray-600">{report.description}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => setShowCommentsFor(showCommentsFor === report.id ? null : report.id)}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{(comments[report.id] || []).length}</span>
                    </Button>
                    {report.view_count !== undefined && (
                      <div className="flex items-center gap-2 text-gray-500">
                        <Eye className="h-4 w-4" />
                        <span>{report.view_count}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                </div>

                {showCommentsFor === report.id && (
                  <div className="mt-4">
                    <Comments 
                      comments={comments[report.id] || []} 
                      itemId={report.id}
                      session={session}
                      onCommentAdded={(comment) => handleCommentAdded(report.id, comment)}
                      tableName="damage_report_comments"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DamageReportsList;
