// src/modules/tasbih/services/tasbihStorageService.ts
import { storage } from '@/modules/auth/storage/mmkvStorage';
import { useAuthStore } from '@/modules/auth/store/authStore';

// Define interfaces for the tasbih user counter data
export interface TasbihUserCounterData {
  beadsCounter: number;
  completedRound: number;
  duaId: number;
  timeInMinutes: number;
  lastUpdated: string;
}

/**
 * Saves the user's tasbih counter data to MMKV storage
 * @param tasbihData The tasbih counter data to save
 */
export const saveTasbihUserCounter = (data: Omit<TasbihUserCounterData, 'lastUpdated'>) => {
  try {
    // Get the user ID from the auth store
    const user = useAuthStore.getState().user;
    const userId = user?.userId || user?.email || 'anonymous';
    
    // Create the storage key based on user and dua
    const storageKey = `tasbih_counter_${userId}_${data.duaId}`;
    
    // Get existing data if any
    const existingDataStr = storage.getString(storageKey);
    let existingData: TasbihUserCounterData | null = null;
    
    if (existingDataStr) {
      try {
        existingData = JSON.parse(existingDataStr);
      } catch (e) {
        console.error('Error parsing existing tasbih data:', e);
      }
    }
    
    // Merge with existing data or create new
    const updatedData: TasbihUserCounterData = {
      beadsCounter: data.beadsCounter,
      completedRound: data.completedRound,
      duaId: data.duaId,
      timeInMinutes: (existingData?.timeInMinutes || 0) + data.timeInMinutes,
      lastUpdated: new Date().toISOString()
    };
    
    // Save to MMKV storage
    storage.set(storageKey, JSON.stringify(updatedData));
    
    console.log('📿 Successfully saved tasbih counter data to local storage:', storageKey);
    
    return true;
  } catch (error) {
    console.error('Error saving tasbih counter data to local storage:', error);
    return false;
  }
};

/**
 * Gets the user's tasbih counter data from MMKV storage
 * @param userId The user ID
 * @param duaId The dua ID
 * @returns The tasbih counter data or null if not found
 */
export const getTasbihUserCounter = (duaId: number): TasbihUserCounterData | null => {
  try {
    // Get the user ID from the auth store
    const user = useAuthStore.getState().user;
    const userId = user?.userId || user?.email || 'anonymous';
    
    // Create the storage key based on user and dua
    const storageKey = `tasbih_counter_${userId}_${duaId}`;
    
    // Get data from MMKV storage
    const dataStr = storage.getString(storageKey);
    
    if (!dataStr) {
      return null;
    }
    
    return JSON.parse(dataStr);
  } catch (error) {
    console.error('Error getting tasbih counter data from local storage:', error);
    return null;
  }
};

/**
 * Clears the user's tasbih counter data from MMKV storage
 * @param userId The user ID
 * @param duaId The dua ID
 * @returns True if successful, false otherwise
 */
export const clearTasbihUserCounter = (duaId: number): boolean => {
  try {
    // Get the user ID from the auth store
    const user = useAuthStore.getState().user;
    const userId = user?.userId || user?.email || 'anonymous';
    
    // Create the storage key based on user and dua
    const storageKey = `tasbih_counter_${userId}_${duaId}`;
    
    // Delete from MMKV storage
    storage.delete(storageKey);
    
    console.log('📿 Successfully cleared tasbih counter data from local storage:', storageKey);
    
    return true;
  } catch (error) {
    console.error('Error clearing tasbih counter data from local storage:', error);
    return false;
  }
};

// Export all functions
const tasbihStorageService = {
  saveTasbihUserCounter,
  getTasbihUserCounter,
  clearTasbihUserCounter
};

export default tasbihStorageService;
