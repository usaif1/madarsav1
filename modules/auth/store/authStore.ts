// modules/auth/store/authStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../storage/mmkvStorage';
import tokenService from '../services/tokenService';
import authService, { SkippedLoginRequest } from '../services/authService';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { storage } from '../storage/mmkvStorage';

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
      
      // Google login
// Update the loginWithGoogle method in authStore.ts

loginWithGoogle: async () => {
    try {
      set({ isLoading: true, error: null });
      console.log('loginWithGoogle');
      // Check if Google Play Services are available
      const hasPlayServices = await GoogleSignin.hasPlayServices();
      console.log('hasPlayServices', hasPlayServices);
      
      // Perform Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      // Check if we got an ID token
      if (!userInfo.data?.idToken) {
        throw new Error('No ID token received from Google');
      }
      
      // Send ID token to backend
      // const authResponse = await authService.loginWithGoogle(userInfo.idToken);
      // console.log('authResponse', authResponse);
      // // Store tokens securely
      // await tokenService.storeTokens({
      //   accessToken: authResponse.accessToken,
      //   refreshToken: authResponse.refreshToken,
      // });
      
      // Update auth state
      set({
        // user: authResponse.user,
        user: userInfo.data?.user,
        isAuthenticated: true,
        isSkippedLogin: false,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error: any) {
      // Handle specific Google Sign-In errors
      let errorMessage = 'Google sign-in failed';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign in is already in progress';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services are not available';
      } else {
        errorMessage = error.message || 'Google sign-in failed';
      }
      
      set({ isLoading: false, error: errorMessage });
      return false;
    }
  },
  
  // Facebook login
  loginWithFacebook: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Perform Facebook Login
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      console.log("We using auth store too")
      if (result.isCancelled) {
        throw new Error('Login cancelled by user');
      }
      
      // Get access token
      const data = await AccessToken.getCurrentAccessToken();
      console.log("We using auth store too 2")
      if (!data) {
        throw new Error('Failed to get access token from Facebook');
      }
      
      // Send access token to backend
      // const authResponse = await authService.loginWithFacebook(data.accessToken);
      // console.log("We using auth store too 3",authResponse)
      
      // // Store tokens securely
      // await tokenService.storeTokens({
      //   accessToken: authResponse.accessToken,
      //   refreshToken: authResponse.refreshToken,
      // });
      
      // Update auth state
      set({
        // user: authResponse.user,
        isAuthenticated: true,
        isSkippedLogin: false,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Facebook login failed',
      });
      return false;
    }
  },
  
  // Skip login
  skipLogin: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // Get device ID
      const deviceId = await DeviceInfo.getUniqueId();
      
      // Create skip login request
      const skipLoginData: SkippedLoginRequest = {
        deviceId,
        deviceToken: '', // Add device token for push notifications if available
        deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      };
      
      // Send skip login request to backend
      await authService.skipLogin(skipLoginData);
      
      // Store device ID in MMKV storage
      storage.set('device_id', deviceId);
      
      // Update auth state
      set({
        isSkippedLogin: true,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
      });
      
      return true;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Skip login failed',
      });
      return false;
    }
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