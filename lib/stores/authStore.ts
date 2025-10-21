import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/lib/types/models';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  
  // Actions
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      
      setAuth: (token: string, user: User) => {
        set({
          token,
          user,
          isAuthenticated: true,
          isAdmin: user.role === 'admin',
        });
      },
      
      clearAuth: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
          isAdmin: false,
        });
      },
      
      updateUser: (updatedUser: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          const newUser = { ...currentUser, ...updatedUser };
          set({
            user: newUser,
            isAdmin: newUser.role === 'admin',
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Recompute derived state after rehydration
          state.isAuthenticated = !!state.token && !!state.user;
          state.isAdmin = state.user?.role === 'admin';
        }
      },
    }
  )
);
