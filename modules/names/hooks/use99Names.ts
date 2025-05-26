// src/modules/names/hooks/use99Names.ts
import { useQuery } from '@tanstack/react-query';
import { fetchAll99Names, fetch99NameById, Names99Response, Name99Data } from '../services/names99Service';

/**
 * Hook to fetch all 99 names of Allah
 * @returns Query result with all 99 names data
 */
export const useAll99Names = () => {
  return useQuery<Names99Response, Error, Name99Data[]>({
    queryKey: ['names99'],
    queryFn: async () => {
      console.log('🔍 Fetching 99 names from API...');
      try {
        const response = await fetchAll99Names();
        console.log('🔍 API Response structure:', JSON.stringify(Object.keys(response), null, 2));
        console.log('🔍 Names array exists:', !!response.names);
        console.log('🔍 Names array length:', response.names?.length || 0);
        if (response.names && response.names.length > 0) {
          console.log('🔍 First name sample:', JSON.stringify(response.names[0], null, 2));
        }
        return response;
      } catch (error) {
        console.error('❌ Error fetching 99 names:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24,
    select: (data) => {
      console.log('🔍 Select function called with data:', !!data);
      const names = data.names || [];
      console.log('🔍 Names array after select:', names.length);
      return names;
    },
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
  imageUrl?: string;
  audioUrl?: string;
}

/**
 * Utility function to transform the API response into a simplified format
 * @param data The raw API response
 * @returns Transformed array of 99 names
 */
export const transform99NamesData = (data: Name99Data[]): Transformed99Name[] => {
  console.log('🔍 transform99NamesData called with data length:', data?.length || 0);
  if (!data || !Array.isArray(data)) {
    console.error('❌ transform99NamesData received invalid data:', data);
    return [];
  }
  
  try {
    const transformed = data.map((name) => {
      if (!name) {
        console.warn('⚠️ Null or undefined name object in data array');
        return null;
      }
      
      console.log('🔍 Processing name:', name.id, name.transliteration);
      return {
        id: name.id,
        name: name.transliteration,
        arabic: name.name,
        meaning: name.translation,
        benefits: name.benefits,
        imageUrl: name.imageUrl,
        audioUrl: name.audioUrl,
      };
    }).filter(Boolean) as Transformed99Name[];
    
    console.log('🔍 Transformed data length:', transformed.length);
    if (transformed.length > 0) {
      console.log('🔍 First transformed name sample:', JSON.stringify(transformed[0], null, 2));
    }
    
    return transformed;
  } catch (error) {
    console.error('❌ Error in transform99NamesData:', error);
    return [];
  }
};
