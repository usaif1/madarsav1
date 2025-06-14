import { useQuery } from '@tanstack/react-query';
import { fetchQiblaDirection, QiblaResponse } from '../services/qiblaService';
import { useLocationData } from '@/modules/location/hooks/useLocationData';

/**
 * Hook to get Qibla direction based on user's location
 * Uses fallback mechanisms when location is not available
 */
export const useQiblaDirection = () => {
  // Use the enhanced location hook that provides fallback locations
  const { 
    latitude, 
    longitude, 
    loading: locationLoading, 
    error: locationError,
    usingFallback,
    fallbackSource 
  } = useLocationData();

  const { 
    data, 
    isLoading: qiblaLoading, 
    error: qiblaError,
    refetch 
  } = useQuery<QiblaResponse, Error>({
    queryKey: ['qibla', latitude, longitude],
    queryFn: async () => {
      if (!latitude || !longitude) {
        throw new Error('Location data is required to calculate Qibla direction');
      }
      
      console.log('useQiblaDirection: Fetching Qibla with params:', {
        latitude,
        longitude,
        usingFallback: usingFallback ? 'yes' : 'no',
        fallbackSource
      });
      
      try {
        const response = await fetchQiblaDirection(latitude, longitude);
        console.log('useQiblaDirection: API response received');
        return response;
      } catch (error: any) {
        console.error('useQiblaDirection: Error fetching Qibla direction:', error);
        
        // Provide more user-friendly error message
        if (error.message.includes('timeout') || error.message.includes('network')) {
          throw new Error('Network timeout. Please check your internet connection.');
        } else if (error.response && error.response.status === 400) {
          throw new Error('Invalid parameters for Qibla calculation.');
        } else {
          throw error;
        }
      }
    },
    enabled: !!latitude && !!longitude, // Only run if coordinates are provided
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });

  return {
    data,
    isLoading: locationLoading || qiblaLoading,
    error: locationError || qiblaError,
    refetch,
    usingFallback,
    fallbackSource
  };
};

/**
 * Legacy hook for backward compatibility
 * @deprecated Use useQiblaDirection() without parameters instead
 */
export const useQiblaDirectionWithCoords = (latitude?: number, longitude?: number) => {
  return useQuery<QiblaResponse, Error>({
    queryKey: ['qibla-direct', latitude, longitude],
    queryFn: () => fetchQiblaDirection(latitude!, longitude!),
    enabled: !!latitude && !!longitude, // Only run if coordinates are provided
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 3,
  });
};
