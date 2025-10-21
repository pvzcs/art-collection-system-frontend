import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const DEFAULT_API_BASE_URL = 'http://localhost:8080/api/v1';

interface SettingsState {
  apiBaseUrl: string;
  
  // Actions
  setApiBaseUrl: (url: string) => void;
  resetApiBaseUrl: () => void;
}

/**
 * Validates if a string is a valid URL format
 */
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      apiBaseUrl: DEFAULT_API_BASE_URL,
      
      setApiBaseUrl: (url: string) => {
        // Validate URL format before setting
        if (!isValidUrl(url)) {
          throw new Error('Invalid URL format. URL must start with http:// or https://');
        }
        
        // Remove trailing slash if present
        const normalizedUrl = url.endsWith('/') ? url.slice(0, -1) : url;
        
        set({ apiBaseUrl: normalizedUrl });
      },
      
      resetApiBaseUrl: () => {
        set({ apiBaseUrl: DEFAULT_API_BASE_URL });
      },
    }),
    {
      name: 'settings-storage',
    }
  )
);
