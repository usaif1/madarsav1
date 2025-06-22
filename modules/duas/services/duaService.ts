// src/modules/duas/services/duaService.ts
import madrasaClient from '../../../api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '../../../api/config/madrasaApiConfig';
import tokenService from '@/modules/auth/services/tokenService';

// Define interfaces for the duas data
export interface DuaData {
  id: number;
  title: string;
  arabic: string;
  translation: string;
  transliteration: string;
  reference: string;
  category: string;
  audioUrl?: string;
  imageUrl?: string;
}

export interface DuasResponse {
  data: DuaData[];
  message: string;
  status: number;
}

// Define interfaces for the tasbih data
export interface TasbihData {
  id: number;
  title: string;
  arabic: string;
  translation: string;
  transliteration: string;
  count: number;
  category: string;
  audioUrl?: string;
}

export interface TasbihResponse {
  data: TasbihData[];
  message: string;
  status: number;
}

/**
 * Fetches all duas from the API
 * @returns Promise with the duas data
 */
export const fetchAllDuas = async (): Promise<DuasResponse> => {
  try {
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log('📝 Fetching all duas');
    console.log('📝 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS, { headers });
    
    console.log('📝 Successfully fetched duas');
    console.log('📝 Response status:', response.status);
    console.log('📝 Response data preview:', JSON.stringify(response.data));
    
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
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log(`📝 Fetching dua #${id}`);
    console.log('📝 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.DUAS}/${id}`, { headers });
    
    console.log(`📝 Successfully fetched dua #${id}`);
    console.log('📝 Response status:', response.status);
    console.log('📝 Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching dua #${id}:`, error);
    throw error;
  }
};

/**
 * Fetches all tasbihs from the API
 * @returns Promise with the tasbih data
 */
export const fetchAllTasbihs = async (): Promise<TasbihResponse> => {
  try {
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log('📝 Fetching all tasbihs');
    console.log('📝 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS_TASBIH, { headers });
    
    console.log('📝 Successfully fetched tasbihs');
    console.log('📝 Response status:', response.status);
    console.log('📝 Response data preview:', JSON.stringify(response.data));
    
    return response.data;
  } catch (error) {
    console.error('Error fetching tasbihs:', error);
    throw error;
  }
};

/**
 * Fetches a specific tasbih by ID
 * @param id The ID of the tasbih to fetch
 * @returns Promise with the specific tasbih data
 */
export const fetchTasbihById = async (id: number): Promise<TasbihData> => {
  try {
    // Get the access token from secure storage
    const accessToken = await tokenService.getAccessToken();
    
    // Prepare headers with authorization if token exists
    const headers = accessToken ? {
      Authorization: `Bearer ${accessToken}`
    } : undefined;
    
    console.log(`📝 Fetching tasbih #${id}`);
    console.log('📝 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.DUAS_TASBIH}/${id}`, { headers });
    
    console.log(`📝 Successfully fetched tasbih #${id}`);
    console.log('📝 Response status:', response.status);
    console.log('📝 Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasbih #${id}:`, error);
    throw error;
  }
};

// Export all functions
const duaService = {
  fetchAllDuas,
  fetchDuaById,
  fetchAllTasbihs,
  fetchTasbihById,
};

export default duaService;
