/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

/**
 * Authentication response containing JWT token and user info
 */
export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    role: 'user' | 'admin';
    created_at: string;
    updated_at?: string;
  };
}

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  page?: number;
  page_size?: number;
}
