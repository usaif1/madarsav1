// modules/auth/services/authService.ts
import axios from 'axios';
import { User } from '../store/authStore';
import tokenService, { Tokens } from './tokenService';

// Create a dedicated client for auth endpoints
const authClient = axios.create({
  baseURL: 'https://api.madrasaapp.com/madrasaapp',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// Auth service methods
const authService = {
  // Regular login with email/password
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await authClient.post('/api/v1/users/login', credentials);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  // Google OAuth login
  loginWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    try {
      const response = await authClient.post('/api/v1/users/oauth/google', { idToken });
      return response.data;
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  },
  
  // Facebook OAuth login
  loginWithFacebook: async (accessToken: string): Promise<AuthResponse> => {
    try {
      const response = await authClient.post('/api/v1/users/oauth/facebook', { accessToken });
      return response.data;
    } catch (error) {
      console.error('Facebook login failed:', error);
      throw error;
    }
  },
  
  // Skip login (anonymous user)
  skipLogin: async (data: SkippedLoginRequest): Promise<SkippedLoginRequest> => {
    try {
      const response = await authClient.post('/api/v1/skipped-login', data);
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
      
      const response = await authClient.post('/api/v1/users/refresh-token', { refreshToken });
      
      // Store new tokens
      await tokenService.storeTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      
      return {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async (): Promise<User> => {
    try {
      const accessToken = await tokenService.getAccessToken();
      
      const response = await authClient.get('/api/v1/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Failed to get user profile:', error);
      throw error;
    }
  },
  
  // Logout
  logout: async (): Promise<void> => {
    try {
      const accessToken = await tokenService.getAccessToken();
      
      if (accessToken) {
        await authClient.post('/api/v1/users/logout', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
      
      // Clear tokens regardless of API response
      await tokenService.clearTokens();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear tokens even if API call fails
      await tokenService.clearTokens();
      throw error;
    }
  },
};

export default authService;