// src/modules/tasbih/services/tasbihService.ts
import madrasaClient from '../../../api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '../../../api/config/madrasaApiConfig';
import tokenService from '@/modules/auth/services/tokenService';

// Define interfaces for the tasbih data
export interface TasbihVerse {
  arabic: string;
  transliteration: string;
  translation: string;
}

export interface TasbihData {
  id: number;
  title: string;
  verses: TasbihVerse[];
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
    
    console.log('📿 Fetching all tasbihs');
    console.log('📿 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(MADRASA_API_ENDPOINTS.DUAS_TASBIH, { headers });
    
    console.log('📿 Successfully fetched tasbihs');
    console.log('📿 Response status:', response.status);
    console.log('📿 Response data preview:', JSON.stringify(response.data).substring(0, 200) + '...');
    
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
    
    console.log(`📿 Fetching tasbih #${id}`);
    console.log('📿 Request headers:', headers ? 'Bearer token included' : 'No token available');
    
    const response = await madrasaClient.get(`${MADRASA_API_ENDPOINTS.DUAS_TASBIH}/${id}`, { headers });
    
    console.log(`📿 Successfully fetched tasbih #${id}`);
    console.log('📿 Response status:', response.status);
    console.log('📿 Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasbih #${id}:`, error);
    throw error;
  }
};

/**
 * Transforms API tasbih data to match the UI format
 * @param apiTasbihs The tasbih data from the API
 * @returns Tasbih data in the format expected by the UI
 */
export const transformTasbihsForUI = (apiTasbihs: TasbihData[]): any[] => {
  return apiTasbihs.map(tasbih => ({
    id: tasbih.id.toString(),
    verses: tasbih.verses || [
      {
        arabic: tasbih.title || '',
        transliteration: '',
        translation: ''
      }
    ]
  }));
};

// Export all functions
const tasbihService = {
  fetchAllTasbihs,
  fetchTasbihById,
  transformTasbihsForUI
};

export default tasbihService;
