import apiClient from './client';
import { ApiResponse, AuthResponse } from '@/lib/types/api';
import { LoginFormData, RegisterFormData } from '@/lib/types/forms';

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
