// src/modules/names/hooks/use99Names.ts
import { useQuery } from '@tanstack/react-query';
import { fetchAll99Names, fetch99NameById, Names99Response } from '../services/names99Service';

/**
 * Updated Name99Data interface to match the new API response format
 */
export interface Name99Data {
  id: number;
  number: number;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  description: string;
  imageLink: string;
  imageExtension: string;
  audioLink: string;
  audioExtension: string;
}

/**
 * Hook to fetch all 99 names of Allah
 * @returns Query result with all 99 names data
 */
export const useAll99Names = () => {
  return useQuery<any, Error, Name99Data[]>({
    queryKey: ['names99'],
    queryFn: async () => {
      console.log('🔍 Fetching 99 names from API...');
      try {
        const response = await fetchAll99Names();
        console.log('🔍 API Response structure:', JSON.stringify(Object.keys(response), null, 2));
        
        // Check if response is an array or has a names property
        const isArray = Array.isArray(response);
        const hasNamesProperty = response && typeof response === 'object' && 'names' in response;
        
        console.log('🔍 Response is array:', isArray);
        console.log('🔍 Response has names property:', hasNamesProperty);
        
        // Handle both formats for backward compatibility
        if (isArray) {
          console.log('🔍 Names array length (direct):', response.length);
          if (response.length > 0) {
            console.log('🔍 First name sample (direct):', JSON.stringify(response[0], null, 2));
          }
        } else if (hasNamesProperty && Array.isArray(response.names)) {
          console.log('🔍 Names array length (from property):', response.names.length);
          if (response.names.length > 0) {
            console.log('🔍 First name sample (from property):', JSON.stringify(response.names[0], null, 2));
          }
        }
        
        return response;
      } catch (error) {
        console.error('❌ Error fetching 99 names:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    select: (data) => {
      console.log('🔍 Select function called with data:', !!data);
      
      // Handle different response formats
      let namesArray: Name99Data[] = [];
      
      if (Array.isArray(data)) {
        // Direct array response
        namesArray = data;
        console.log('🔍 Using direct array data with length:', namesArray.length);
      } else if (data && typeof data === 'object') {
        if ('names' in data && Array.isArray(data.names)) {
          // Object with names property
          namesArray = data.names;
          console.log('🔍 Using data.names with length:', namesArray.length);
        } else {
          // Object with numeric keys (API response format)
          const keys = Object.keys(data).filter(key => !isNaN(Number(key)));
          if (keys.length > 0) {
            namesArray = keys.map(key => data[key]);
            console.log('🔍 Extracted array from object keys with length:', namesArray.length);
          }
        }
      }
      
      console.log('🔍 Final names array length:', namesArray.length);
      if (namesArray.length > 0) {
        console.log('🔍 First name in final array:', JSON.stringify(namesArray[0], null, 2));
      }
      
      // Make a deep copy to prevent any reference issues
      return JSON.parse(JSON.stringify(namesArray));
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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
    queryFn: async () => {
      const response = await fetch99NameById(id);
      // Cast the response to our updated interface
      return response as unknown as Name99Data;
    },
    enabled: !!id, // Only run if id is provided
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to use for audio playback with the new API format
 * @param nameId The ID of the name to play audio for
 * @returns The audio URL for the specified name
 */
export const useNameAudioUrl = (nameId: number | null) => {
  const { data: name } = use99NameById(nameId || 0);
  return nameId && name ? name.audioLink : null;
};

/**
 * Simplified interface for transformed 99 names data
 */
export interface Transformed99Name {
  id: number;
  number: number;
  arabicName: string;
  englishName: string;
  englishTranslation: string;
  description: string;
  imageLink: string;
  audioLink: string;
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
      
      console.log('🔍 Processing name:', name.id, name.englishName);
      return {
        id: name.id,
        number: name.number,
        arabicName: name.arabicName,
        englishName: name.englishName,
        englishTranslation: name.englishTranslation,
        description: name.description,
        imageLink: name.imageLink,
        audioLink: name.audioLink
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
