"use client";

import { Activity } from "@/lib/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Upload, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect, useState } from "react";
import { useTranslation } from "@/lib/i18n/useTranslation";

interface ActivityDetailProps {
  activity: Activity;
  onUploadClick?: () => void;
}

export function ActivityDetail({ activity, onUploadClick }: ActivityDetailProps) {
  const { isAuthenticated } = useAuthStore();
  const { t } = useTranslation();
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const isLongTerm = !activity.deadline;

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateTimeRemaining = (deadline: string) => {
    const now = new Date().getTime();
    const deadlineTime = new Date(deadline).getTime();
    const diff = deadlineTime - now;

    if (diff <= 0) {
      return t('activities.expired');
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} ${t('activities.days')} ${hours} ${t('activities.hours')}`;
    } else if (hours > 0) {
      return `${hours} ${t('activities.hours')} ${minutes} ${t('activities.minutes')}`;
    } else {
      return `${minutes} ${t('activities.minutes')}`;
    }
  };

  useEffect(() => {
    if (!activity.deadline) return;

    const updateTimer = () => {
      setTimeRemaining(calculateTimeRemaining(activity.deadline!));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [activity.deadline]);

  return (
    <article className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">{activity.name}</CardTitle>
              {isLongTerm && (
                <Badge variant="secondary" className="w-fit" aria-label={t('activities.longTermActivity')}>
                  {t('activities.longTermActivity')}
                </Badge>
              )}
            </div>
            {isAuthenticated && onUploadClick && (
              <Button onClick={onUploadClick} size="lg" className="min-h-[44px] w-full sm:w-auto" aria-label={t('activities.uploadArtwork')}>
                <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
                {t('activities.uploadArtwork')}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activity Info */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg" aria-label="Activity information">
            {!isLongTerm && activity.deadline && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>{t('activities.deadline')}</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {formatDeadline(activity.deadline)}
                </p>
              </div>
            )}
            
            {!isLongTerm && timeRemaining && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{t('activities.timeRemaining')}</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6" aria-live="polite">
                  {timeRemaining}
                </p>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-4 w-4" aria-hidden="true" />
                <span>{t('activities.uploadLimit')}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {activity.max_uploads_per_user} {t('activities.uploadsPerUser')}
              </p>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-2" aria-labelledby="description-heading">
            <h2 id="description-heading" className="text-lg font-semibold">{t('common.description')}</h2>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{activity.description}</ReactMarkdown>
            </div>
          </section>
        </CardContent>
      </Card>
    </article>
  );
}
