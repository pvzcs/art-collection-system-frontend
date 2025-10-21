// API response types

export interface ApiResponse<T> {
  code: number;
  message: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nickname: string;
    role: 'user' | 'admin';
    created_at: string;
  };
}
