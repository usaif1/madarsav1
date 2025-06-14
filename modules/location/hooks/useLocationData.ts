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
    showLocationSettingsAlert,
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
    showLocationSettingsAlert,
    
    // Helper methods
    hasLocation: latitude !== null && longitude !== null,
    isUsingFallback: usingFallback,
    isPermissionDenied: fallbackSource === 'permission_denied' || fallbackSource === 'permission_denied_ip_fallback',
    isUsingEstimatedLocation: fallbackSource === 'ip_address' || fallbackSource === 'permission_denied_ip_fallback',
    
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
    
    // Get status message for UI
    getLocationStatus: () => {
      if (loading) return 'Getting location...';
      if (error) return error;
      if (fallbackSource === 'permission_denied') return 'Location permission denied';
      if (fallbackSource === 'permission_denied_ip_fallback') return 'Using estimated location';
      if (fallbackSource === 'ip_address') return 'Using estimated location';
      if (usingFallback) return 'Using approximate location';
      return 'Using precise location';
    },
  };
};

export default useLocationData;