import apiClient from './client';
import { ApiResponse, PaginationParams } from '@/lib/types/api';
import { Artwork } from '@/lib/types/models';

/**
 * Upload artwork to an activity
 * @param activityId - Activity ID
 * @param file - Image file to upload
 * @returns Promise with created artwork data
 */
export const uploadArtwork = async (activityId: number, file: File): Promise<ApiResponse<Artwork>> => {
  const formData = new FormData();
  formData.append('activity_id', activityId.toString());
  formData.append('file', file);

  const response = await apiClient.post<ApiResponse<Artwork>>('/artworks', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Get details of a specific artwork
 * @param id - Artwork ID
 * @returns Promise with artwork data
 */
export const getArtwork = async (id: number): Promise<ApiResponse<Artwork>> => {
  const response = await apiClient.get<ApiResponse<Artwork>>(`/artworks/${id}`);
  return response.data;
};

/**
 * Delete an artwork
 * @param id - Artwork ID
 * @returns Promise with API response
 */
export const deleteArtwork = async (id: number): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(`/artworks/${id}`);
  return response.data;
};

/**
 * Get artworks for a specific user (personal space)
 * @param userId - User ID
 * @param params - Pagination parameters
 * @returns Promise with paginated artworks response
 */
export const getUserArtworks = async (userId: number, params?: PaginationParams): Promise<ApiResponse<{ artworks: Artwork[]; total: number; page: number; page_size: number }>> => {
  const response = await apiClient.get<ApiResponse<{ artworks: Artwork[]; total: number; page: number; page_size: number }>>(`/users/${userId}/artworks`, {
    params,
  });
  return response.data;
};

/**
 * Get artwork image via proxy endpoint
 * @param id - Artwork ID
 * @returns Promise with image blob
 */
export const getArtworkImage = async (id: number): Promise<Blob> => {
  const response = await apiClient.get<Blob>(`/artworks/${id}/image`, {
    responseType: 'blob',
  });
  return response.data;
};
