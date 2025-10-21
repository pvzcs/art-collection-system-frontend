import { Activity } from "@/lib/types/models";
import { ActivityCard } from "./ActivityCard";
import { Pagination } from "@/components/shared/Pagination";
import { LoadingSkeleton } from "@/components/shared/LoadingSpinner";

interface ActivityListProps {
  activities: Activity[];
  pagination: {
    currentPage: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onActivityClick?: (activity: Activity) => void;
  isLoading?: boolean;
}

export function ActivityList({
  activities,
  pagination,
  onPageChange,
  onActivityClick,
  isLoading = false,
}: ActivityListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center" role="status" aria-live="polite">
        <p className="text-lg text-muted-foreground">No activities found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Check back later for new art collection activities
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label="Activities list">
        {activities.map((activity) => (
          <div key={activity.id} role="listitem">
            <ActivityCard
              activity={activity}
              onClick={() => onActivityClick?.(activity)}
            />
          </div>
        ))}
      </div>
      
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
}
