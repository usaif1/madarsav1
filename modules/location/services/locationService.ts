// modules/location/services/locationService.ts
import { Platform, Linking, Alert } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { useLocationStore } from '../store/locationStore';

/**
 * Service for handling location-related functionality
 * Priority order: 1) Native location -> 2) Store -> 3) IP address -> Store
 */
const locationService = {
  /**
   * Check if location permission is granted
   * @returns Promise<boolean> - True if permission granted, false otherwise
   */
  checkLocationPermission: async (): Promise<boolean> => {
    const status = await locationService.getPermissionStatus();
    return status === 'granted';
  },

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
   * Get current location from native geolocation
   * @returns Promise with location data or null if failed
   */
  getCurrentLocationFromNative: (): Promise<{latitude: number, longitude: number} | null> => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        position => {
          console.log('✅ Got precise location from native:', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => {
          console.warn('❌ Native geolocation failed:', error.message);
          resolve(null);
        },
        { 
          enableHighAccuracy: false, // Set to false for faster response
          timeout: 8000,            // Shorter timeout (8 seconds)
          maximumAge: 300000,       // Accept positions up to 5 minutes old
        },
      );
    });
  },
  
  /**
   * Get location from IP address as fallback
   * @returns Promise with location data or null if failed
   */
  getLocationFromIP: async (): Promise<{latitude: number, longitude: number, city: string | null, country: string | null} | null> => {
    try {
      // Check if we have internet connection first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log('❌ No internet connection for IP geolocation');
        return null;
      }

      console.log('🔍 Attempting to get location from IP address...');
      // Use a free IP geolocation service that doesn't require an API key
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data && data.latitude && data.longitude) {
        console.log('✅ Successfully got location from IP:', {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          country: data.country_name
        });
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city || null,
          country: data.country_name || null,
        };
      }
      return null;
    } catch (error) {
      console.warn('❌ Error getting location from IP:', error);
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
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
            'User-Agent': 'MadrasaApp/1.0',
          },
        }
      );
      const data = await response.json();
      
      if (data && data.address) {
        const city = data.address?.city || 
                    data.address?.town || 
                    data.address?.village || 
                    data.address?.hamlet || 
                    null;
        const country = data.address?.country || null;
        
        return { city, country };
      }
      
      return { city: null, country: null };
    } catch (error) {
      console.warn('⚠️ Error fetching city/country data:', error);
      return { city: null, country: null };
    }
  },
  
  /**
   * Check permission status details (granted, denied, never ask again)
   * @returns Promise<'granted' | 'denied' | 'never_ask_again' | 'unknown'>
   */
  getPermissionStatus: async (): Promise<'granted' | 'denied' | 'never_ask_again' | 'unknown'> => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        return granted ? 'granted' : 'denied';
      } catch (error) {
        console.warn('Error checking permission status:', error);
        return 'unknown';
      }
    }
    
    if (Platform.OS === 'ios') {
      // For iOS, we can only check by trying to get location
      return new Promise((resolve) => {
        Geolocation.getCurrentPosition(
          () => resolve('granted'),
          (error) => {
            // iOS error codes: 1 = denied, 2 = network error, 3 = timeout
            if (error.code === 1) {
              resolve('denied');
            } else {
              resolve('unknown');
            }
          },
          { timeout: 1000 }
        );
      });
    }
    
    return 'unknown';
  },

  /**
   * Initialize location data following the priority order:
   * 1. Check if permission is already granted -> get native location
   * 2. If no permission, request it -> if granted, get native location
   * 3. If permission denied permanently, show settings prompt
   * 4. If user cancels/declines, use IP location
   * 5. Check store for existing location as backup
   */
  initializeLocation: async (): Promise<void> => {
    const locationStore = useLocationStore.getState();
    locationStore.setLoading(true);
    locationStore.setError(null);
    
    console.log('🌍 Starting location initialization...');
    
    try {
      // Step 1: Check if permission is already granted
      const hasPermission = await locationService.checkLocationPermission();
      console.log('🔐 Location permission status:', hasPermission);
      
      if (hasPermission) {
        console.log('✅ Permission already granted, trying native location...');
        const nativeLocation = await locationService.getCurrentLocationFromNative();
        
        if (nativeLocation) {
          console.log('✅ Got native location, fetching city/country...');
          // Get city and country for native location
          const { city, country } = await locationService.getCityAndCountry(
            nativeLocation.latitude, 
            nativeLocation.longitude
          );
          
          // Store native location data
          locationStore.setLocationData({
            latitude: nativeLocation.latitude,
            longitude: nativeLocation.longitude,
            city,
            country,
            usingFallback: false,
            fallbackSource: null,
            loading: false,
            error: null,
          });
          
          console.log('✅ Native location stored successfully');
          return;
        }
      }
      
      // Step 2: If no permission, request it
      if (!hasPermission) {
        console.log('🔐 No permission, requesting location permission...');
        const permissionGranted = await locationService.requestLocationPermission();
        
        if (permissionGranted) {
          console.log('✅ Permission granted, trying native location...');
          const nativeLocation = await locationService.getCurrentLocationFromNative();
          
          if (nativeLocation) {
            console.log('✅ Got native location after permission request, fetching city/country...');
            // Get city and country for native location
            const { city, country } = await locationService.getCityAndCountry(
              nativeLocation.latitude, 
              nativeLocation.longitude
            );
            
            // Store native location data
            locationStore.setLocationData({
              latitude: nativeLocation.latitude,
              longitude: nativeLocation.longitude,
              city,
              country,
              usingFallback: false,
              fallbackSource: null,
              loading: false,
              error: null,
            });
            
            console.log('✅ Native location stored successfully after permission request');
            return;
          }
        } else {
          console.log('❌ Location permission declined');
          // Show settings alert if user wants to enable location later
          locationService.showLocationSettingsAlert();
          
          // Set fallback to IP location
          console.log('⚠️ User declined location permission, falling back to IP location');
        }
      }
      
      // Step 3: Check store for existing location
      const currentState = useLocationStore.getState();
      if (currentState.latitude && currentState.longitude && !currentState.usingFallback) {
        console.log('📦 Found existing precise location in store:', {
          latitude: currentState.latitude,
          longitude: currentState.longitude,
          city: currentState.city,
          country: currentState.country,
        });
        
        // Update only loading state, keep existing data
        locationStore.setLoading(false);
        return;
      }
      
      // Step 4: Fallback to IP location and store it
      console.log('🔍 No precise location available, trying IP geolocation...');
      const ipLocation = await locationService.getLocationFromIP();
      
      if (ipLocation) {
        // Store IP-based location
        locationStore.setLocationData({
          latitude: ipLocation.latitude,
          longitude: ipLocation.longitude,
          city: ipLocation.city,
          country: ipLocation.country,
          usingFallback: true,
          fallbackSource: 'ip_address',
          loading: false,
          error: null,
        });
        
        console.log('✅ IP location stored successfully');
      } else {
        // No location available anywhere
        locationStore.setLocationData({
          latitude: null,
          longitude: null,
          city: null,
          country: null,
          usingFallback: true,
          fallbackSource: 'no_location',
          loading: false,
          error: 'Could not determine location. Please enable location services.',
        });
        
        console.log('❌ No location data available from any source');
      }
    } catch (error: any) {
      console.error('❌ Error initializing location:', error);
      locationStore.setLocationData({
        latitude: null,
        longitude: null,
        city: null,
        country: null,
        usingFallback: true,
        fallbackSource: 'error',
        loading: false,
        error: error.message || 'Failed to initialize location',
      });
    }
  },

  /**
   * Show alert to guide user to app settings for location permission
   */
  showLocationSettingsAlert: (): void => {
    Alert.alert(
      'Location Permission Required',
      'This app needs location access to show accurate prayer times and Qibla direction. Please enable location access in your device settings.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Open Settings',
          onPress: () => {
            if (Platform.OS === 'ios') {
              Linking.openURL('app-settings:');
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );
  },

  /**
   * Request precise location (user-triggered)
   * This will request permission and get native location
   */
  requestPreciseLocation: async (): Promise<boolean> => {
    const locationStore = useLocationStore.getState();
    locationStore.setLoading(true);
    locationStore.setError(null);
    
    console.log('🎯 User requested precise location...');
    
    try {
      // Request permission
      const hasPermission = await locationService.requestLocationPermission();
      
      if (!hasPermission) {
        console.log('❌ User denied location permission');
        locationStore.setLoading(false);
        return false;
      }
      
      // Get native location
      const nativeLocation = await locationService.getCurrentLocationFromNative();
      
      if (nativeLocation) {
        console.log('✅ Got precise location from user request');
        // Get city and country
        const { city, country } = await locationService.getCityAndCountry(
          nativeLocation.latitude, 
          nativeLocation.longitude
        );
        
        // Store precise location data
        locationStore.setLocationData({
          latitude: nativeLocation.latitude,
          longitude: nativeLocation.longitude,
          city,
          country,
          usingFallback: false,
          fallbackSource: null,
          loading: false,
          error: null,
        });
        
        return true;
      } else {
        console.log('❌ Failed to get native location even with permission');
        locationStore.setLoading(false);
        return false;
      }
    } catch (error: any) {
      console.error('❌ Error requesting precise location:', error);
      locationStore.setError(error.message || 'Failed to get precise location');
      locationStore.setLoading(false);
      return false;
    }
  },
};

export default locationService;
