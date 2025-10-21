import { Activity } from "@/lib/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  const isLongTerm = !activity.deadline;
  
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]",
        onClick && "hover:border-primary"
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{activity.name}</CardTitle>
          {isLongTerm && (
            <Badge variant="secondary" className="shrink-0">
              Long-term
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          {!isLongTerm && activity.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Deadline: {formatDeadline(activity.deadline)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            <span>Max uploads: {activity.max_uploads_per_user}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
