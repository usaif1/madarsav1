import { useState, useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, NativeModules } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// Default location coordinates (Mecca as fallback)
const DEFAULT_COORDINATES = {
  latitude: 21.4225,
  longitude: 39.8262,
};

// Major cities coordinates for fallback options
const MAJOR_CITIES = {
  mecca: { latitude: 21.4225, longitude: 39.8262 },
  medina: { latitude: 24.5247, longitude: 39.5692 },
  riyadh: { latitude: 24.7136, longitude: 46.6753 },
  jeddah: { latitude: 21.4858, longitude: 39.1925 },
  dubai: { latitude: 25.2048, longitude: 55.2708 },
  karachi: { latitude: 24.8607, longitude: 67.0011 },
  istanbul: { latitude: 41.0082, longitude: 28.9784 },
  cairo: { latitude: 30.0444, longitude: 31.2357 },
  kualaLumpur: { latitude: 3.1390, longitude: 101.6869 },
  jakarta: { latitude: -6.2088, longitude: 106.8456 },
};

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
  usingFallback: boolean;
  fallbackSource: string | null;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    usingFallback: false,
    fallbackSource: null,
  });
  
  // Timeout reference for location request
  const timeoutRef = useState<NodeJS.Timeout | null>(null);
  
  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true);

  // Try to get location from IP address
  const getLocationFromIP = async (): Promise<boolean> => {
    try {
      // Check if we have internet connection first
      const netInfo = await NetInfo.fetch();
      if (!netInfo.isConnected) {
        console.log('No internet connection for IP geolocation');
        return false;
      }

      console.log('Attempting to get location from IP address...');
      // Use a free IP geolocation service that doesn't require an API key
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data && data.latitude && data.longitude) {
        console.log('Successfully got location from IP:', data);
        setState({
          latitude: data.latitude,
          longitude: data.longitude,
          error: null,
          loading: false,
          usingFallback: true,
          fallbackSource: 'ip_address',
        });
        return true;
      }
      return false;
    } catch (error) {
      console.warn('Error getting location from IP:', error);
      return false;
    }
  };

  // Use fallback location (Mecca as default)
  const useFallbackLocation = async (source: string) => {
    console.log(`Using fallback location: ${source}`);
    
    // First try to get location from IP
    const gotIPLocation = await getLocationFromIP();
    if (gotIPLocation) return;
    
    // If IP location fails, use default coordinates
    setState({
      latitude: DEFAULT_COORDINATES.latitude,
      longitude: DEFAULT_COORDINATES.longitude,
      error: null,
      loading: false,
      usingFallback: true,
      fallbackSource: source,
    });
  };

  const requestLocationPermission = async () => {
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
        useFallbackLocation('permission_error');
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
        
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Location permission denied by user');
          useFallbackLocation('permission_denied');
          return false;
        }
        
        return true;
      } catch (error) {
        console.warn('Error requesting Android location permission:', error);
        useFallbackLocation('permission_error');
        return false;
      }
    }
    
    useFallbackLocation('unsupported_platform');
    return false;
  };

  const getLocation = async () => {
    // Clear any existing timeout
    if (timeoutRef[0]) {
      clearTimeout(timeoutRef[0]);
      timeoutRef[0] = null;
    }
    
    // Check if component is still mounted
    if (!isMountedRef.current) return;
    
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      // Already handled in requestLocationPermission
      return;
    }

    // Set a backup timeout in case Geolocation.getCurrentPosition hangs
    timeoutRef[0] = setTimeout(() => {
      if (isMountedRef.current) {
        console.warn('Location request timed out after 10 seconds');
        useFallbackLocation('timeout');
      }
    }, 10000); // 10 second backup timeout

    Geolocation.getCurrentPosition(
      position => {
        // Clear the backup timeout since we got a response
        if (timeoutRef[0]) {
          clearTimeout(timeoutRef[0]);
          timeoutRef[0] = null;
        }
        
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
          usingFallback: false,
          fallbackSource: null,
        });
      },
      error => {
        // Clear the backup timeout since we got a response
        if (timeoutRef[0]) {
          clearTimeout(timeoutRef[0]);
          timeoutRef[0] = null;
        }
        
        console.warn('Geolocation error:', error.message);
        useFallbackLocation('geolocation_error');
      },
      { 
        enableHighAccuracy: false, // Set to false for faster response
        timeout: 8000,            // Shorter timeout (8 seconds)
        maximumAge: 60000,        // Accept positions up to 1 minute old
      },
    );
  };

  useEffect(() => {
    // Set mounted flag
    isMountedRef.current = true;
    
    getLocation();
    
    // Cleanup function to clear any pending timeouts and mark as unmounted
    return () => {
      isMountedRef.current = false;
      if (timeoutRef[0]) {
        clearTimeout(timeoutRef[0]);
        timeoutRef[0] = null;
      }
    };
  }, []);

  const refreshLocation = () => {
    setState(prev => ({ 
      ...prev, 
      loading: true,
      error: null,
    }));
    getLocation();
  };
  
  const setCustomLocation = (city: keyof typeof MAJOR_CITIES) => {
    if (MAJOR_CITIES[city]) {
      setState({
        latitude: MAJOR_CITIES[city].latitude,
        longitude: MAJOR_CITIES[city].longitude,
        error: null,
        loading: false,
        usingFallback: true,
        fallbackSource: `custom_${city}`,
      });
      return true;
    }
    return false;
  };

  return { 
    ...state, 
    refreshLocation,
    setCustomLocation,
    isUsingFallback: state.usingFallback,
    fallbackSource: state.fallbackSource,
    majorCities: Object.keys(MAJOR_CITIES),
  };
};
