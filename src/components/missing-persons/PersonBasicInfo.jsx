
import { Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const PersonBasicInfo = ({ person, comments, showComments, onToggleComments }) => {
  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-gray-600 text-sm">Last seen: {person.last_seen_location}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-[#ea384c] hover:text-[#ea384c]"
            onClick={onToggleComments}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length} Comments</span>
          </Button>
          {person.view_count !== undefined && (
            <div className="flex items-center gap-2 text-gray-500">
              <Eye className="h-4 w-4" />
              <span>{person.view_count}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-400">
          {new Date(person.created_at).toLocaleDateString()}
        </p>
      </div>
    </>
  );
};

export default PersonBasicInfo;
