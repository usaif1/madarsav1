// modules/auth/services/authService.ts
import { madrasaClient } from '@/api';
import { MADRASA_API_ENDPOINTS } from '@/api/config/madrasaApiConfig';
import { User } from '../store/authStore';
import tokenService, { Tokens } from './tokenService';
import { useAuthStore } from '../store/authStore';
import { mmkvStorage, storage } from '../storage/mmkvStorage';
import { Platform } from 'react-native';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Constants for token expiry
const ACCESS_TOKEN_EXPIRY_MINUTES = 15; // 15 minutes
const REFRESH_TOKEN_EXPIRY_DAYS = 45; // 45 days

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
  refreshToken?: string; // New field for refresh token
  deviceToken?: string;
  deviceType?: string;
  latitude?: number;
  longitude?: number;
  userRoles?: string;
  voipToken?: string;
}

// Token error interface
interface TokenError extends Error {
  isTokenError: boolean;
}

// Create a token error
const createTokenError = (message: string): TokenError => {
  const error = new Error(message) as TokenError;
  error.isTokenError = true;
  return error;
};

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
        
        // Store tokens
        if (response.data.accessToken) {
          const refreshToken = response.data.refreshToken || response.data.accessToken;
          await tokenService.storeTokens({
            accessToken: response.data.accessToken,
            refreshToken: refreshToken,
          });
          console.log('✅ Tokens stored successfully');
        } else {
          console.error('❌ No access token in response');
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
      console.log('🔑 Login attempt for:', credentials.email);
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.LOGIN, credentials);
      
      // Store tokens from login response
      if (response.data.accessToken) {
        const refreshToken = response.data.refreshToken || response.data.accessToken;
        await tokenService.storeTokens({
          accessToken: response.data.accessToken,
          refreshToken: refreshToken,
        });
        console.log('✅ Login successful, tokens stored');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  },
  
  // Google OAuth login
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    try {
      console.log('🔑 Google login attempt');
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.GOOGLE_AUTH, { idToken });
      
      // Store tokens from Google login response
      if (response.data.accessToken) {
        const refreshToken = response.data.refreshToken || response.data.accessToken;
        await tokenService.storeTokens({
          accessToken: response.data.accessToken,
          refreshToken: refreshToken,
        });
        console.log('✅ Google login successful, tokens stored');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Google login failed:', error);
      throw error;
    }
  },
  
  // Facebook OAuth login
  loginWithFacebook: async (accessToken: string): Promise<AuthResponse> => {
    try {
      console.log('🔑 Facebook login attempt');
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.FACEBOOK_AUTH, { accessToken });
      
      // Store tokens from Facebook login response
      if (response.data.accessToken) {
        const refreshToken = response.data.refreshToken || response.data.accessToken;
        await tokenService.storeTokens({
          accessToken: response.data.accessToken,
          refreshToken: refreshToken,
        });
        console.log('✅ Facebook login successful, tokens stored');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Facebook login failed:', error);
      throw error;
    }
  },
  
  // Skip login (anonymous user)
  skipLogin: async (data: SkippedLoginRequest): Promise<SkippedLoginResponse> => {
    try {
      console.log('🔑 Skip login attempt');
      const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.SKIPPED_LOGIN, data);
      
      // Store access token for skipped login
      if (response.data.accessToken) {
        await tokenService.storeTokens({
          accessToken: response.data.accessToken,
          refreshToken: response.data.accessToken, // Use access token as refresh token for skipped login
        });
        console.log('✅ Skip login successful, token stored');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Skip login failed:', error);
      throw error;
    }
  },
  
  // Refresh token using the dedicated refresh token API
  refreshToken: async (): Promise<Tokens> => {
    try {
      console.log('🔄 Attempting to refresh token');
      const refreshToken = await tokenService.getRefreshToken();
      
      if (!refreshToken) {
        console.error('❌ No refresh token available');
        throw createTokenError('No refresh token available');
      }

      console.log('🔄 Calling refresh token API');
      try {
        // Try the new refresh token API first
        const response = await madrasaClient.post(MADRASA_API_ENDPOINTS.REFRESH_TOKEN, { refreshToken });
        
        if (response.data.accessToken) {
          const newRefreshToken = response.data.refreshToken || refreshToken;
          
          console.log('✅ Token refresh successful via refresh API');
          await tokenService.storeTokens({
            accessToken: response.data.accessToken,
            refreshToken: newRefreshToken,
          });
          
          return {
            accessToken: response.data.accessToken,
            refreshToken: newRefreshToken,
          };
        } else {
          console.error('❌ Refresh token response missing access token');
          throw createTokenError('Refresh token response missing access token');
        }
      } catch (refreshError: any) {
        // If refresh token API fails, fall back to re-authentication
        console.log('⚠️ Refresh token API failed, falling back to re-authentication');
        
        // Get stored user info from auth store
        const user = useAuthStore.getState().user;
        const loginMethod = storage.getString('login_method');
        
        if (!user || !loginMethod) {
          console.error('❌ User info or login method not available for re-authentication');
          throw createTokenError('User info or login method not available');
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
          password: '', // Empty for social logins
        };
        
        console.log('🔄 Re-authenticating with stored user info');
        const authResponse = await authService.authenticate(authRequest);
        
        if (!authResponse.accessToken) {
          console.error('❌ Re-authentication response missing access token');
          throw createTokenError('Re-authentication response missing access token');
        }
        
        const newRefreshToken = authResponse.refreshToken || authResponse.accessToken;
        
        // Store the new tokens
        await tokenService.storeTokens({
          accessToken: authResponse.accessToken,
          refreshToken: newRefreshToken,
        });
        
        console.log('✅ Token refresh successful via re-authentication');
        return {
          accessToken: authResponse.accessToken,
          refreshToken: newRefreshToken,
        };
      }
    } catch (error: any) {
      console.error('❌ Token refresh failed:', error);
      
      // If it's a 401 or 403 error, clear tokens as they're likely invalid
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 401 || axiosError.response?.status === 403) {
          console.log('🚫 Invalid token detected, clearing tokens');
          await tokenService.clearTokens();
        }
      }
      
      throw error;
    }
  },
  
  // Execute request with token refresh capability
  executeWithTokenRefresh: async <T>(request: () => Promise<T>): Promise<T> => {
    try {
      // First attempt with current token
      return await request();
    } catch (error) {
      // Check if it's an authentication error (401)
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        try {
          console.log('🔄 Request failed with 401, attempting token refresh');
          // Try to refresh the token
          await authService.refreshToken();
          
          // Retry the request with new token
          console.log('🔄 Retrying request with new token');
          return await request();
        } catch (refreshError) {
          console.error('❌ Token refresh failed during request retry:', refreshError);
          throw refreshError;
        }
      }
      
      // If it's not a 401 error or token refresh failed, rethrow the original error
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async (): Promise<User> => {
    try {
      console.log('👤 Fetching user profile');
      const response = await authService.executeWithTokenRefresh(
        () => madrasaClient.get(MADRASA_API_ENDPOINTS.USER_PROFILE)
      );
      console.log('✅ User profile fetched successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get user profile:', error);
      throw error;
    }
  },
  
  // Logout
  logout: async (): Promise<void> => {
    try {
      console.log('🚪 Logging out user');
      // Try to call logout API
      try {
        await madrasaClient.post(MADRASA_API_ENDPOINTS.LOGOUT);
        console.log('✅ Logout API call successful');
      } catch (apiError) {
        console.warn('⚠️ Logout API call failed, proceeding with local logout', apiError);
      }
      
      // Clear tokens regardless of API response
      await tokenService.clearTokens();
      console.log('✅ Tokens cleared successfully');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Still clear tokens even if API call fails
      await tokenService.clearTokens();
      throw error;
    }
  },

  // Complete logout by clearing all storage
  logOutByDeletingTokens: async (): Promise<void> => {
    try {
      // Always clear tokens regardless of auth method
      console.log('🔑 Clearing tokens...');
      await tokenService.clearTokens();
      
      // Clear MMKV storage
      console.log('🧹 Clearing storage...');
      try {
        mmkvStorage.removeItem('auth-storage');
        mmkvStorage.removeItem('device_id');
        mmkvStorage.removeItem('onboarded');
        mmkvStorage.removeItem('login_method');
        // Add any other known keys here
      } catch (e) {
        console.warn('⚠️ Error clearing MMKV storage:', e);
      }
      
      // Reset auth state
      console.log('🔄 Resetting auth state...');
      useAuthStore.getState().resetAuthStore();
      useAuthStore.getState().setUser(null);
      useAuthStore.getState().setIsAuthenticated(false);
      useAuthStore.getState().setIsSkippedLogin(false);
      
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Still clear tokens even if API call fails
      await tokenService.clearTokens();
      throw error;
    }
  },
  
  // Get token expiry information
  getTokenExpiryInfo: () => {
    return {
      accessTokenExpiryMinutes: ACCESS_TOKEN_EXPIRY_MINUTES,
      refreshTokenExpiryDays: REFRESH_TOKEN_EXPIRY_DAYS
    };
  }
};

export default authService;