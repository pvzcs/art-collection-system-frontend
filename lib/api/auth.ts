import apiClient from './client';
import { ApiResponse, AuthResponse } from '@/lib/types/api';
import { LoginFormData, RegisterFormData, ProfileUpdateData, PasswordChangeData } from '@/lib/types/forms';
import { User } from '@/lib/types/models';

/**
 * Send verification code to email for registration
 * @param email - User's email address
 * @returns Promise with API response
 */
export const sendCode = async (email: string): Promise<ApiResponse<void>> => {
  const response = await apiClient.post<ApiResponse<void>>('/auth/send-code', {
    email,
  });
  return response.data;
};

/**
 * Register a new user with email verification code
 * @param data - Registration form data
 * @returns Promise with API response containing user data
 */
export const register = async (data: RegisterFormData): Promise<ApiResponse<{ id: number; email: string; nickname: string; role: string; created_at: string }>> => {
  const response = await apiClient.post<ApiResponse<{ id: number; email: string; nickname: string; role: string; created_at: string }>>('/auth/register', data);
  return response.data;
};

/**
 * Login with email and password
 * @param data - Login form data
 * @returns Promise with API response containing JWT token and user info
 */
export const login = async (data: LoginFormData): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
  return response.data;
};

/**
 * Logout current user and invalidate JWT token
 * @returns Promise with API response
 */
export const logout = async (): Promise<ApiResponse<void>> => {
  const response = await apiClient.post<ApiResponse<void>>('/auth/logout');
  return response.data;
};

/**
 * Get current user profile information
 * @returns Promise with API response containing user data
 */
export const getProfile = async (): Promise<ApiResponse<User>> => {
  const response = await apiClient.get<ApiResponse<User>>('/user/profile');
  return response.data;
};

/**
 * Update current user profile (nickname)
 * @param data - Profile update data
 * @returns Promise with API response
 */
export const updateProfile = async (data: ProfileUpdateData): Promise<ApiResponse<void>> => {
  const response = await apiClient.put<ApiResponse<void>>('/user/profile', data);
  return response.data;
};

/**
 * Change current user password
 * @param data - Password change data
 * @returns Promise with API response
 */
export const changePassword = async (data: PasswordChangeData): Promise<ApiResponse<void>> => {
  const response = await apiClient.put<ApiResponse<void>>('/user/password', data);
  return response.data;
};
