// src/modules/names/services/names99Service.ts
import madrasaClient from '../../../api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '../../../api/config/madrasaApiConfig';
import tokenService from '@/modules/auth/services/tokenService';

// Define interfaces for the 99 names data
export interface Name99Data {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  meaning: string;
  benefits: string;
  imageUrl?: string; // URL to the image for this name
  audioUrl?: string; // URL to the audio pronunciation
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
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log('📝 Fetching all 99 names of Allah');
    console.log('📝 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.NAMES_99, { headers });
    
    console.log('🔍 names99Service: API response status:', response.status);
    console.log('🔍 names99Service: Response data type:', typeof response.data);
    console.log('🔍 names99Service: Response data keys:', Object.keys(response.data));
    console.log('🔍 names99Service: Names array exists:', !!response.data);
    
    if (response.data) {
      console.log('🔍 names99Service: Names count:', response.data.length);
      if (response.data.length > 0) {
        console.log('🔍 names99Service: First name sample:', JSON.stringify(response.data[0], null, 2));
      } else {
        console.warn('⚠️ names99Service: Empty names array in API response');
      }
    } else {
      console.error('❌ names99Service: No names array in API response');
      console.log('🔍 names99Service: Full response data:', JSON.stringify(response.data, null, 2));
    }
    
    console.log('📝 Successfully fetched 99 names of Allah');
    console.log('📝 Response status:', response.status);
    console.log('📝 Response data preview:', JSON.stringify(response.data).substring(0, 200) + '...');
    
    return response.data;
  } catch (error) {
    console.error('❌ names99Service: Error fetching 99 names:', error);
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
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log(`📝 Fetching name #${id} from 99 names of Allah`);
    console.log('📝 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.NAMES_99}/${id}`, { headers });
    
    console.log(`📝 Successfully fetched name #${id} from 99 names of Allah`);
    console.log('📝 Response status:', response.status);
    console.log('📝 Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching name #${id} from 99 names of Allah:`, error);
    throw error;
  }
};
