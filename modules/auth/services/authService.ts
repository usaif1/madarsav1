// modules/auth/services/authService.ts
import { madrasaClient } from '@/api';
import { MADRASA_API_ENDPOINTS } from '@/api/config/madrasaApiConfig';
import { User } from '../store/authStore';
import tokenService, { Tokens } from './tokenService';
import { useAuthStore } from '../store/authStore';
import { mmkvStorage, storage } from '../storage/mmkvStorage';
import { Platform } from 'react-native';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface SkippedLoginRequest {
  deviceId: string;
  deviceToken: string;
  deviceType: 'ANDROID' | 'IOS';
  city?: string;
  country?: string;
  voipToken?: string;
}

export interface SkippedLoginResponse {
  deviceId: string;
  deviceToken?: string;
  deviceType?: string;
  accessToken: string;
  userId?: string;
}

export interface AuthenticateRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  profileId?: string;
  deviceId?: string;       // Added for device identification
  deviceToken?: string;
  deviceType: 'ANDROID' | 'IOS';
  loginWith: 'GOOGLE' | 'FACEBOOK';
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  voipToken?: string;
  password?: string; // Will be empty for social logins
  userId?: string;   // Used to send the social token
  dob?: string;
  phone?: number;
}

export interface AuthenticateResponse {
  userId: string;
  email?: string;
  accessToken: string;
  deviceToken?: string;
  deviceType?: string;
  latitude?: number;
  longitude?: number;
  userRoles?: string;
  voipToken?: string;
}

// Auth service methods
const authService = {
  // Authenticate with social login data
  authenticate: async (data: AuthenticateRequest): Promise<AuthenticateResponse> => {
    try {
      console.log('🔑 AUTHENTICATE REQUEST:', JSON.stringify(data, null, 2));
      
      // Make sure required fields are present
      if (!data.loginWith) {
        console.error('Missing required field: loginWith');
        throw new Error('Missing required field: loginWith');
      }
      
      if (!data.deviceType) {
        console.error('Missing required field: deviceType');
        throw new Error('Missing required field: deviceType');
      }
      
      // Attempt to make the API call
      try {
        const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.AUTHENTICATE, data);
        console.log('✅ AUTHENTICATION SUCCESS:', JSON.stringify(response.data, null, 2));
        
        // Store access token
        if (response.data.accessToken) {
          await tokenService.storeTokens({
            accessToken: response.data.accessToken,
            refreshToken: response.data.accessToken, // Using access token as refresh token since API doesn't provide one
          });
        }
        
        return response.data;
      } catch (apiError: any) {
        // Log detailed error information
        console.error('❌ AUTHENTICATION API ERROR:');
        console.error('Status:', apiError.response?.status);
        console.error('Status Text:', apiError.response?.statusText);
        console.error('Response Data:', JSON.stringify(apiError.response?.data, null, 2));
        console.error('Request URL:', apiError.config?.url);
        console.error('Request Method:', apiError.config?.method);
        console.error('Request Headers:', JSON.stringify(apiError.config?.headers, null, 2));
        console.error('Request Data:', JSON.stringify(apiError.config?.data, null, 2));
        
        throw apiError;
      }
    } catch (error) {
      console.error('Authentication failed:', error);
      throw error;
    }
  },
  // Regular login with email/password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.LOGIN, credentials);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  // Google OAuth login
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.GOOGLE_AUTH, { idToken });
      return response.data;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  },
  
  // Facebook OAuth login
  loginWithFacebook: async (accessToken: string): Promise<AuthResponse> => {
    try {
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.FACEBOOK_AUTH, { accessToken });
      return response.data;
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    }
  },
  
  // Skip login (anonymous user)
  skipLogin: async (data: SkippedLoginRequest): Promise<SkippedLoginResponse> => {
    try {
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.SKIPPED_LOGIN, data);
      return response.data;
    } catch (error) {
      console.error('Skip login failed:', error);
      throw error;
    }
  },
  
  // Refresh token
  refreshToken: async (): Promise<Tokens> => {
    try {
      const refreshToken = await tokenService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      // Original refresh token logic (commented out as requested)
      /*
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
      
      // Store new tokens
      await tokenService.storeTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
      */
      
      // Get stored user info from auth store
      const user = useAuthStore.getState().user;
      const loginMethod = storage.getString('login_method');
      
      if (!user || !loginMethod) {
        throw new Error('User info or login method not available');
      }
      
      // Create authenticate request based on stored user info
      const authRequest: AuthenticateRequest = {
        email: user.email,
        firstName: user.name?.split(' ')[0],
        lastName: user.name?.split(' ').slice(1).join(' '),
        profileImage: user.photoUrl,
        profileId: user.id,
        deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
        loginWith: loginMethod === 'google' ? 'GOOGLE' : 'FACEBOOK',
        // Add other fields if available
        password: '', // Empty for social logins
      };
      
      // Call authenticate to get a new token
      const authResponse = await authService.authenticate(authRequest);
      
      // Store the new token
      await tokenService.storeTokens({
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.accessToken, // Using access token as refresh token
      });
      
      return {
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.accessToken,
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async (): Promise<User> => {
    try {
      const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.USER_PROFILE);
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  },
  
  // Logout
  logout: async (): Promise<void> => {
    try {
      await madrasaClient.post(MADRASA_API_ENDPOINTS.LOGOUT);
      
      // Clear tokens regardless of API response
      await tokenService.clearTokens();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear tokens even if API call fails
      await tokenService.clearTokens();
      throw error;
    }
  },

  logOutByDeletingTokens: async (): Promise<void> => {
    try {
      // Always clear tokens regardless of auth method
      console.log('Clearing tokens...');
      await tokenService.clearTokens();
      
      // Clear MMKV storage
      console.log('Clearing storage...');
      try {
        mmkvStorage.removeItem('auth-storage');
        mmkvStorage.removeItem('device_id');
        mmkvStorage.removeItem('onboarded');
        // Add any other known keys here
      } catch (e) {
        console.warn('Error clearing MMKV storage:', e);
      }
      
      // Reset auth state
      console.log('Resetting auth state...');
      useAuthStore.getState().resetAuthStore();
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setIsAuthenticated(false);
      useAuthStore.getState().setIsSkippedLogin(false);
      
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear tokens even if API call fails
      await tokenService.clearTokens();
      throw error;
    }
  },
};

export default authService;