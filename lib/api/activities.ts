import apiClient from './client';
import { ApiResponse, PaginationParams } from '@/lib/types/api';
import { Activity } from '@/lib/types/models';
import { ActivityFormData } from '@/lib/types/forms';

/**
 * Get paginated list of all activities
 * @param params - Pagination parameters
 * @returns Promise with paginated activities response
 */
export const getActivities = async (params?: PaginationParams): Promise<ApiResponse<{ activities: Activity[]; total: number; page: number; page_size: number }>> => {
  const response = await apiClient.get<ApiResponse<{ activities: Activity[]; total: number; page: number; page_size: number }>>('/activities', {
    params,
  });
  return response.data;
};

/**
 * Get details of a specific activity
 * @param id - Activity ID
 * @returns Promise with activity data
 */
export const getActivity = async (id: number): Promise<ApiResponse<Activity>> => {
  const response = await apiClient.get<ApiResponse<Activity>>(`/activities/${id}`);
  return response.data;
};

/**
 * Create a new activity (admin only)
 * @param data - Activity form data
 * @returns Promise with created activity data
 */
export const createActivity = async (data: ActivityFormData): Promise<ApiResponse<Activity>> => {
  const response = await apiClient.post<ApiResponse<Activity>>('/admin/activities', data);
  return response.data;
};

/**
 * Update an existing activity (admin only)
 * @param id - Activity ID
 * @param data - Activity form data
 * @returns Promise with API response
 */
export const updateActivity = async (id: number, data: ActivityFormData): Promise<ApiResponse<void>> => {
  const response = await apiClient.put<ApiResponse<void>>(`/admin/activities/${id}`, data);
  return response.data;
};

/**
 * Delete an activity (admin only)
 * @param id - Activity ID
 * @returns Promise with API response
 */
export const deleteActivity = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/admin/activities/${id}`);
  return response.data;
};
