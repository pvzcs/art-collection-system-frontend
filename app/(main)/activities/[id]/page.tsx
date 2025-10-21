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

  const handleUploadClick = () => {
    // TODO: This will be implemented in task 8.3 (Artwork Upload)
    toast.info("Upload functionality will be available soon");
  };

  const handleBackClick = () => {
    router.push("/activities");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading activity..." />
      </div>
    );
  }

  if (error || !activity) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <p className="text-lg text-muted-foreground mb-4">
            {error || "Activity not found"}
          </p>
          <Button onClick={handleBackClick} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Activities
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
          Back to Activities
        </Button>

        <ActivityDetail
          activity={activity}
          onUploadClick={handleUploadClick}
        />
      </div>
    </div>
  );
}
