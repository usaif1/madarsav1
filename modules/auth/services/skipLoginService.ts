// modules/auth/services/skipLoginService.ts
import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';
import authService, { SkippedLoginRequest } from './authService';
import { storage } from '../storage/mmkvStorage';
import { useErrorStore } from '@/modules/error/store/errorStore';
import { ErrorType } from '@/api/utils/errorHandling';

// Skip login and register device
export const skipLogin = async (deviceToken: string = ''): Promise<boolean> => {
  try {
    // Set loading state
    useAuthStore.getState().setIsLoading(true);
    
    // Get device ID
    const deviceId = await DeviceInfo.getUniqueId();
    
    // Create skip login request
    const skipLoginData: SkippedLoginRequest = {
      deviceId,
      deviceToken,
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      // Optional location data can be added here
    };
    
    // Send skip login request to backend
    const response = await authService.skipLogin(skipLoginData);
    
    // Store device ID in MMKV storage
    storage.set('device_id', deviceId);
    
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