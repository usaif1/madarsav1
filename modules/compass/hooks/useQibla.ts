import { useQuery } from '@tanstack/react-query';
import { fetchQiblaDirection, QiblaResponse } from '../services/qiblaService';

export const useQiblaDirection = (latitude?: number, longitude?: number) => {
  return useQuery<QiblaResponse, Error>({
    queryKey: ['qibla', latitude, longitude],
    queryFn: () => fetchQiblaDirection(latitude!, longitude!),
    enabled: !!latitude && !!longitude, // Only run if coordinates are provided
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    retry: 3,
  });
};
