// src/api/clients/madrasaClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { MADRASA_API_URL, HTTP_STATUS } from '../config/madrasaApiConfig';
import tokenService from '@/modules/auth/services/tokenService';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { addCompressionHeaders, prepareDataForCompression } from '../utils/requestOptimizer';
import { generateCacheKey, getFromCache, saveToCache, CacheStrategy, CacheConfig } from '../utils/cacheManager';
import NetInfo from '@react-native-community/netinfo';

// Extended request config with custom properties
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  cache?: CacheConfig;
  cacheKey?: string;
  compress?: boolean;
}

/**
 * Create Madrasa API client with optimized configuration
 * Handles authentication, caching, compression, and error handling
 */
const madrasaClient = axios.create({
  baseURL: MADRASA_API_URL,
  timeout: 30000, // 30 seconds default timeout
  headers: {
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate, br', // Enable compression
    // Don't set any default Content-Type - let it be determined per request
  },
  responseType: 'json',
  // Custom transform request to handle different data types
  transformRequest: [
    // First transformer: Handle FormData specially
    (data, headers) => {
      console.log('🔄 Transform request called:', {
        isFormData: data instanceof FormData,
        dataType: typeof data,
        hasHeaders: !!headers
      });

      // Handle FormData - CRITICAL: Return early to avoid Axios defaults
      if (data instanceof FormData) {
        console.log('📦 Handling FormData in transform request');
        if (headers) {
          console.log('📦 Headers before Content-Type removal:', headers);
          
          // Aggressively remove ALL Content-Type variants
          const keysToDelete = Object.keys(headers).filter(key => 
            key.toLowerCase() === 'content-type'
          );
          keysToDelete.forEach(key => {
            delete headers[key];
          });
          
          // Also try common variations
          delete headers['Content-Type'];
          delete headers['content-type'];
          delete headers['CONTENT-TYPE'];
          
          console.log('🗑️ Removed ALL Content-Type variants for FormData');
          console.log('📦 Headers after Content-Type removal:', headers);
        }
        
        // CRITICAL: Return FormData unchanged - don't let Axios process it further
        console.log('✅ Returning FormData unchanged to preserve boundary');
        return data;
      }

      // Handle JSON data
      if (data && typeof data === 'object' && headers) {
        console.log('📄 Handling JSON data in transform request');
        headers['Content-Type'] = 'application/json';
        try {
          return JSON.stringify(data);
        } catch (error) {
          console.error('❌ Error stringifying request data:', error);
          return data;
        }
      }
      
      console.log('➡️ Passing data through unchanged');
      return data;
    }
  ],
});

/**
 * Request interceptor to add authentication and handle optimizations
 */
madrasaClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    console.log('🔄 === REQUEST INTERCEPTOR START ===');
    console.log('🔄 Request details:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      hasData: !!config.data,
      dataType: config.data ? (config.data instanceof FormData ? 'FormData' : typeof config.data) : 'none',
      headers: config.headers
    });

    const extendedConfig = config as ExtendedAxiosRequestConfig;
    
    try {
      // Check network connectivity before making request
      const netInfo = await NetInfo.fetch();
      const isConnected = netInfo.isConnected && netInfo.isInternetReachable;
      
      // Handle offline mode with caching
      if (!isConnected && extendedConfig.cache) {
        const cacheKey = extendedConfig.cacheKey || generateCacheKey(config);
        const cachedResponse = getFromCache(cacheKey);
        
        if (cachedResponse) {
          console.log('📱 Using cached response for offline request');
          return Promise.resolve({
            ...config,
            adapter: () => Promise.resolve(cachedResponse)
          } as InternalAxiosRequestConfig);
        }
      }
      
      // Add authentication token
      const accessToken = await tokenService.getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
        console.log('🔐 Added Authorization header');
      } else {
        console.log('⚠️ No access token available');
      }
      
      // Handle FormData requests specially
      if (config.data instanceof FormData) {
        console.log('📦 Processing FormData request - removing Content-Type for proper boundary');
        
        // Remove Content-Type to let FormData set it with proper boundary
        if (config.headers) {
          delete (config.headers as any)['Content-Type'];
          delete (config.headers as any)['content-type'];
          console.log('🗑️ Removed Content-Type in interceptor for FormData boundary');
        }
        
        // Skip compression for FormData
        console.log('⏭️ Skipping compression for FormData request');
        
      } else if (
        // Apply compression for non-FormData requests ONLY
        ['post', 'put', 'patch'].includes(config.method?.toLowerCase() || '') &&
        config.data &&
        !(config.data instanceof FormData) && // Explicitly exclude FormData
        extendedConfig.compress !== false
      ) {
        console.log('🗜️ Applying compression for non-FormData request');
        
        // Add compression headers
        const compressedConfig = addCompressionHeaders(config);
        
        // Optimize request data if it's large enough (>1KB)
        try {
          const dataSize = JSON.stringify(config.data).length;
          if (dataSize > 1024) {
            config.data = prepareDataForCompression(config.data);
          }
        } catch (error) {
          console.warn('⚠️ Could not calculate data size for compression:', error);
        }
        
        return compressedConfig as InternalAxiosRequestConfig;
      }
      
      // Final check for FormData requests to ensure no Content-Type interference
      if (config.data instanceof FormData) {
        console.log('🔍 FINAL FORMDATA CHECK - ensuring no Content-Type interference');
        if (config.headers) {
          // Aggressively remove any Content-Type that might have been added
          delete (config.headers as any)['Content-Type'];
          delete (config.headers as any)['content-type'];
          console.log('🗑️ FINAL: Removed any Content-Type for FormData boundary');
        }
      }
      
      console.log('✅ REQUEST INTERCEPTOR COMPLETE');
      console.log('🔄 Final config:', {
        method: config.method,
        url: config.url,
        hasAuth: !!config.headers.Authorization,
        isFormData: config.data instanceof FormData,
        headers: config.headers
      });
      
      // Final validation before sending request
      if (config.data instanceof FormData) {
        console.log('🔍 FINAL VALIDATION: FormData request details:');
        console.log('🔍 URL:', `${config.baseURL}${config.url}`);
        console.log('🔍 Method:', config.method);
        console.log('🔍 Headers:', JSON.stringify(config.headers, null, 2));
        console.log('🔍 Data type:', config.data.constructor.name);
        console.log('🔍 Timeout:', config.timeout);
        
        // Check if all required headers are present
        const requiredHeaders = ['Authorization', 'Accept'];
        const missingHeaders = requiredHeaders.filter(header => !config.headers[header]);
        if (missingHeaders.length > 0) {
          console.warn('⚠️ Missing required headers:', missingHeaders);
        }
        
        // Ensure no Content-Type is set
        const hasContentType = Object.keys(config.headers).some(key => 
          key.toLowerCase() === 'content-type'
        );
        if (hasContentType) {
          console.error('❌ CRITICAL: Content-Type still present in headers!');
        } else {
          console.log('✅ GOOD: No Content-Type header found - FormData can set its own');
        }
      }
      
      return config;
      
    } catch (error) {
      console.error('❌ Request interceptor error:', error);
      // Return original config if interceptor fails
      return config;
    }
  },
  (error: AxiosError) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for token refresh, caching, and error handling
 */
madrasaClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const extendedConfig = response.config as ExtendedAxiosRequestConfig;
    
    // Cache successful responses if caching is enabled
    if (extendedConfig.cache && response.status >= 200 && response.status < 300) {
      try {
        const cacheKey = extendedConfig.cacheKey || generateCacheKey(response.config);
        saveToCache(cacheKey, response, extendedConfig.cache.maxAge);
      } catch (error) {
        console.warn('⚠️ Could not cache response:', error);
      }
    }
    
    return response;
  },
  async (error: AxiosError) => {
    if (!error.config) {
      return Promise.reject(error);
    }
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const extendedRequest = originalRequest as ExtendedAxiosRequestConfig;
    
    // Handle network errors with detailed logging
    if (!error.response) {
      console.error('❌ No response received. Full error details:', {
        message: error.message,
        code: error.code,
        stack: error.stack,
        config: {
          method: error.config?.method,
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          headers: error.config?.headers,
          data: error.config?.data instanceof FormData ? 'FormData' : error.config?.data
        }
      });
      
      // Check if it's a file upload request
      if (error.config?.data instanceof FormData) {
        console.error('❌ FormData upload failed - this might be a Content-Type issue');
        return Promise.reject(new Error('File upload failed. The server may not be accepting the request format.'));
      }
      
      if (extendedRequest.cache) {
        try {
          const cacheKey = extendedRequest.cacheKey || generateCacheKey(originalRequest);
          const cachedResponse = getFromCache(cacheKey);
          
          if (cachedResponse) {
            console.log('🔄 Using cached response for network error');
            return Promise.resolve(cachedResponse);
          }
        } catch (cacheError) {
          console.warn('⚠️ Could not retrieve cached response:', cacheError);
        }
      }
      
      console.error('❌ Network error with no cached response available');
      return Promise.reject(new Error('Network connection failed. Please check your internet connection.'));
    }
    
    // Handle token expiration (401 Unauthorized)
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      console.log('🔑 Token expired (401), attempting refresh');
      originalRequest._retry = true;
      
      try {
        // Import authService to avoid circular dependencies
        const authService = require('@/modules/auth/services/authService').default;
        
        console.log('🔄 Attempting token refresh...');
        const tokens = await authService.refreshToken();
        
        if (tokens?.accessToken) {
          console.log('✅ Token refresh successful, retrying original request');
          
          // Update Authorization header with new token
          if (originalRequest.headers) {
            originalRequest.headers.set('Authorization', `Bearer ${tokens.accessToken}`);
          } else {
            originalRequest.headers = new axios.AxiosHeaders({
              'Authorization': `Bearer ${tokens.accessToken}`
            });
          }
          
          // Retry the original request with new token
          return madrasaClient(originalRequest);
        } else {
          throw new Error('Token refresh returned invalid tokens');
        }
        
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        
        // Log out user if token refresh fails
        try {
          console.log('🚪 Logging out user due to authentication failure');
          await useAuthStore.getState().logout();
        } catch (logoutError) {
          console.error('❌ Logout failed:', logoutError);
        }
        
        return Promise.reject(new Error('Authentication failed. Please log in again.'));
      }
    }
    
    // Handle other HTTP errors
    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ HTTP Error ${status}:`, data);
      
      // Create user-friendly error messages
      let errorMessage = (data as any)?.message || error.message || 'An error occurred';
      
      switch (status) {
        case 400:
          errorMessage = 'Invalid request. Please check your input and try again.';
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found. Please check the URL and try again.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please wait a moment before trying again.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service unavailable. Please try again later.';
          break;
      }
      
      const enhancedError = new Error(errorMessage) as AxiosError;
      enhancedError.response = error.response;
      enhancedError.config = error.config;
      
      return Promise.reject(enhancedError);
    }
    
    // For other errors, return original error
    return Promise.reject(error);
  }
);

// Type definitions for the extended client
interface MadrasaClient {
  get<T = any>(
    url: string, 
    config?: AxiosRequestConfig & { 
      cache?: CacheConfig; 
      cacheKey?: string; 
    }
  ): Promise<AxiosResponse<T>>;
  
  delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig & { 
      cache?: CacheConfig; 
      cacheKey?: string; 
    }
  ): Promise<AxiosResponse<T>>;
  
  post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { 
      cache?: CacheConfig; 
      cacheKey?: string; 
      compress?: boolean; 
    }
  ): Promise<AxiosResponse<T>>;
  
  put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { 
      cache?: CacheConfig; 
      cacheKey?: string; 
      compress?: boolean; 
    }
  ): Promise<AxiosResponse<T>>;
  
  patch<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { 
      cache?: CacheConfig; 
      cacheKey?: string; 
      compress?: boolean; 
    }
  ): Promise<AxiosResponse<T>>;
}

// Export the typed client
export default madrasaClient as MadrasaClient;