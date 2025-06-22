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
    console.log('🔐 Checking location permission...');
    
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        console.log('🔐 Android permission check result:', granted);
        return granted;
      } catch (error) {
        console.warn('Error checking Android location permission:', error);
        return false;
      }
    }
    
    if (Platform.OS === 'ios') {
      // For iOS, we can't check permission without potentially triggering a request
      // So we'll just return false to force a proper permission request
      console.log('🔐 iOS permission check - returning false to trigger request');
      return false;
    }
    
    return false;
  },

  /**
   * Request location permission based on platform
   * @returns Promise<boolean> - True if permission granted, false otherwise
   */
  requestLocationPermission: async (): Promise<boolean> => {
    console.log('🔐 Requesting location permission...');
    
    if (Platform.OS === 'ios') {
      try {
        // Configure Geolocation for iOS
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'whenInUse',
        });
        
        // For iOS, we need to actually try to get location to trigger permission request
        return new Promise((resolve) => {
          Geolocation.getCurrentPosition(
            (position) => {
              console.log('✅ iOS location permission granted');
              resolve(true);
            },
            (error) => {
              console.log('❌ iOS location permission denied:', error.message);
              resolve(false);
            },
            { 
              enableHighAccuracy: false, 
              timeout: 10000,
              maximumAge: 60000 
            }
          );
        });
      } catch (error) {
        console.warn('Error requesting iOS location permission:', error);
        return false;
      }
    }

    if (Platform.OS === 'android') {
      try {
        // First check if permission is already granted
        const alreadyGranted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        if (alreadyGranted) {
          console.log('✅ Android location permission already granted');
          return true;
        }
        
        console.log('🔐 Requesting Android location permission...');
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission Required',
            message: 'This app needs access to your location to show accurate prayer times and Qibla direction.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Deny',
            buttonPositive: 'Allow',
          },
        );
        
        console.log('🔐 Android permission result:', granted);
        console.log('🔐 Available results:', {
          GRANTED: PermissionsAndroid.RESULTS.GRANTED,
          DENIED: PermissionsAndroid.RESULTS.DENIED,
          NEVER_ASK_AGAIN: PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN
        });
        
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
   * Get location from IP address using multiple services as fallbacks
   * @returns Promise with location data or null if all services failed
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
      
      // Try multiple IP geolocation services in sequence
      const services = [
        {
          name: 'ip-api.com',
          url: 'http://ip-api.com/json/',
          parseResponse: (data: any) => ({
            latitude: data.lat,
            longitude: data.lon,
            city: data.city || null,
            country: data.country || null,
          })
        },
        {
          name: 'ipapi.co',
          url: 'https://ipapi.co/json/',
          parseResponse: (data: any) => ({
            latitude: data.latitude,
            longitude: data.longitude,
            city: data.city || null,
            country: data.country_name || null,
          })
        },
        {
          name: 'ipinfo.io',
          url: 'https://ipinfo.io/json',
          parseResponse: (data: any) => {
            if (data.loc) {
              const [lat, lon] = data.loc.split(',').map(Number);
              return {
                latitude: lat,
                longitude: lon,
                city: data.city || null,
                country: data.country || null,
              };
            }
            return null;
          }
        },
        {
          name: 'geoip.nekudo.com',
          url: 'https://geoip.nekudo.com/api/',
          parseResponse: (data: any) => ({
            latitude: data.location?.latitude,
            longitude: data.location?.longitude,
            city: data.city || null,
            country: data.country?.name || null,
          })
        }
      ];

      // Try each service until one works
      for (const service of services) {
        try {
          console.log(`🌐 Trying ${service.name}...`);
          
          // Create a timeout promise for manual timeout handling
          const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 8000);
          });
          
          const fetchPromise = fetch(service.url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'MadrasaApp/1.0',
            },
          });
          
          const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
          
          if (!response.ok) {
            console.warn(`❌ ${service.name} returned ${response.status}`);
            continue;
          }
          
          const data = await response.json();
          console.log(`📡 ${service.name} response:`, data);
          
          // Check for rate limiting or error responses
          if (data.error || data.message) {
            console.warn(`❌ ${service.name} error:`, data.error || data.message);
            continue;
          }
          
          const parsedData = service.parseResponse(data);
          
          if (parsedData && parsedData.latitude && parsedData.longitude) {
            console.log(`✅ Successfully got location from ${service.name}:`, {
              latitude: parsedData.latitude,
              longitude: parsedData.longitude,
              city: parsedData.city,
              country: parsedData.country
            });
            
            return {
              latitude: parsedData.latitude,
              longitude: parsedData.longitude,
              city: parsedData.city,
              country: parsedData.country,
            };
          } else {
            console.warn(`❌ ${service.name} returned invalid data:`, parsedData);
          }
          
        } catch (serviceError: any) {
          console.warn(`❌ Error with ${service.name}:`, serviceError.message);
          // Continue to next service
        }
      }
      
      console.log('❌ All IP geolocation services failed');
      return null;
      
    } catch (error: any) {
      console.warn('❌ Error in IP geolocation process:', error);
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
    console.log('🌍 Platform:', Platform.OS);
    
    try {
      // Step 1: Check if permission is already granted
      console.log('🔐 Step 1: Checking existing permission...');
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
        } else {
          console.log('⚠️ Permission granted but failed to get location, proceeding to request permission');
        }
      }
      
      // Step 2: If no permission, request it
      if (!hasPermission) {
        console.log('🔐 Step 2: No permission found, requesting location permission...');
        const permissionGranted = await locationService.requestLocationPermission();
        console.log('🔐 Permission request result:', permissionGranted);
        
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
          console.log('❌ Location permission declined or failed');
          // Don't show settings alert immediately, just proceed to fallback
          console.log('⚠️ User declined location permission, falling back to IP location');
        }
      }
      
      // Step 3: Check store for existing location
      const currentState = useLocationStore.getState();
      if (currentState.latitude && currentState.longitude) {
        console.log('📦 Found existing location in store:', {
          latitude: currentState.latitude,
          longitude: currentState.longitude,
          city: currentState.city,
          country: currentState.country,
          usingFallback: currentState.usingFallback,
          fallbackSource: currentState.fallbackSource
        });
        
        // Update only loading state, keep existing data
        console.log('📦 Setting loading to false for existing location');
        locationStore.setLoading(false);
        return;
      }
      
      // Step 4: Fallback to IP location and store it
      console.log('🔍 No precise location available, trying IP geolocation...');
      const ipLocation = await locationService.getLocationFromIP();
      
      if (ipLocation) {
        // Store IP-based location and MAKE SURE to set loading to false
        console.log('💾 Storing IP location data:', ipLocation);
        locationStore.setLocationData({
          latitude: ipLocation.latitude,
          longitude: ipLocation.longitude,
          city: ipLocation.city,
          country: ipLocation.country,
          usingFallback: true,
          fallbackSource: 'ip_address',
          loading: false,  // ✅ CRITICAL: Set loading to false
          error: null,
        });
        
        console.log('✅ IP location stored successfully with loading=false');
        
        // Log the store state to verify
        const currentState = useLocationStore.getState();
        console.log('📦 Store state after IP location:', {
          latitude: currentState.latitude,
          longitude: currentState.longitude,
          loading: currentState.loading,
          fallbackSource: currentState.fallbackSource
        });
      } else {
        // No location available anywhere
        console.log('❌ Failed to get IP location, setting error state');
        locationStore.setLocationData({
          latitude: null,
          longitude: null,
          city: null,
          country: null,
          usingFallback: true,
          fallbackSource: 'no_location',
          loading: false,  // ✅ Set loading to false even on error
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
