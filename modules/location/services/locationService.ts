// modules/location/services/locationService.ts
import { Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useLocationStore } from '../store/locationStore';

// Default location coordinates (Mecca as fallback)
const DEFAULT_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262,
};

/**
 * Service for handling location-related functionality
 */
const locationService = {
  /**
   * Request location permission based on platform
   * @returns Promise<boolean> - True if permission granted, false otherwise
   */
  requestLocationPermission: async (): Promise<boolean> => {
    if (Platform.OS === 'ios') {
      try {
        // Configure Geolocation for iOS
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'whenInUse',
        });
        
        // iOS doesn't return a promise, so we'll assume it's granted
        // The actual permission dialog will show up when getCurrentPosition is called
        return true;
      } catch (error) {
        console.warn('Error requesting iOS location permission:', error);
        return false;
      }
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show Qibla direction and prayer times.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        console.warn('Error requesting Android location permission:', error);
        return false;
      }
    }
    
    return false;
  },
  
  /**
   * Get current location
   * @returns Promise with location data
   */
  getCurrentLocation: (): Promise<{latitude: number, longitude: number}> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.warn('Geolocation error:', error.message);
          reject(error);
        },
        { 
          enableHighAccuracy: false, // Set to false for faster response
          timeout: 8000,            // Shorter timeout (8 seconds)
          maximumAge: 60000,        // Accept positions up to 1 minute old
        },
      );
    });
  },
  
  /**
   * Get location from IP address as fallback
   * @returns Promise with location data
   */
  getLocationFromIP: async (): Promise<{latitude: number, longitude: number} | null> => {
    try {
      // Check if we have internet connection first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log('No internet connection for IP geolocation');
        return null;
      }

      console.log('Attempting to get location from IP address...');
      // Use a free IP geolocation service that doesn't require an API key
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data && data.latitude && data.longitude) {
        console.log('Successfully got location from IP:', data);
        return {
          latitude: data.latitude,
          longitude: data.longitude,
        };
      }
      return null;
    } catch (error) {
      console.warn('Error getting location from IP:', error);
      return null;
    }
  },
  
  /**
   * Get city and country from coordinates using reverse geocoding
   * @param latitude Latitude coordinate
   * @param longitude Longitude coordinate
   * @returns Promise with city and country data
   */
  getCityAndCountry: async (
    latitude: number, 
    longitude: number
  ): Promise<{city: string | null, country: string | null}> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
      );
      const data = await response.json();
      
      if (data && data.address) {
        return {
          city: data.address.city || data.address.town || data.address.village || null,
          country: data.address.country || null,
        };
      }
      
      return { city: null, country: null };
    } catch (error) {
      console.warn('Error fetching city/country data:', error);
      return { city: null, country: null };
    }
  },
  
  /**
   * Initialize location data and store it
   * This should be called early in the app lifecycle (e.g., splash screen)
   */
  initializeLocation: async (): Promise<void> => {
    const locationStore = useLocationStore.getState();
    locationStore.setLoading(true);
    
    try {
      // First try to get permission and current location
      const hasPermission = await locationService.requestLocationPermission();
      
      if (hasPermission) {
        try {
          // Get current location
          const location = await locationService.getCurrentLocation();
          
          // Update store with location data
          locationStore.setLocation(location.latitude, location.longitude);
          locationStore.setLocationData({ 
            usingFallback: false,
            fallbackSource: null,
          });
          
          // Get city and country
          const { city, country } = await locationService.getCityAndCountry(
            location.latitude, 
            location.longitude
          );
          
          locationStore.setCity(city);
          locationStore.setCountry(country);
          
          console.log('Location initialized successfully:', {
            latitude: location.latitude,
            longitude: location.longitude,
            city,
            country,
          });
          
          locationStore.setLoading(false);
          return;
        } catch (error) {
          console.warn('Error getting current location, trying fallback:', error);
        }
      }
      
      // If we couldn't get the current location, try IP-based location
      const ipLocation = await locationService.getLocationFromIP();
      
      if (ipLocation) {
        // Update store with IP-based location
        locationStore.setLocation(ipLocation.latitude, ipLocation.longitude);
        locationStore.setLocationData({
          usingFallback: true,
          fallbackSource: 'ip_address',
        });
        
        // Get city and country
        const { city, country } = await locationService.getCityAndCountry(
          ipLocation.latitude,
          ipLocation.longitude
        );
        
        locationStore.setCity(city);
        locationStore.setCountry(country);
        
        console.log('Location initialized from IP:', {
          latitude: ipLocation.latitude,
          longitude: ipLocation.longitude,
          city,
          country,
        });
      } else {
        // Use default location as last resort
        locationStore.setLocation(DEFAULT_COORDINATES.latitude, DEFAULT_COORDINATES.longitude);
        locationStore.setLocationData({
          usingFallback: true,
          fallbackSource: 'default',
          city: 'Mecca',
          country: 'Saudi Arabia',
        });
        
        console.log('Using default location (Mecca)');
      }
    } catch (error: any) {
      console.error('Error initializing location:', error);
      locationStore.setError(error.message || 'Failed to initialize location');
      
      // Use default location as fallback
      locationStore.setLocation(DEFAULT_COORDINATES.latitude, DEFAULT_COORDINATES.longitude);
      locationStore.setLocationData({
        usingFallback: true,
        fallbackSource: 'error',
        city: 'Mecca',
        country: 'Saudi Arabia',
      });
    } finally {
      locationStore.setLoading(false);
    }
  },
};

export default locationService;
