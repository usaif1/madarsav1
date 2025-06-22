// modules/error/hooks/useErrorHandler.ts
import { useCallback } from 'react';
import { AxiosError } from 'axios';
import { useErrorStore } from '../store/errorStore';
import { AppError, mapAxiosError, ErrorType } from '@/api/utils/errorHandling';
import NetInfo from '@react-native-community/netinfo';

export const useErrorHandler = () => {
  const { addError, setOffline } = useErrorStore();
  
  // Handle Axios errors
  const handleAxiosError = useCallback((error: AxiosError) => {
    const appError = mapAxiosError(error);
    addError(appError);
    return appError;
  }, [addError]);
  
  // Handle generic errors
  const handleError = useCallback((error: any, message?: string) => {
    const appError: AppError = {
      type: ErrorType.UNKNOWN,
      message: message || error.message || 'An unexpected error occurred',
      details: error,
    };
    
    addError(appError);
    return appError;
  }, [addError]);
  
  // Setup network monitoring
  const setupNetworkMonitoring = useCallback(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setOffline(!state.isConnected);
      
      // If we're back online after being offline, add a notification
      if (state.isConnected && useErrorStore.getState().isOffline) {
        addError({
          type: ErrorType.NETWORK,
          message: 'Back online',
          status: 200,
        });
      }
    });
    
    return unsubscribe;
  }, [setOffline, addError]);
  
  return {
    handleAxiosError,
    handleError,
    setupNetworkMonitoring,
  };
};