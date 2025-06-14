// modules/location/hooks/useLocationData.ts
import { useLocationStore } from '../store/locationStore';

/**
 * Standardized hook for accessing location data
 * All components should use this hook instead of accessing location directly
 */
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
    refreshLocation,
    requestPreciseLocation,
  } = useLocationStore();
  
  return {
    // Location data
    latitude,
    longitude,
    city,
    country,
    
    // Status flags
    usingFallback,
    fallbackSource,
    loading,
    error,
    
    // Actions
    refreshLocation,
    requestPreciseLocation,
    
    // Helper methods
    hasLocation: latitude !== null && longitude !== null,
    isUsingFallback: usingFallback,
    
    // For API requests
    getLocationForApi: () => ({
      latitude: latitude || undefined,
      longitude: longitude || undefined,
      city: city || undefined,
      country: country || undefined,
    }),
    
    // For display purposes
    getDisplayLocation: () => {
      if (city && country) return `${city}, ${country}`;
      if (city) return city;
      if (country) return country;
      if (latitude && longitude) return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      return 'Location not available';
    },
  };
};

export default useLocationData;