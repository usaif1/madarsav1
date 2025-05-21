import { useQuery } from '@tanstack/react-query';
import { fetchAllNames, fetchNameByNumber, NamesResponse, NameData } from '../services/namesService';

// Hook to fetch all names
export const useAllNames = () => {
  return useQuery<NamesResponse, Error>({
    queryKey: ['names'],
    queryFn: fetchAllNames,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours - names don't change
  });
};

// Hook to fetch a specific name by number
export const useNameByNumber = (number: number) => {
  return useQuery<NameData, Error>({
    queryKey: ['name', number],
    queryFn: () => fetchNameByNumber(number),
    enabled: !!number, // Only run if number is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Utility function to transform the API response into a format similar to the current namesData
export interface TransformedName {
  id: string;
  name: string;
  native: string;
  meaning: string;
}

export const transformNamesData = (data: NamesResponse): TransformedName[] => {
  return Object.entries(data).map(([id, nameData]) => ({
    id,
    name: nameData.latin,
    native: nameData.native,
    // Note: API doesn't provide meanings, so we'll need to handle this differently
    // For now, we'll leave it empty or you can merge with a local dataset of meanings
    meaning: '',
  }));
};
