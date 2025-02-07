
import { Eye, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

const PersonBasicInfo = ({ person, comments, showComments, onToggleComments }) => {
  return (
    <>
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{person.name}</h3>
            <span className="text-gray-500">-</span>
            <span className="text-gray-500">{person.age} years</span>
          </div>
          <p className="text-gray-600 text-sm">Last seen: {person.last_seen_location}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={onToggleComments}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length}</span>
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
