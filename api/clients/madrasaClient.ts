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
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate', // Enable compression
  },
  // Default to JSON, but allow overrides
  responseType: 'json',
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
        return Promise.resolve({
          ...config,
          adapter: () => Promise.resolve(cachedResponse)
        });
      }
    }
    
    // Get access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Apply compression for POST, PUT, PATCH requests with data
    if (['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '') && config.data) {
      if (extendedConfig.compress !== false) {
        // Add compression headers
        const compressedConfig = addCompressionHeaders(config);
        
        // Optimize request data if it's large enough (>1KB)
        const dataSize = JSON.stringify(config.data).length;
        if (dataSize > 1024) {
          config.data = prepareDataForCompression(config.data);
        }
        
        return compressedConfig;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
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
          return Promise.resolve(cachedResponse);
        }
      }
    }
    
    // Check if error is due to expired token (401) and not already retrying
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get auth store actions
        const refreshTokens = useAuthStore.getState().refreshTokens;
        
        // Attempt to refresh token
        const refreshed = await refreshTokens();
        
        if (refreshed && originalRequest) {
          // Get new access token
          const newToken = await tokenService.getAccessToken();
          
          // Update Authorization header with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
          } else {
            originalRequest.headers = { Authorization: `Bearer ${newToken}` };
          }
          
          // Retry the original request
          return madrasaClient(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, log out the user
        const logout = useAuthStore.getState().logout;
        await logout();
        
        return Promise.reject(refreshError);
      }
    }
    
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