// src/modules/dua/hooks/useDuas.ts
import { useQuery } from '@tanstack/react-query';
import { 
  fetchAllDuas, 
  fetchDuaById, 
  fetchDuasByCategory,
  fetchAllTasbihs,
  fetchTasbihById,
  DuasResponse, 
  DuaData,
  TasbihResponse,
  TasbihData
} from '../services/duaService';

/**
 * Hook to fetch all duas
 * @returns Query result with all duas data
 */
export const useAllDuas = () => {
  return useQuery<DuasResponse, Error>({
    queryKey: ['duas'],
    queryFn: fetchAllDuas,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - duas don't change frequently
  });
};

/**
 * Hook to fetch a specific dua by ID
 * @param id The ID of the dua to fetch
 * @returns Query result with the specific dua data
 */
export const useDuaById = (id: number) => {
  return useQuery<DuaData, Error>({
    queryKey: ['dua', id],
    queryFn: () => fetchDuaById(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to fetch duas by category
 * @param category The category to filter duas by
 * @returns Query result with the filtered duas data
 */
export const useDuasByCategory = (category: string) => {
  return useQuery<DuasResponse, Error>({
    queryKey: ['duas', 'category', category],
    queryFn: () => fetchDuasByCategory(category),
    enabled: !!category, // Only run if category is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to fetch all tasbih duas
 * @returns Query result with all tasbih data
 */
export const useAllTasbihs = () => {
  return useQuery<TasbihResponse, Error>({
    queryKey: ['tasbihs'],
    queryFn: fetchAllTasbihs,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - tasbihs don't change
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
    queryFn: () => fetchTasbihById(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
