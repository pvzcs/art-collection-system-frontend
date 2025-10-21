import apiClient from './client';
import { ApiResponse, PaginationParams } from '@/lib/types/api';
import { Artwork, User } from '@/lib/types/models';

/**
 * Get review queue with pending artworks (admin only)
 * @param params - Pagination parameters
 * @returns Promise with paginated artworks response
 */
export const getReviewQueue = async (params?: PaginationParams): Promise<ApiResponse<{ artworks: Artwork[]; total: number; page: number; page_size: number }>> => {
  const response = await apiClient.get<ApiResponse<{ artworks: Artwork[]; total: number; page: number; page_size: number }>>('/admin/review-queue', {
    params,
  });
  return response.data;
};

/**
 * Review a single artwork (admin only)
 * @param id - Artwork ID
 * @param approved - Whether to approve the artwork
 * @returns Promise with API response
 */
export const reviewArtwork = async (id: number, approved: boolean): Promise<ApiResponse<void>> => {
  const response = await apiClient.put<ApiResponse<void>>(`/admin/artworks/${id}/review`, {
    approved,
  });
  return response.data;
};

/**
 * Batch review multiple artworks (admin only)
 * @param artworkIds - Array of artwork IDs
 * @param approved - Whether to approve the artworks
 * @returns Promise with API response containing updated count
 */
export const batchReviewArtworks = async (artworkIds: number[], approved: boolean): Promise<ApiResponse<{ updated_count: number }>> => {
  const response = await apiClient.put<ApiResponse<{ updated_count: number }>>('/admin/artworks/batch-review', {
    artwork_ids: artworkIds,
    approved,
  });
  return response.data;
};

/**
 * Get paginated list of all users (admin only)
 * @param params - Pagination parameters
 * @returns Promise with paginated users response
 */
export const getUsers = async (params?: PaginationParams): Promise<ApiResponse<{ users: User[]; total: number; page: number; page_size: number }>> => {
  const response = await apiClient.get<ApiResponse<{ users: User[]; total: number; page: number; page_size: number }>>('/admin/users', {
    params,
  });
  return response.data;
};

/**
 * Update user role (admin only)
 * @param userId - User ID
 * @param role - New role ('user' or 'admin')
 * @returns Promise with API response
 */
export const updateUserRole = async (userId: number, role: 'user' | 'admin'): Promise<ApiResponse<void>> => {
  const response = await apiClient.put<ApiResponse<void>>(`/admin/users/${userId}/role`, {
    role,
  });
  return response.data;
};

/**
 * Get statistics for a specific user (admin only)
 * @param userId - User ID
 * @returns Promise with user statistics
 */
export const getUserStatistics = async (userId: number): Promise<ApiResponse<{
  user_id: number;
  total_artworks: number;
  approved_artworks: number;
  pending_artworks: number;
  activities_participated: number;
}>> => {
  const response = await apiClient.get<ApiResponse<{
    user_id: number;
    total_artworks: number;
    approved_artworks: number;
    pending_artworks: number;
    activities_participated: number;
  }>>(`/admin/users/${userId}/statistics`);
  return response.data;
};

/**
 * Get all artworks for a specific activity (admin only)
 * @param activityId - Activity ID
 * @param params - Pagination parameters
 * @returns Promise with paginated artworks response
 */
export const getActivityArtworks = async (activityId: number, params?: PaginationParams): Promise<ApiResponse<{ 
  artworks: Artwork[]; 
  total: number; 
  page: number; 
  page_size: number 
}>> => {
  const response = await apiClient.get<ApiResponse<{ 
    artworks: Artwork[]; 
    total: number; 
    page: number; 
    page_size: number 
  }>>(`/admin/activities/${activityId}/artworks`, {
    params,
  });
  return response.data;
};
