"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ActivityDetail } from "@/components/activities/ActivityDetail";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getActivity } from "@/lib/api/activities";
import { Activity } from "@/lib/types/models";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArtworkUpload } from "@/components/artworks/ArtworkUpload";
import { useTranslation } from "@/lib/i18n/useTranslation";

export default function ActivityDetailPage() {
  return (
    <ProtectedRoute>
      <ActivityDetailPageContent />
    </ProtectedRoute>
  );
}

function ActivityDetailPageContent() {
  const params = useParams();
  const router = useRouter();
  const activityId = parseInt(params.id as string);
  const { t } = useTranslation();
  
  const [activity, setActivity] = useState<Activity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivity = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getActivity(activityId);
      
      if (response.code === 0 && response.data) {
        setActivity(response.data);
      } else {
        setError(response.message || "Failed to load activity");
        toast.error(response.message || "Failed to load activity");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Failed to load activity";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activityId) {
      fetchActivity();
    }
  }, [activityId]);

  const [showUploadDialog, setShowUploadDialog] = useState(false);

  const handleUploadClick = () => {
    setShowUploadDialog(true);
  };

  const handleUploadSuccess = () => {
    setShowUploadDialog(false);
    // Refresh activity data to show updated artwork count
    fetchActivity();
    toast.success(t('artworks.uploadSuccess'));
  };

  const handleBackClick = () => {
    router.push("/activities");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text={t('common.loading')} />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-lg text-muted-foreground mb-4">
            {error || t('activities.activityNotFound')}
          </p>
          <Button onClick={handleBackClick} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('activities.backToActivities')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Button onClick={handleBackClick} variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('activities.backToActivities')}
        </Button>

        <ActivityDetail
          activity={activity}
          onUploadClick={handleUploadClick}
        />

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('artworks.upload')}</DialogTitle>
              <DialogDescription>
                {t('artworks.upload')} - {activity.name}
              </DialogDescription>
            </DialogHeader>
            <ArtworkUpload
              activityId={activityId}
              onSuccess={handleUploadSuccess}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
