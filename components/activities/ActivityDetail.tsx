"use client";

import { Activity } from "@/lib/types/models";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Upload, Clock } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAuthStore } from "@/lib/stores/authStore";
import { useEffect, useState } from "react";

interface ActivityDetailProps {
  activity: Activity;
  onUploadClick?: () => void;
}

export function ActivityDetail({ activity, onUploadClick }: ActivityDetailProps) {
  const { isAuthenticated } = useAuthStore();
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
      return "Expired";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} ${hours} hour${hours > 1 ? 's' : ''}`;
    } else if (hours > 0) {
      return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-2xl">{activity.name}</CardTitle>
              {isLongTerm && (
                <Badge variant="secondary" className="w-fit">
                  Long-term Activity
                </Badge>
              )}
            </div>
            {isAuthenticated && onUploadClick && (
              <Button onClick={onUploadClick} size="lg">
                <Upload className="h-4 w-4 mr-2" />
                Upload Artwork
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Activity Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            {!isLongTerm && activity.deadline && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Calendar className="h-4 w-4" />
                  <span>Deadline</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {formatDeadline(activity.deadline)}
                </p>
              </div>
            )}
            
            {!isLongTerm && timeRemaining && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  <span>Time Remaining</span>
                </div>
                <p className="text-sm text-muted-foreground ml-6">
                  {timeRemaining}
                </p>
              </div>
            )}
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Upload className="h-4 w-4" />
                <span>Upload Limit</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {activity.max_uploads_per_user} {activity.max_uploads_per_user === 1 ? 'upload' : 'uploads'} per user
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Description</h3>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ReactMarkdown>{activity.description}</ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
