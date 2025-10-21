// Authentication store placeholder
// Will be implemented in task 3.1

import { create } from 'zustand';

interface AuthState {
  token: string | null;
  user: any | null;
}

export const useAuthStore = create<AuthState>(() => ({
  token: null,
  user: null,
}));
