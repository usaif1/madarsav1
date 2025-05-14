// modules/error/hooks/useRetry.ts
import { useState, useCallback } from 'react';
import { useErrorHandler } from './useErrorHandler';

interface RetryOptions {
  maxRetries?: number;
  retryDelay?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onRetry?: (attempt: number) => void;
}

export const useRetry = <T>(
  asyncFn: () => Promise<T>,
  options: RetryOptions = {}
) => {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    onSuccess,
    onError,
    onRetry,
  } = options;
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  
  const { handleError } = useErrorHandler();
  
  const execute = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await asyncFn();
      setData(result);
      setRetryCount(0);
      onSuccess?.(result);
      return result;
    } catch (err) {
      setError(err);
      
      // If we haven't reached max retries, retry after delay
      if (retryCount < maxRetries) {
        const nextRetryCount = retryCount + 1;
        setRetryCount(nextRetryCount);
        onRetry?.(nextRetryCount);
        
        setTimeout(() => {
          execute();
        }, retryDelay * nextRetryCount); // Exponential backoff
      } else {
        // Max retries reached, handle the error
        handleError(err);
        onError?.(err);
      }
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [asyncFn, retryCount, maxRetries, retryDelay, handleError, onSuccess, onError, onRetry]);
  
  return {
    execute,
    isLoading,
    error,
    data,
    retryCount,
    reset: () => {
      setRetryCount(0);
      setError(null);
      setData(null);
    },
  };
};