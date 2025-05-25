// src/modules/dua/services/duaService.ts
import madrasaClient from '../../../api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '../../../api/config/madrasaApiConfig';

// Define interfaces for the duas data
export interface DuaData {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  category: string;
}

export interface DuasResponse {
  duas: DuaData[];
}

export interface TasbihData {
  id: number;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  count: number;
  benefits: string;
}

export interface TasbihResponse {
  tasbihs: TasbihData[];
}

/**
 * Fetches all duas from the API
 * @returns Promise with the duas data
 */
export const fetchAllDuas = async (): Promise<DuasResponse> => {
  try {
    console.log('🤲 Fetching all duas');
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS, {
      cache: {
        strategy: 'cache-first',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });
    console.log('🤲 Successfully fetched all duas');
    return response.data;
  } catch (error) {
    console.error('Error fetching duas:', error);
    throw error;
  }
};

/**
 * Fetches a specific dua by ID
 * @param id The ID of the dua to fetch
 * @returns Promise with the specific dua data
 */
export const fetchDuaById = async (id: number): Promise<DuaData> => {
  try {
    console.log(`🤲 Fetching dua #${id}`);
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.DUAS}/${id}`, {
      cache: {
        strategy: 'cache-first',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });
    console.log(`🤲 Successfully fetched dua #${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching dua #${id}:`, error);
    throw error;
  }
};

/**
 * Fetches duas by category
 * @param category The category to filter duas by
 * @returns Promise with the filtered duas data
 */
export const fetchDuasByCategory = async (category: string): Promise<DuasResponse> => {
  try {
    console.log(`🤲 Fetching duas for category: ${category}`);
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS, {
      params: { category },
      cache: {
        strategy: 'cache-first',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });
    console.log(`🤲 Successfully fetched duas for category: ${category}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching duas for category ${category}:`, error);
    throw error;
  }
};

/**
 * Fetches all tasbih duas from the API
 * @returns Promise with the tasbih data
 */
export const fetchAllTasbihs = async (): Promise<TasbihResponse> => {
  try {
    console.log('📿 Fetching all tasbih duas');
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS_TASBIH, {
      cache: {
        strategy: 'cache-first',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });
    console.log('📿 Successfully fetched all tasbih duas');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasbih duas:', error);
    throw error;
  }
};

/**
 * Fetches a specific tasbih dua by ID
 * @param id The ID of the tasbih to fetch
 * @returns Promise with the specific tasbih data
 */
export const fetchTasbihById = async (id: number): Promise<TasbihData> => {
  try {
    console.log(`📿 Fetching tasbih #${id}`);
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.DUAS_TASBIH}/${id}`, {
      cache: {
        strategy: 'cache-first',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });
    console.log(`📿 Successfully fetched tasbih #${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasbih #${id}:`, error);
    throw error;
  }
};
