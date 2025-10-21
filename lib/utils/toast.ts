import { toast } from 'sonner';
import { AxiosError } from 'axios';

/**
 * Display a success toast notification
 * Auto-dismisses after 3 seconds
 */
export function showSuccess(message: string) {
  toast.success(message, {
    duration: 3000,
  });
}

/**
 * Display an error toast notification
 * Stays visible until manually dismissed
 */
export function showError(message: string) {
  toast.error(message, {
    duration: Infinity,
  });
}

/**
 * Display an info toast notification
 */
export function showInfo(message: string) {
  toast.info(message, {
    duration: 4000,
  });
}

/**
 * Display a warning toast notification
 */
export function showWarning(message: string) {
  toast.warning(message, {
    duration: 4000,
  });
}

/**
 * Display a loading toast notification
 * Returns a function to dismiss the toast
 */
export function showLoading(message: string = 'Loading...') {
  const id = toast.loading(message);
  return () => toast.dismiss(id);
}

/**
 * Extract error message from API error response
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Handle specific status codes
    if (error.response?.status === 403) {
      return error.response?.data?.message || 'Access denied. You do not have permission to perform this action.';
    }
    
    if (error.response?.status === 404) {
      return error.response?.data?.message || 'The requested resource was not found.';
    }
    
    if (error.response?.status === 429) {
      return 'Too many requests. Please wait a moment before trying again.';
    }
    
    // Extract message from API response
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    // Network error
    if (error.message === 'Network Error') {
      return 'Network error. Please check your connection and try again.';
    }
    
    // Timeout error
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }
  }
  
  // Generic error
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Handle API error and display appropriate toast
 */
export function handleApiError(error: unknown) {
  const message = getErrorMessage(error);
  showError(message);
}
