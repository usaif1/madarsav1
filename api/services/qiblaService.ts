import apiClients from '../clients/globalClient';
import { API_ENDPOINTS } from '../config/apiConfig';

export interface QiblaResponse {
  coordinates: {
    request: {
      latitude: number;
      longitude: number;
    };
    kaaba: {
      latitude: number;
      longitude: number;
    };
    difference: number;
  };
  timezone: {
    request: string;
    kaaba: string;
    difference: string;
  };
  degrees: number;
}

export const fetchQiblaDirection = async (
  latitude: number,
  longitude: number,
): Promise<QiblaResponse> => {
  try {
    // Ensure latitude and longitude are valid numbers and properly formatted
    const validLatitude = parseFloat(latitude.toString());
    const validLongitude = parseFloat(longitude.toString());
    
    // Check if the values are valid numbers
    if (isNaN(validLatitude) || isNaN(validLongitude)) {
      throw new Error('Invalid latitude or longitude values');
    }
    
    // Make the API request with properly formatted parameters
    const response = await apiClients.ISLAMIC_DEVELOPERS.get(API_ENDPOINTS.QIBLA, {
      params: { 
        latitude: validLatitude.toFixed(6), 
        longitude: validLongitude.toFixed(6) 
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching Qibla direction:', error);
    throw error;
  }
};
