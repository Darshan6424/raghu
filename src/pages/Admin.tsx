
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

interface User {
  id: string;
  email: string;
  created_at: string;
  role: string;
}

interface Report {
  id: string;
  created_at: string;
  type: "missing" | "damage";
  details: any;
}

const Admin = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!session?.user.id) {
        navigate('/');
        return;
      }

      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (roleData?.role !== 'admin') {
        navigate('/');
      }
    };

    checkAdminRole();
  }, [session, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user roles joined with profiles using user_id
        const { data: userData } = await supabase
          .from('user_roles')
          .select(`
            role,
            user_id,
            profiles!user_roles_user_id_fkey (
              id,
              created_at
            )
          `);

        const formattedUsers = (userData || []).map(user => ({
          id: user.profiles.id,
          email: user.user_id, // Using user_id as email since we can't get email directly
          created_at: user.profiles.created_at,
          role: user.role
        }));

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

        setUsers(formattedUsers);
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono">{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        <TabsContent value="reports">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;

