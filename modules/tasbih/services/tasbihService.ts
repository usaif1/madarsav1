// src/modules/tasbih/services/tasbihService.ts
import madrasaClient from '../../../api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '../../../api/config/madrasaApiConfig';
import tokenService from '@/modules/auth/services/tokenService';

// Define interfaces for the tasbih data from API
export interface TasbihItem {
  duaArabic: string;
  duaCategory: string;
  duaEnglish: string;
  duaIconLink: string;
  duaName: string;
  duaSubCategory: string;
  duaSubCategoryDesc: string;
  englishTranslation: string;
  fileExtension: string;
  id: number;
  reference: string;
  referenceVerse: string;
}

// Define the response format from the API
export interface TasbihApiResponse {
  [key: string]: TasbihItem[];
}

// Define the transformed format for UI consumption
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
  reference?: string;
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
    console.log('📿 Response data preview:', JSON.stringify(response.data));
    
    // Transform the API response to the expected format
    const transformedData = transformApiResponseToTasbihData(response.data);
    console.log("Transformed data", transformedData)
    return {
      data: transformedData,
      message: 'Success',
      status: response.status
    };
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
    
    // Transform the API response to the expected format
    // If the response is a single item, wrap it in an array for the transformer
    const tasbihItem = response.data;
    const transformedData = transformApiResponseToTasbihData({ tasbih: [tasbihItem] })[0];
    
    return transformedData;
  } catch (error) {
    console.error(`Error fetching tasbih #${id}:`, error);
    throw error;
  }
};

/**
 * Transforms API response to the TasbihData format used by the UI
 * @param apiResponse The raw API response
 * @returns Array of TasbihData objects
 */
export const transformApiResponseToTasbihData = (apiResponse: TasbihApiResponse): TasbihData[] => {
  const result: TasbihData[] = [];
  
  // Iterate through each category in the response
  Object.keys(apiResponse).forEach(category => {
    const tasbihs = apiResponse[category];
    
    // Transform each tasbih item in this category
    tasbihs.forEach(item => {
      const tasbihData: TasbihData = {
        id: item.id,
        title: item.duaName,
        category: item.duaCategory,
        count: 33, // Default count, can be customized by user
        reference: item.reference,
        // Create a single verse from the dua
        verses: [
          {
            arabic: item.duaArabic,
            transliteration: item.duaEnglish, // Using duaEnglish as transliteration
            translation: item.englishTranslation
          }
        ]
      };
      
      // Add audio URL if available
      if (item.fileExtension && item.fileExtension.toLowerCase() === 'mp3') {
        tasbihData.audioUrl = item.duaIconLink; // Assuming the audio URL is in the icon link for mp3 files
      }
      
      result.push(tasbihData);
    });
  });
  
  console.log(`📿 Transformed ${result.length} total tasbihs from ${Object.keys(apiResponse).length} categories`);
  
  return result;
};

/**
 * Transforms API tasbih data to match the UI format expected by the DuaCard
 * @param apiTasbihs The tasbih data from the API
 * @returns Tasbih data in the format expected by the UI
 */
export const transformTasbihsForUI = (apiTasbihs: TasbihData[]): any[] => {
  return apiTasbihs.map(tasbih => ({
    id: tasbih.id.toString(),
    title: tasbih.title,
    verses: tasbih.verses || [
      {
        arabic: tasbih.title || '',
        transliteration: '',
        translation: ''
      }
    ],
    reference: tasbih.reference
  }));
};

// Export all functions
const tasbihService = {
  fetchAllTasbihs,
  fetchTasbihById,
  transformApiResponseToTasbihData,
  transformTasbihsForUI
};

export default tasbihService;
