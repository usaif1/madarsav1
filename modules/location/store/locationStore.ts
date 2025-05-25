// modules/location/store/locationStore.ts
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from '../../auth/storage/mmkvStorage';
import { useLocation } from '../../../api/hooks/useLocation';

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
      
      // Refresh location data
      refreshLocation: async () => {
        set({ loading: true, error: null });
        
        try {
          // Use the existing useLocation hook to get location
          const locationHook = useLocation();
          
          // Wait for location to be fetched
          await new Promise<void>((resolve) => {
            const checkLocation = () => {
              if (!locationHook.loading) {
                resolve();
              } else {
                setTimeout(checkLocation, 500);
              }
            };
            checkLocation();
          });
          
          // Update location state with the fetched data
          set({
            latitude: locationHook.latitude,
            longitude: locationHook.longitude,
            usingFallback: locationHook.usingFallback,
            fallbackSource: locationHook.fallbackSource,
            loading: false,
            error: locationHook.error,
          });
          
          // Try to get city and country from coordinates
          if (locationHook.latitude && locationHook.longitude) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationHook.latitude}&lon=${locationHook.longitude}&zoom=10`
              );
              const data = await response.json();
              
              if (data && data.address) {
                set({
                  city: data.address.city || data.address.town || data.address.village || null,
                  country: data.address.country || null,
                });
              }
            } catch (error) {
              console.warn('Error fetching city/country data:', error);
              // Don't set an error state here as we already have coordinates
            }
          }
        } catch (error: any) {
          set({
            error: error.message || 'Failed to get location',
            loading: false,
          });
        }
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
