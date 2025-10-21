"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ActivityList } from "@/components/activities/ActivityList";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { getActivities } from "@/lib/api/activities";
import { Activity } from "@/lib/types/models";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

export default function ActivitiesPage() {
  return (
    <ProtectedRoute>
      <ActivitiesPageContent />
    </ProtectedRoute>
  );
}

function ActivitiesPageContent() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 9;

  const fetchActivities = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await getActivities({ page, page_size: pageSize });
      
      if (response.code === 0 && response.data) {
        setActivities(response.data.activities);
        setTotalPages(Math.ceil(response.data.total / pageSize));
        setCurrentPage(page);
      } else {
        toast.error(response.message || "Failed to load activities");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to load activities");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchActivities(page);
  };

  const handleActivityClick = (activity: Activity) => {
    router.push(`/activities/${activity.id}`);
  };

  if (isLoading && activities.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading activities..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Art Collection Activities</h1>
          <p className="text-muted-foreground mt-2">
            Browse and participate in ongoing art collection events
          </p>
        </div>

        <ActivityList
          activities={activities}
          pagination={{ currentPage, totalPages }}
          onPageChange={handlePageChange}
          onActivityClick={handleActivityClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
