// modules/auth/store/authStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../storage/mmkvStorage';
import tokenService from '../services/tokenService';
import authService from '../services/authService';

// User type
export interface User {
  id: string;
  name?: string;
  email?: string;
  photoUrl?: string;
  // Add other user properties as needed
}

// Auth state
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isSkippedLogin: boolean;
  isLoading: boolean;
  error: string | null;
}

// Auth actions
interface AuthActions {
  setUser: (user: User | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setIsSkippedLogin: (value: boolean) => void;
  setIsLoading: (value: boolean) => void;
  setError: (error: string | null) => void;
  
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  loginWithFacebook: () => Promise<boolean>;
  skipLogin: () => Promise<boolean>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<boolean>;
  
  // Reset store
  resetAuthStore: () => void;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isSkippedLogin: false,
  isLoading: true,
  error: null,
};

// Create auth store with persistence
export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // State setters
      setUser: (user) => set({ user }),
      setIsAuthenticated: (value) => set({ isAuthenticated: value }),
      setIsSkippedLogin: (value) => set({ isSkippedLogin: value }),
      setIsLoading: (value) => set({ isLoading: value }),
      setError: (error) => set({ error }),
      
      // Auth methods - implementations will be added when we create the auth service
      login: async (email, password) => {
        // Will implement when we create the auth service
        return false;
      },
      
      loginWithGoogle: async () => {
        // Will implement when we add Google Sign-In
        return false;
      },
      
      loginWithFacebook: async () => {
        // Will implement when we add Facebook Login
        return false;
      },
      
      skipLogin: async () => {
        // Will implement when we create the auth service
        return false;
      },
      
      logout: async () => {
        set({ isLoading: true });
        
        // Clear tokens from secure storage
        await tokenService.clearTokens();
        
        // Reset auth state
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
      
      refreshTokens: async () => {
        try {
          set({ isLoading: true });
          
          // Call the auth service to refresh tokens
          const tokens = await authService.refreshToken();
          
          // If successful, update the authenticated state
          set({ isLoading: false });
          
          return true;
        } catch (error) {
          // If refresh fails, clear auth state
          console.error('Token refresh failed:', error);
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please log in again.',
          });
          
          return false;
        }
      },
      
      // Reset store
      resetAuthStore: () => set(initialState),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist non-sensitive state
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        isSkippedLogin: state.isSkippedLogin,
        user: state.user,
      }),
    }
  )
);

// Export a hook to use the auth store
export const useAuth = () => {
  const {
    user,
    isAuthenticated,
    isSkippedLogin,
    isLoading,
    error,
    setUser,
    setIsAuthenticated,
    setIsSkippedLogin,
    setIsLoading,
    setError,
    login,
    loginWithGoogle,
    loginWithFacebook,
    skipLogin,
    logout,
    refreshTokens,
  } = useAuthStore();
  
  return {
    user,
    isAuthenticated,
    isSkippedLogin,
    isLoading,
    error,
    setUser,
    setIsAuthenticated,
    setIsSkippedLogin,
    setIsLoading,
    setError,
    login,
    loginWithGoogle,
    loginWithFacebook,
    skipLogin,
    logout,
    refreshTokens,
  };
};