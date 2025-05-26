// src/modules/tasbih/hooks/useTasbihs.ts
import { useQuery } from '@tanstack/react-query';
import tasbihService, { TasbihData, TasbihResponse } from '../services/tasbihService';

/**
 * Hook to fetch all tasbihs and transform them to UI format
 * @returns Query result with all tasbihs data formatted for UI
 */
export const useAllTasbihsForUI = () => {
  return useQuery({
    queryKey: ['tasbihs', 'ui'],
    queryFn: async () => {
      const response = await tasbihService.fetchAllTasbihs();
      return tasbihService.transformTasbihsForUI(response.data);
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - tasbihs don't change frequently
  });
};

/**
 * Hook to fetch all tasbihs in raw API format
 * @returns Query result with all tasbihs data
 */
export const useAllTasbihs = () => {
  return useQuery<TasbihResponse, Error>({
    queryKey: ['tasbihs', 'raw'],
    queryFn: tasbihService.fetchAllTasbihs,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to fetch a specific tasbih by ID
 * @param id The ID of the tasbih to fetch
 * @returns Query result with the specific tasbih data
 */
export const useTasbihById = (id: number) => {
  return useQuery<TasbihData, Error>({
    queryKey: ['tasbih', id],
    queryFn: () => tasbihService.fetchTasbihById(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to fetch a specific tasbih by ID and transform it to UI format
 * @param id The ID of the tasbih to fetch
 * @returns Query result with the specific tasbih data formatted for UI
 */
export const useTasbihByIdForUI = (id: number) => {
  return useQuery({
    queryKey: ['tasbih', id, 'ui'],
    queryFn: async () => {
      const tasbih = await tasbihService.fetchTasbihById(id);
      return tasbihService.transformTasbihsForUI([tasbih])[0];
    },
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
