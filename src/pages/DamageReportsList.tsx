
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { DamageReport, Comment } from "@/types/damageReports";
import DamageReportCard from "@/components/DamageReportCard";
import DamageReportsMap from "@/components/DamageReportsMap";

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

        {showMap && <DamageReportsMap reports={damageReports} />}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {damageReports.map((report) => (
            <DamageReportCard
              key={report.id}
              report={report}
              comments={comments[report.id] || []}
              showCommentsFor={showCommentsFor}
              session={session}
              onCommentAdded={handleCommentAdded}
              onToggleComments={setShowCommentsFor}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DamageReportsList;
