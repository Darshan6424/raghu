
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Report {
  id: string;
  created_at: string;
  type: "missing" | "damage";
  details: any;
}

const Admin = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user.id) {
      navigate('/');
    }
  }, [session, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all reports
        const [{ data: missingPersons }, { data: damageReports }] = await Promise.all([
          supabase.from('missing_persons').select('*'),
          supabase.from('damage_reports').select('*')
        ]);

        const formattedReports = [
          ...(missingPersons?.map(report => ({
            id: report.id,
            created_at: report.created_at,
            type: 'missing' as const,
            details: report
          })) || []),
          ...(damageReports?.map(report => ({
            id: report.id,
            created_at: report.created_at,
            type: 'damage' as const,
            details: report
          })) || [])
        ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setReports(formattedReports);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-mono">{report.id}</TableCell>
              <TableCell>{report.type}</TableCell>
              <TableCell>
                {report.type === 'missing' ? (
                  <span>{report.details.name} - {report.details.last_seen_location}</span>
                ) : (
                  <span>{report.details.location} - {report.details.description}</span>
                )}
              </TableCell>
              <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Admin;
