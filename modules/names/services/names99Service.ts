// src/modules/names/services/names99Service.ts
import madrasaClient from '../../../api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '../../../api/config/madrasaApiConfig';

// Define interfaces for the 99 names data
export interface Name99Data {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  meaning: string;
  benefits: string;
}

export interface Names99Response {
  names: Name99Data[];
}

/**
 * Fetches all 99 names of Allah from the API
 * @returns Promise with the 99 names data
 */
export const fetchAll99Names = async (): Promise<Names99Response> => {
  try {
    console.log('📝 Fetching all 99 names of Allah');
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.NAMES_99, {
      cache: {
        strategy: 'cache-first',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });
    console.log('📝 Successfully fetched 99 names of Allah');
    return response.data;
  } catch (error) {
    console.error('Error fetching 99 names of Allah:', error);
    throw error;
  }
};

/**
 * Fetches a specific name from the 99 names of Allah by ID
 * @param id The ID of the name to fetch
 * @returns Promise with the specific name data
 */
export const fetch99NameById = async (id: number): Promise<Name99Data> => {
  try {
    console.log(`📝 Fetching name #${id} from 99 names of Allah`);
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.NAMES_99}/${id}`, {
      cache: {
        strategy: 'cache-first',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    });
    console.log(`📝 Successfully fetched name #${id} from 99 names of Allah`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching name #${id} from 99 names of Allah:`, error);
    throw error;
  }
};
