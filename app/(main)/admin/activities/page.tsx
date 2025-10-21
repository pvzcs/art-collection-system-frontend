'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { ActivityManagement } from '@/components/admin/ActivityManagement';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorMessage } from '@/components/shared/ErrorMessage';
import { Activity } from '@/lib/types/models';
import { ActivityFormData } from '@/lib/types/forms';
import { getActivities, createActivity, updateActivity, deleteActivity } from '@/lib/api/activities';
import { toast } from 'sonner';

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await getActivities({ page: 1, page_size: 100 });
      if (response.data) {
        setActivities(response.data.activities);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to load activities';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleCreateActivity = async (data: ActivityFormData) => {
    try {
      const response = await createActivity(data);
      toast.success('Activity created successfully');
      
      // Add the new activity to the list
      if (response.data) {
        setActivities([response.data, ...activities]);
      } else {
        // Refresh the list if we don't have the new activity data
        await fetchActivities();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to create activity';
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleUpdateActivity = async (id: number, data: ActivityFormData) => {
    try {
      await updateActivity(id, data);
      toast.success('Activity updated successfully');
      
      // Update the activity in the list
      setActivities(activities.map(activity => 
        activity.id === id 
          ? { ...activity, ...data, updated_at: new Date().toISOString() }
          : activity
      ));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to update activity';
      toast.error(errorMessage);
      throw err;
    }
  };

  const handleDeleteActivity = async (id: number) => {
    try {
      await deleteActivity(id);
      toast.success('Activity deleted successfully');
      
      // Remove the activity from the list
      setActivities(activities.filter(activity => activity.id !== id));
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to delete activity';
      toast.error(errorMessage);
      throw err;
    }
  };

  return (
    <ProtectedRoute requireAdmin>
      <div className="container mx-auto py-8 px-4">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <ErrorMessage
            title="Failed to Load Activities"
            message={error}
            variant="card"
            onRetry={fetchActivities}
          />
        ) : (
          <ActivityManagement
            activities={activities}
            onCreateActivity={handleCreateActivity}
            onUpdateActivity={handleUpdateActivity}
            onDeleteActivity={handleDeleteActivity}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
