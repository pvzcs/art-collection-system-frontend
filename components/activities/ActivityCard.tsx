import { Activity } from "@/lib/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ActivityCardProps {
  activity: Activity;
  onClick?: () => void;
}

export function ActivityCard({ activity, onClick }: ActivityCardProps) {
  const { t } = useTranslation();
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
        "cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] min-h-[160px]",
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
      aria-label={`View details for ${activity.name}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{activity.name}</CardTitle>
          {isLongTerm && (
            <Badge variant="secondary" className="shrink-0" aria-label={t('activities.longTerm')}>
              {t('activities.longTerm')}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-muted-foreground">
          {!isLongTerm && activity.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="break-words">{t('activities.deadline')}: {formatDeadline(activity.deadline)}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Upload className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>{t('activities.maxUploads')}: {activity.max_uploads_per_user}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
