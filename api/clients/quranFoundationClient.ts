import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { getQuranFoundationUrl, getQuranFoundationCredentials } from '../config/apiConfig';
import { useQuranAuthStore } from '@/modules/quran/store/quranAuthStore';

// Create a queue to store pending requests during token refresh
let isRefreshing = false;
let requestQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

// Process the request queue with a new token or error
const processQueue = (error: any | null, token: string | null = null) => {
  requestQueue.forEach(promise => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  
  // Reset the queue
  requestQueue = [];
};

// Create the Axios instance
const quranFoundationClient: AxiosInstance = axios.create({
  baseURL: getQuranFoundationUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add auth headers
quranFoundationClient.interceptors.request.use(
  async (config) => {
    try {
      // Get the current client ID
      const credentials = getQuranFoundationCredentials();
      config.headers['x-client-id'] = credentials.CLIENT_ID;
      
      // Get a valid access token
      const accessToken = await useQuranAuthStore.getState().getAccessToken();
      
      if (accessToken) {
        config.headers['x-auth-token'] = accessToken;
      } else {
        throw new Error('Failed to get access token');
      }
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
quranFoundationClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    // If the error is due to an expired token (401 Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If a refresh is already in progress, add this request to the queue
        return new Promise<string>((resolve, reject) => {
          requestQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers = {
              ...originalRequest.headers,
              'x-auth-token': token,
            };
            return axios(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      // Mark that we're refreshing the token
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        // Try to refresh the token
        const newToken = await useQuranAuthStore.getState().refreshToken();
        
        if (newToken) {
          // Process any queued requests with the new token
          processQueue(null, newToken);
          
          // Update the original request with the new token
          originalRequest.headers = {
            ...originalRequest.headers,
            'x-auth-token': newToken,
          };
          
          // Retry the original request
          return axios(originalRequest);
        } else {
          // If refresh failed, process queue with error
          processQueue(new Error('Token refresh failed'));
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If refresh throws an error, process queue with error
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        // Reset refreshing flag
        isRefreshing = false;
      }
    }
    
    // For other errors, just reject the promise
    return Promise.reject(error);
  }
);

// Add detailed logging for debugging
quranFoundationClient.interceptors.request.use(
  (config) => {
    console.log(`🔄 Quran.Foundation API Request: ${config.method?.toUpperCase()} ${config.url}`);
    console.log('🔍 Request Headers:', JSON.stringify(config.headers, null, 2));
    
    if (config.params) {
      console.log('🔍 Request Params:', JSON.stringify(config.params, null, 2));
    }
    
    if (config.data) {
      console.log('🔍 Request Data:', JSON.stringify(config.data, null, 2));
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Quran.Foundation API Request Error:', error);
    return Promise.reject(error);
  }
);

quranFoundationClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Quran.Foundation API Response: ${response.status} ${response.config.url}`);
    console.log('📦 Response Headers:', JSON.stringify(response.headers, null, 2));
    console.log('📦 Response Data:', JSON.stringify(response.data, null, 2));
    return response;
  },
  (error) => {
    console.error(`❌ Quran.Foundation API Response Error: ${error.response?.status || 'Unknown'} ${error.config?.url || 'Unknown URL'}`);
    
    if (error.response) {
      console.error('📦 Error Response Data:', JSON.stringify(error.response.data, null, 2));
      console.error('📦 Error Response Headers:', JSON.stringify(error.response.headers, null, 2));
    }
    
    if (error.request) {
      console.error('📦 Error Request:', error.request);
    }
    
    if (error.config) {
      console.error('📦 Error Config:', JSON.stringify({
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers,
        params: error.config.params,
        data: error.config.data
      }, null, 2));
    }
    
    return Promise.reject(error);
  }
);

export default quranFoundationClient;