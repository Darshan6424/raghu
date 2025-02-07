
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
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
  comments?: any[];
}

const DamageReportsList = () => {
  const [damageReports, setDamageReports] = useState<DamageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMap, setShowMap] = useState(false);
  const navigate = useNavigate();
  const { session } = useAuth();
  const [commentsMap, setCommentsMap] = useState<Record<string, any[]>>({});

  useEffect(() => {
    const fetchDamageReports = async () => {
      try {
        const { data: reports, error } = await supabase
          .from('damage_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Fetch comments for each report
        const comments = await Promise.all(
          reports.map(async (report) => {
            const { data: reportComments } = await supabase
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
            return { reportId: report.id, comments: reportComments || [] };
          })
        );

        const commentsObject: Record<string, any[]> = {};
        comments.forEach(({ reportId, comments }) => {
          commentsObject[reportId] = comments;
        });
        setCommentsMap(commentsObject);
        setDamageReports(reports || []);
      } catch (error) {
        console.error('Error fetching damage reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDamageReports();
  }, []);

  const handleCommentAdded = (reportId: string, newComment: any) => {
    setCommentsMap(prev => ({
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
            <div key={report.id} className="bg-white rounded-lg shadow-sm p-6">
              {report.image_url && (
                <img
                  src={report.image_url}
                  alt={`Damage at ${report.location}`}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-xl font-semibold mb-2">{report.location}</h3>
              <p className="text-gray-600 mb-4">{report.description}</p>
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-400">
                  Reported: {new Date(report.created_at).toLocaleDateString()}
                </p>
                {report.verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    Verified
                  </span>
                )}
              </div>
              <Comments
                comments={commentsMap[report.id] || []}
                itemId={report.id}
                session={session}
                onCommentAdded={handleCommentAdded}
                tableName="damage_report_comments"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DamageReportsList;
