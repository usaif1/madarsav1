// src/modules/names/hooks/use99Names.ts
import { useQuery } from '@tanstack/react-query';
import { fetchAll99Names, fetch99NameById, Names99Response, Name99Data } from '../services/names99Service';

/**
 * Hook to fetch all 99 names of Allah
 * @returns Query result with all 99 names data
 */
export const useAll99Names = () => {
  return useQuery<Names99Response, Error>({
    queryKey: ['names99'],
    queryFn: fetchAll99Names,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - names don't change
  });
};

/**
 * Hook to fetch a specific name from the 99 names by ID
 * @param id The ID of the name to fetch
 * @returns Query result with the specific name data
 */
export const use99NameById = (id: number) => {
  return useQuery<Name99Data, Error>({
    queryKey: ['name99', id],
    queryFn: () => fetch99NameById(id),
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Simplified interface for transformed 99 names data
 */
export interface Transformed99Name {
  id: number;
  name: string;
  arabic: string;
  meaning: string;
  benefits: string;
}

/**
 * Utility function to transform the API response into a simplified format
 * @param data The raw API response
 * @returns Transformed array of 99 names
 */
export const transform99NamesData = (data: Names99Response): Transformed99Name[] => {
  return data.names.map((name) => ({
    id: name.id,
    name: name.transliteration,
    arabic: name.name,
    meaning: name.translation,
    benefits: name.benefits,
  }));
};
