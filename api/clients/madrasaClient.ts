// src/api/clients/madrasaClient.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { MADRASA_API_URL, HTTP_STATUS } from '../config/madrasaApiConfig';
import tokenService from '@/modules/auth/services/tokenService';
import { useAuthStore } from '@/modules/auth/store/authStore';

// Create Madrasa API client
const madrasaClient = axios.create({
  baseURL: MADRASA_API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate', // Enable compression
  },
});

// Request interceptor to add auth token
madrasaClient.interceptors.request.use(
  async (config) => {
    // Get access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
madrasaClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
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

export default madrasaClient;