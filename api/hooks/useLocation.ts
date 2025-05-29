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
  address: string | null;
  city: string | null;
  country: string | null;
}

// Function to fetch address from coordinates using reverse geocoding
const fetchAddressFromCoordinates = async (latitude: number, longitude: number): Promise<{address: string, city: string | null, country: string | null}> => {
  try {
    // Check internet connection
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      return { address: 'Location found', city: null, country: null };
    }
    
    // Use OpenStreetMap Nominatim API for reverse geocoding (free, no API key required)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          'Accept-Language': 'en', // Request English results
          'User-Agent': 'MadrasaApp/1.0', // Required by Nominatim ToS
        },
      }
    );
    
    const data = await response.json();
    
    if (data && data.display_name) {
      // Extract city and country from address components
      const city = data.address?.city || 
                  data.address?.town || 
                  data.address?.village || 
                  data.address?.hamlet || 
                  null;
                  
      const country = data.address?.country || null;
      
      // Create a simplified address string
      let simplifiedAddress = '';
      if (city) simplifiedAddress += city;
      if (country) {
        if (simplifiedAddress) simplifiedAddress += ', ';
        simplifiedAddress += country;
      }
      
      // If we couldn't create a simplified address, use the full display name
      const address = simplifiedAddress || data.display_name;
      
      return { address, city, country };
    }
    
    return { address: 'Location found', city: null, country: null };
  } catch (error) {
    console.warn('Error in reverse geocoding:', error);
    return { address: 'Location found', city: null, country: null };
  }
};

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
    usingFallback: false,
    fallbackSource: null,
    address: null,
    city: null,
    country: null,
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
        
        // Format address from IP data
        const cityStr = data.city || '';
        const regionStr = data.region || '';
        const countryStr = data.country_name || '';
        
        // Create a formatted address string
        let formattedAddress = '';
        if (cityStr) formattedAddress += cityStr;
        if (regionStr && regionStr !== cityStr) {
          if (formattedAddress) formattedAddress += ', ';
          formattedAddress += regionStr;
        }
        if (countryStr) {
          if (formattedAddress) formattedAddress += ', ';
          formattedAddress += countryStr;
        }
        
        setState({
          latitude: data.latitude,
          longitude: data.longitude,
          error: null,
          loading: false,
          usingFallback: true,
          fallbackSource: 'ip_address',
          address: formattedAddress || 'Location found',
          city: data.city || null,
          country: data.country_name || null,
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
      address: 'Mecca, Saudi Arabia',
      city: 'Mecca',
      country: 'Saudi Arabia',
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
        
        // Get address from coordinates using reverse geocoding
        fetchAddressFromCoordinates(position.coords.latitude, position.coords.longitude)
          .then(addressData => {
            setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              loading: false,
              usingFallback: false,
              fallbackSource: null,
              address: addressData.address,
              city: addressData.city,
              country: addressData.country,
            });
          })
          .catch(error => {
            console.warn('Error getting address from coordinates:', error);
            setState({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              loading: false,
              usingFallback: false,
              fallbackSource: null,
              address: 'Location found',
              city: null,
              country: null,
            });
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
      // Format city name for display (capitalize first letter of each word)
      const formattedCityName = city
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      // Map city names to countries
      const cityToCountry: Record<string, string> = {
        mecca: 'Saudi Arabia',
        medina: 'Saudi Arabia',
        riyadh: 'Saudi Arabia',
        jeddah: 'Saudi Arabia',
        dubai: 'UAE',
        karachi: 'Pakistan',
        istanbul: 'Turkey',
        cairo: 'Egypt',
        kualaLumpur: 'Malaysia',
        jakarta: 'Indonesia',
      };
      
      setState({
        latitude: MAJOR_CITIES[city].latitude,
        longitude: MAJOR_CITIES[city].longitude,
        error: null,
        loading: false,
        usingFallback: true,
        fallbackSource: `custom_${city}`,
        address: `${formattedCityName}, ${cityToCountry[city] || ''}`.trim(),
        city: formattedCityName,
        country: cityToCountry[city] || null,
      });
      return true;
    }
    return false;
  };

  // Function to request location permission directly
  const requestLocationPermissionDirectly = async () => {
    setState(prev => ({ ...prev, loading: true }));
    const hasPermission = await requestLocationPermission();
    if (hasPermission) {
      getLocation();
    }
    return hasPermission;
  };
  
  return { 
    ...state, 
    refreshLocation,
    setCustomLocation,
    requestLocationPermissionDirectly,
    isUsingFallback: state.usingFallback,
    fallbackSource: state.fallbackSource,
    majorCities: Object.keys(MAJOR_CITIES),
    hasAddress: !!state.address,
  };
};
