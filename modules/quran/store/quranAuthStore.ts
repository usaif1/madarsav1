import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkvStorage } from '@/modules/auth/storage/mmkvStorage';
import axios from 'axios';

// Define the environment-specific configuration
const AUTH_CONFIG = {
  PRE_PRODUCTION: {
    clientId: 'b876018d-438d-4ba9-bff1-e832300622ad',
    clientSecret: 'eYgetdho~4m81bd2nu7vEBRJ9Y',
    tokenUrl: 'https://prelive-oauth2.quran.foundation/oauth2/token',
    apiBaseUrl: 'https://apis-prelive.quran.foundation/content/api/v4'
  },
  PRODUCTION: {
    clientId: 'e13619a8-9cf8-47f0-8ba1-3b68117e0fad',
    clientSecret: 'DqY.zCCq7kb~-XtjdjOO-ANZLE',
    tokenUrl: 'https://oauth2.quran.foundation/oauth2/token',
    apiBaseUrl: 'https://apis.quran.foundation/content/api/v4'
  }
};

// Get the appropriate config based on environment
const getConfig = () => {
  return __DEV__ ? AUTH_CONFIG.PRE_PRODUCTION : AUTH_CONFIG.PRODUCTION;
};

// Token response type
interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

// Auth store state interface
interface QuranAuthState {
  accessToken: string | null;
  expiresAt: number | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getAccessToken: () => Promise<string | null>;
  refreshToken: () => Promise<string | null>;
  clearTokens: () => void;
  isTokenExpired: () => boolean;
}

export const useQuranAuthStore = create<QuranAuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      expiresAt: null,
      isLoading: false,
      error: null,
      
      // Check if token is expired or about to expire (within 5 minutes)
      isTokenExpired: () => {
        const { expiresAt } = get();
        if (!expiresAt) return true;
        
        // Consider token expired if less than 5 minutes remaining
        const expirationBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
        return Date.now() + expirationBuffer > expiresAt;
      },
      
      // Get a valid access token (refresh if needed)
      getAccessToken: async () => {
        const { accessToken, isTokenExpired, refreshToken } = get();
        
        // If we have a token and it's not expired, return it
        if (accessToken && !isTokenExpired()) {
          return accessToken;
        }
        
        // Otherwise, refresh the token
        return await refreshToken();
      },
      
      // Refresh the access token
      refreshToken: async () => {
        const config = getConfig();
        
        console.log('🔄 Starting Quran.Foundation token refresh');
        set({ isLoading: true, error: null });
        
        try {
          // Create form data for token request
          const formData = new URLSearchParams();
          formData.append('grant_type', 'client_credentials');
          formData.append('scope', 'content');
          
          console.log('🔍 Token request URL:', config.tokenUrl);
          console.log('🔍 Token request params:', formData.toString());
          console.log('🔍 Using client ID:', config.clientId);
          
          // Make the token request
          const response = await axios.post<TokenResponse>(
            config.tokenUrl,
            formData.toString(),
            {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              auth: {
                username: config.clientId,
                password: config.clientSecret,
              },
            }
          );
          
          console.log('✅ Token response status:', response.status);
          console.log('📦 Token response data:', JSON.stringify(response.data, null, 2));
          
          const { access_token, expires_in, token_type, scope } = response.data;
          
          // Calculate expiration time
          const expiresAt = Date.now() + expires_in * 1000;
          const expirationDate = new Date(expiresAt).toISOString();
          
          console.log(`📅 Token expires in ${expires_in} seconds (at ${expirationDate})`);
          console.log(`🔑 Token type: ${token_type}, scope: ${scope}`);
          
          // Update store with new token
          set({
            accessToken: access_token,
            expiresAt,
            isLoading: false,
          });
          
          console.log('✅ Quran.Foundation token refreshed successfully');
          return access_token;
        } catch (error) {
          console.error('❌ Failed to refresh Quran.Foundation token:', error);
          
          if (axios.isAxiosError(error)) {
            console.error('❌ Axios error details:');
            console.error('  Status:', error.response?.status);
            console.error('  Status text:', error.response?.statusText);
            console.error('  Data:', JSON.stringify(error.response?.data, null, 2));
            console.error('  Headers:', JSON.stringify(error.response?.headers, null, 2));
            console.error('  Config:', JSON.stringify({
              url: error.config?.url,
              method: error.config?.method,
              headers: error.config?.headers,
              data: error.config?.data
            }, null, 2));
          }
          
          // Clear tokens on error
          set({
            accessToken: null,
            expiresAt: null,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          
          console.log('❌ Token refresh failed, cleared token state');
          return null;
        }
      },
      
      // Clear all token data
      clearTokens: () => {
        set({
          accessToken: null,
          expiresAt: null,
          error: null,
        });
      },
    }),
    {
      name: 'quran-auth-storage',
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);