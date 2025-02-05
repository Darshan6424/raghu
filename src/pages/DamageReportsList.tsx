import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DamageReport {
  id: string;
  location: string;
  description: string;
  image_url: string | null;
  created_at: string;
  verified: boolean;
}

const DamageReportsList = () => {
  const [damageReports, setDamageReports] = useState<DamageReport[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDamageReports = async () => {
      try {
        const { data, error } = await supabase
          .from('damage_reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setDamageReports(data || []);
      } catch (error) {
        console.error('Error fetching damage reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDamageReports();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Damage Reports</h1>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
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
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  Reported: {new Date(report.created_at).toLocaleDateString()}
                </p>
                {report.verified && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                    Verified
                  </span>
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