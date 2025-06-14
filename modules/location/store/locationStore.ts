// modules/location/store/locationStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../../auth/storage/mmkvStorage';
// Removed import of old useLocation hook - no longer needed

// Location state interface
export interface LocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  usingFallback: boolean;
  fallbackSource: string | null;
  loading: boolean;
  error: string | null;
}

// Location actions interface
interface LocationActions {
  setLocation: (latitude: number | null, longitude: number | null) => void;
  setLocationData: (data: Partial<LocationState>) => void;
  setCity: (city: string | null) => void;
  setCountry: (country: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  refreshLocation: () => Promise<void>;
  requestPreciseLocation: () => Promise<boolean>;
  showLocationSettingsAlert: () => void;
  resetLocationStore: () => void;
}

// Initial state
const initialState: LocationState = {
  latitude: null,
  longitude: null,
  city: null,
  country: null,
  usingFallback: false,
  fallbackSource: null,
  loading: true,
  error: null,
};

// Create location store with persistence
export const useLocationStore = create<LocationState & LocationActions>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // State setters
      setLocation: (latitude, longitude) => set({ latitude, longitude }),
      
      setLocationData: (data) => set((state) => ({
        ...state,
        ...data,
      })),
      
      setCity: (city) => set({ city }),
      
      setCountry: (country) => set({ country }),
      
      setLoading: (loading) => set({ loading }),
      
      setError: (error) => set({ error }),
      
        // Refresh location data using location service
  refreshLocation: async () => {
    // Import the location service dynamically to avoid circular imports
    const { default: locationService } = await import('../services/locationService');
    await locationService.initializeLocation();
  },

  // Request precise location (user-triggered)
  requestPreciseLocation: async () => {
    // Import the location service dynamically to avoid circular imports
    const { default: locationService } = await import('../services/locationService');
    return await locationService.requestPreciseLocation();
  },

  // Show settings alert for location permission
  showLocationSettingsAlert: () => {
    // Import the location service dynamically to avoid circular imports
    import('../services/locationService').then(({ default: locationService }) => {
      locationService.showLocationSettingsAlert();
    });
  },
      
      // Reset store to initial state
      resetLocationStore: () => set(initialState),
    }),
    {
      name: 'location-storage',
      storage: createJSONStorage(() => mmkvStorage),
      // Only persist location data
      partialize: (state) => ({
        latitude: state.latitude,
        longitude: state.longitude,
        city: state.city,
        country: state.country,
        usingFallback: state.usingFallback,
        fallbackSource: state.fallbackSource,
      }),
    }
  )
);

// Export a hook to use the location store
export const useLocationData = () => {
  const {
    latitude,
    longitude,
    city,
    country,
    usingFallback,
    fallbackSource,
    loading,
    error,
    setLocation,
    setLocationData,
    setCity,
    setCountry,
    setLoading,
    setError,
    refreshLocation,
    requestPreciseLocation,
    showLocationSettingsAlert,
    resetLocationStore,
  } = useLocationStore();
  
  return {
    latitude,
    longitude,
    city,
    country,
    usingFallback,
    fallbackSource,
    loading,
    error,
    setLocation,
    setLocationData,
    setCity,
    setCountry,
    setLoading,
    setError,
    refreshLocation,
    requestPreciseLocation,
    showLocationSettingsAlert,
    resetLocationStore,
    
    // Helper method to get location data in a format suitable for API requests
    getLocationForApi: () => ({
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      city: city || undefined,
      country: country || undefined,
    }),
  };
};
