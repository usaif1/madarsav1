// src/modules/duas/hooks/useDuas.ts
import { useQuery } from '@tanstack/react-query';
import duaService, { DuaData, TasbihData } from '../services/duaService';

/**
 * Hook to fetch all duas
 * @returns Query result with duas data
 */
export const useAllDuas = () => {
  return useQuery({
    queryKey: ['duas'],
    queryFn: () => duaService.fetchAllDuas(),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch a specific dua by ID
 * @param id The ID of the dua to fetch
 * @returns Query result with the specific dua data
 */
export const useDuaById = (id: number) => {
  return useQuery({
    queryKey: ['duas', id],
    queryFn: () => duaService.fetchDuaById(id),
    enabled: !!id, // Only run the query if an ID is provided
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch all tasbihs
 * @returns Query result with tasbihs data
 */
export const useAllTasbihs = () => {
  return useQuery({
    queryKey: ['tasbihs'],
    queryFn: () => duaService.fetchAllTasbihs(),
    select: (response) => response.data,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

/**
 * Hook to fetch a specific tasbih by ID
 * @param id The ID of the tasbih to fetch
 * @returns Query result with the specific tasbih data
 */
export const useTasbihById = (id: number) => {
  return useQuery({
    queryKey: ['tasbihs', id],
    queryFn: () => duaService.fetchTasbihById(id),
    enabled: !!id, // Only run the query if an ID is provided
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};
