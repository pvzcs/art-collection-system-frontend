// Authentication hook placeholder
// Will be implemented as needed

'use client';

import { useAuthStore } from '@/lib/stores/authStore';

export function useAuth() {
  const { token, user } = useAuthStore();
  
  return {
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    user,
    token,
  };
}
