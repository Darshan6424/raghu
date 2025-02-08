
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";
import Comments from "@/components/Comments";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
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
      } catch (error: any) {
        console.error('Error fetching damage reports:', error);
        toast({
          title: "Error",
          description: "Failed to load damage reports",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDamageReports();
  }, [toast]);

  const handleCommentAdded = (reportId: string, newComment: any) => {
    setCommentsMap(prev => ({
      ...prev,
      [reportId]: [...(prev[reportId] || []), newComment]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  // Find center point for reports with coordinates
  const reportsWithCoordinates = damageReports.filter(report => report.latitude && report.longitude);
  const initialCoordinates = reportsWithCoordinates.length > 0 
    ? { lat: reportsWithCoordinates[0].latitude!, lng: reportsWithCoordinates[0].longitude! }
    : { lat: 28.3949, lng: 84.1240 }; // Nepal's center coordinates

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-[1200px] mx-auto px-4">
        <h1 className="text-4xl font-bold text-primary text-center mb-12">
          Previous Damage Reports
        </h1>

        <div className="mb-8 flex justify-end gap-4">
          <Button 
            variant="outline"
            onClick={() => setShowMap(!showMap)}
            className="flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>

        {showMap && reportsWithCoordinates.length > 0 && (
          <div className="mb-8 border-2 rounded-lg overflow-hidden">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {damageReports.map((report, index) => (
            <div
              key={report.id}
              className="relative bg-white rounded-3xl shadow-lg overflow-hidden transform transition-transform hover:scale-105"
            >
              <div className="absolute -left-2 -top-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold z-10">
                {index + 1}
              </div>

              <div className="aspect-w-1 aspect-h-1 w-full">
                {report.image_url ? (
                  <img
                    src={report.image_url}
                    alt={`Damage at ${report.location}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-center p-4">
                    No photo available
                  </div>
                )}
              </div>

              <div className="p-6">
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
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Button 
            onClick={() => navigate('/')}
            className="bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DamageReportsList;
