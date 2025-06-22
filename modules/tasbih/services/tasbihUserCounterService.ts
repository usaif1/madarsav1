// src/modules/tasbih/services/tasbihUserCounterService.ts
import madrasaClient from '../../../api/clients/madrasaClient';
import { MADRASA_API_ENDPOINTS } from '../../../api/config/madrasaApiConfig';
import { useAuthStore } from '@/modules/auth/store/authStore';

// Define interfaces for the tasbih user counter data
export interface TasbihUserCounterData {
  beadsCounter: number;
  completedRound: number;
  duaId: number;
  timeInMinutes: number;
  userId: string;
}

export interface TasbihUserCounterResponse {
  beadsCounter: number;
  completedAt: string;
  completedRound: number;
  duaId: number;
  id: number;
  status: string;
  timeInMinutes: number;
  userId: string;
}

/**
 * Saves the user's tasbih counter data to the API
 * @param tasbihData The tasbih counter data to save
 * @returns Promise with the API response
 */
export const saveTasbihUserCounter = async (tasbihData: TasbihUserCounterData): Promise<TasbihUserCounterResponse> => {
  try {
    // Get the user ID from the auth store
    const userId = useAuthStore.getState().user?.id;
    
    // Create the request payload
    const payload = {
      ...tasbihData,
      userId: userId || tasbihData.userId
    };
    
    console.log('📿 Saving tasbih user counter data:', JSON.stringify(payload, null, 2));
    
    const response = await madrasaClient.post(
      `${MADRASA_API_ENDPOINTS.TASBIH_USER_COUNTER}/save/`,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('📿 Successfully saved tasbih user counter data');
    console.log('📿 Response status:', response.status);
    console.log('📿 Response data:', JSON.stringify(response.data, null, 2));
    
    return response.data;
  } catch (error) {
    console.error('Error saving tasbih user counter data:', error);
    throw error;
  }
};

// Export all functions
const tasbihUserCounterService = {
  saveTasbihUserCounter
};

export default tasbihUserCounterService;
