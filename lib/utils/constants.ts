// Application constants

export const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
} as const;

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 0, // Manual dismiss
} as const;

export const TOKEN_STORAGE_KEY = 'auth_token';
export const USER_STORAGE_KEY = 'auth_user';
export const API_BASE_URL_STORAGE_KEY = 'api_base_url';
