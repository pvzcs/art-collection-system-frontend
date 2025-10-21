import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Base Axios client instance for all API requests
 * Configured with interceptors for authentication and error handling
 */
const apiClient = axios.create({
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor: Add auth token and base URL to all requests
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get auth token from localStorage
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.token) {
          config.headers.Authorization = `Bearer ${state.token}`;
        }
      } catch (error) {
        console.error('Failed to parse auth data:', error);
      }
    }

    // Get API base URL from localStorage
    const settingsData = localStorage.getItem('settings-storage');
    if (settingsData) {
      try {
        const { state } = JSON.parse(settingsData);
        if (state?.apiBaseUrl) {
          config.baseURL = state.apiBaseUrl;
        }
      } catch (error) {
        console.error('Failed to parse settings data:', error);
      }
    }

    // Use default base URL if not configured
    if (!config.baseURL) {
      config.baseURL = process.env.NEXT_PUBLIC_DEFAULT_API_URL || 'http://localhost:8080/api/v1';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor: Handle errors and authentication
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // Clear auth data from localStorage
      localStorage.removeItem('auth-storage');
      
      // Redirect to login page if not already there
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden errors
    if (error.response?.status === 403) {
      // Error message will be handled by the component using handleApiError
      console.warn('Access denied:', error.response?.data);
    }

    // Handle 404 Not Found errors
    if (error.response?.status === 404) {
      console.warn('Resource not found:', error.config?.url);
    }

    // Handle 429 Rate Limit errors
    if (error.response?.status === 429) {
      console.warn('Rate limit exceeded');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
