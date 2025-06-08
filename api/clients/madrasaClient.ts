// src/api/clients/madrasaClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MADRASA_API_URL, HTTP_STATUS } from '../config/madrasaApiConfig';
import tokenService from '@/modules/auth/services/tokenService';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { addCompressionHeaders, prepareDataForCompression } from '../utils/requestOptimizer';
import { generateCacheKey, getFromCache, saveToCache, CacheStrategy, CacheConfig } from '../utils/cacheManager';
import NetInfo from '@react-native-community/netinfo';

// Extended request config with our custom properties
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  cache?: CacheConfig;
  cacheKey?: string;
  compress?: boolean;
}

// Create Madrasa API client
const madrasaClient = axios.create({
  baseURL: MADRASA_API_URL,
  timeout: 30000, // Increased timeout for file uploads
  headers: {
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate', // Enable compression
  },
  responseType: 'json',
  // Don't transform data by default
  transformRequest: [(data, headers) => {
    if (data instanceof FormData) {
      // If data is FormData, simply return it. Axios should handle setting the
      // 'Content-Type' to 'multipart/form-data' with the correct boundary, primarily guided
      // by the 'Content-Type': undefined setting in the specific request config (e.g., in userService).
      if (process.env.NODE_ENV === 'development') {
        console.log('📦 FormData in transformRequest (passing through). Current headers[Content-Type]:', headers ? headers['Content-Type'] : 'headers undefined');
      }
      return data;
    }

    // For other data types (e.g., plain objects for JSON payloads)
    if (headers && data && typeof data === 'object') {
      // Ensure Content-Type is not set if data is null or undefined, even if headers object exists
      if (data === null || data === undefined) {
        if (headers['Content-Type']) delete headers['Content-Type'];
      } else {
        headers['Content-Type'] = 'application/json';
        try {
          return JSON.stringify(data);
        } catch (e) {
          console.error('Error stringifying request data:', e);
          return data; 
        }
      }
    }
    return data;
  }],
});

// Request interceptor to add auth token and handle optimizations
madrasaClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const extendedConfig = config as ExtendedAxiosRequestConfig;
    
    // Check network connectivity before making request
    const netInfo = await NetInfo.fetch();
    const isConnected = netInfo.isConnected && netInfo.isInternetReachable;
    
    // If offline and cache is enabled, try to use cached response
    if (!isConnected && extendedConfig.cache) {
      const cacheKey = extendedConfig.cacheKey || generateCacheKey(config);
      const cachedResponse = getFromCache(cacheKey);
      
      if (cachedResponse) {
        // Return a promise that resolves with the cached response
        // We need to cast this to InternalAxiosRequestConfig to satisfy TypeScript
        return Promise.resolve({
          ...config,
          adapter: () => Promise.resolve(cachedResponse)
        } as InternalAxiosRequestConfig);
      }
    }
    
    // Get access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Apply compression for POST, PUT, PATCH requests with data, BUT NOT FOR FormData
    if (
      ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '') &&
      config.data &&
      !(config.data instanceof FormData) && // Explicitly exclude FormData
      extendedConfig.compress !== false
    ) {
      // The outer condition already ensures extendedConfig.compress is not explicitly false,
      // and that data is not FormData. So, we can proceed with compression logic.
      // Add compression headers
      const compressedConfig = addCompressionHeaders(config);
      
      // Optimize request data if it's large enough (>1KB)
      // Note: JSON.stringify might not be ideal for all data types if prepareDataForCompression handles them differently.
      const dataSize = JSON.stringify(config.data).length;
      if (dataSize > 1024) {
        config.data = prepareDataForCompression(config.data);
      }
      return compressedConfig as InternalAxiosRequestConfig;
    } // End of compression logic block

    
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for token refresh and caching
madrasaClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const extendedConfig = response.config as ExtendedAxiosRequestConfig;
    
    // If caching is enabled for this request, save the response
    if (extendedConfig.cache) {
      const cacheKey = extendedConfig.cacheKey || generateCacheKey(response.config);
      saveToCache(cacheKey, response, extendedConfig.cache.maxAge);
    }
    
    return response;
  },
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const extendedRequest = originalRequest as ExtendedAxiosRequestConfig;
    
    // Check if error is due to network connectivity
    if (!error.response && error.message && error.message.includes('Network Error')) {
      // If offline and cache is enabled, try to use cached response
      if (extendedRequest.cache) {
        const cacheKey = extendedRequest.cacheKey || generateCacheKey(originalRequest);
        const cachedResponse = getFromCache(cacheKey);
        
        if (cachedResponse) {
          console.log('🔄 Using cached response for offline request');
          return Promise.resolve(cachedResponse);
        }
      }
      
      console.error('❌ Network error and no cached response available');
    }
    
    // Check if error is due to expired token (401) and not already retrying
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      console.log('🔑 Token expired (401), attempting refresh');
      originalRequest._retry = true;
      
      try {
        // Import authService directly to avoid circular dependencies
        const authService = require('@/modules/auth/services/authService').default;
        
        // Attempt to refresh token using the new authService method
        console.log('🔄 Calling authService.refreshToken()');
        const tokens = await authService.refreshToken();
        
        if (tokens && tokens.accessToken) {
          console.log('✅ Token refresh successful, retrying original request');
          
          // Update Authorization header with new token
          if (originalRequest.headers) {
            // Use proper Axios headers methods
            originalRequest.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
          } else {
            // Create a new AxiosHeaders instance
            const headers = new axios.AxiosHeaders();
            headers.set('Authorization', `Bearer ${tokens.accessToken}`);
            originalRequest.headers = headers;
          }
          
          // Retry the original request
          return madrasaClient(originalRequest);
        } else {
          console.error('❌ Token refresh returned no tokens');
          throw new Error('Token refresh failed');
        }
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // If refresh fails, log out the user
        try {
          console.log('🚪 Logging out user due to token refresh failure');
          await useAuthStore.getState().logout();
        } catch (logoutError) {
          console.error('❌ Logout failed after token refresh error:', logoutError);
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // For other error statuses, just reject with the original error
    return Promise.reject(error);
  }
);

// Add type definitions for the extended client
interface MadrasaClient {
  get<T = any>(url: string, config?: AxiosRequestConfig & { cache?: CacheConfig, cacheKey?: string }): Promise<AxiosResponse<T>>;
  delete<T = any>(url: string, config?: AxiosRequestConfig & { cache?: CacheConfig, cacheKey?: string }): Promise<AxiosResponse<T>>;
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig & { cache?: CacheConfig, cacheKey?: string, compress?: boolean }): Promise<AxiosResponse<T>>;
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig & { cache?: CacheConfig, cacheKey?: string, compress?: boolean }): Promise<AxiosResponse<T>>;
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig & { cache?: CacheConfig, cacheKey?: string, compress?: boolean }): Promise<AxiosResponse<T>>;
}

// Cast the client to our extended interface
const typedMadrasaClient = madrasaClient as MadrasaClient;

// Export the typed client
export default typedMadrasaClient;