// modules/auth/services/skipLoginService.ts
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';
import authService, { SkippedLoginRequest, SkippedLoginResponse } from './authService';
import { storage } from '../storage/mmkvStorage';
import { useErrorStore } from '@/modules/error/store/errorStore';
import { ErrorType } from '@/api/utils/errorHandling';
import tokenService from './tokenService';
import { useLocationStore } from '@/modules/location/store/locationStore';

// Skip login and register device
export const skipLogin = async (): Promise<boolean> => {
  try {
    // Set loading state
    useAuthStore.getState().setIsLoading(true);
    
    // Get device ID
    const deviceId = await DeviceInfo.getUniqueId();
    const deviceToken = await DeviceInfo.getInstanceId() || deviceId;
    
    // Get location data from location store
    const locationData = useLocationStore.getState();
    console.log('🌍 Using location data for skip login:', {
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      city: locationData.city,
      country: locationData.country,
    });
    
    // Create skip login request
    const skipLoginData: SkippedLoginRequest = {
      deviceId,
      deviceToken,
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      // Include location data if available
      city: locationData.city || undefined,
      country: locationData.country || undefined,
    };
    
    // Send skip login request to backend
    console.log('Sending skip login request:', JSON.stringify(skipLoginData));
    const response = await authService.skipLogin(skipLoginData);
    console.log('Skip login response:', JSON.stringify(response));
    
    // Store access token if available
    if (response && response.accessToken) {
      await tokenService.storeTokens({
        accessToken: response.accessToken,
        refreshToken: response.accessToken, // Using access token as refresh token
      });
    }
    
    // Store device ID in MMKV storage
    storage.set('device_id', deviceId);
    storage.set('login_method', 'skipped');
    
    // Update auth state
    useAuthStore.getState().setIsSkippedLogin(true);
    useAuthStore.getState().setIsAuthenticated(false);
    useAuthStore.getState().setUser(null);
    useAuthStore.getState().setError(null);
    
    return true;
  } catch (error: any) {
    // Update error state
    const errorMessage = error.message || 'Skip login failed';
    useAuthStore.getState().setError(errorMessage);
    useErrorStore.getState().addError({
      type: ErrorType.AUTH,
      message: errorMessage,
      details: error,
    });
    
    return false;
  } finally {
    // Reset loading state
    useAuthStore.getState().setIsLoading(false);
  }
};

// Check if device is registered as skipped login
export const isSkippedLoginDevice = (): boolean => {
  const deviceId = storage.getString('device_id');
  return !!deviceId;
};

// Clear skipped login state
export const clearSkippedLogin = (): void => {
  storage.delete('device_id');
};

export default {
  skipLogin,
  isSkippedLoginDevice,
  clearSkippedLogin,
};