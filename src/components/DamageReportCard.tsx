
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";
import { DamageReport, Comment } from "@/types/damageReports";
import Comments from "@/components/Comments";
import { Session } from "@supabase/supabase-js";

interface DamageReportCardProps {
  report: DamageReport;
  comments: Comment[];
  showCommentsFor: string | null;
  session: Session | null;
  onCommentAdded: (reportId: string, newComment: Comment) => void;
  onToggleComments: (reportId: string | null) => void;
}

const DamageReportCard = ({
  report,
  comments,
  showCommentsFor,
  session,
  onCommentAdded,
  onToggleComments,
}: DamageReportCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
              onClick={() => onToggleComments(showCommentsFor === report.id ? null : report.id)}
            >
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length}</span>
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
              comments={comments} 
              itemId={report.id}
              session={session}
              onCommentAdded={(comment) => onCommentAdded(report.id, comment)}
              tableName="damage_report_comments"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DamageReportCard;
