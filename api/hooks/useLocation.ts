import { useState, useEffect, useRef } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid, NativeModules } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

// No default coordinates - we'll only use IP-based location as fallback

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
      console.log('📱 NetInfo status:', {
        isConnected: netInfo.isConnected,
        type: netInfo.type,
        isInternetReachable: netInfo.isInternetReachable
      });
      
      if (!netInfo.isConnected) {
        console.log('❌ No internet connection for IP geolocation');
        return false;
      }

      console.log('🔍 Attempting to get location from IP address...');
      // Use a free IP geolocation service that doesn't require an API key
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      console.log('📍 IP geolocation raw data:', JSON.stringify(data, null, 2));
      
      if (data && data.latitude && data.longitude) {
        console.log('✅ Successfully got location from IP:', {
          latitude: data.latitude,
          longitude: data.longitude,
          city: data.city,
          region: data.region,
          country: data.country_name
        });
        
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
        
        console.log('📍 Formatted address from IP:', formattedAddress);
        
        // Update state with IP location data
        const newState = {
          latitude: data.latitude,
          longitude: data.longitude,
          error: null,
          loading: false,
          usingFallback: true,
          fallbackSource: 'ip_address',
          address: formattedAddress || 'Location found',
          city: data.city || null,
          country: data.country_name || null,
        };
        
        console.log('🔄 Setting state with IP location:', newState);
        setState(newState);
        return true;
      }
      
      console.log('❌ IP geolocation failed - missing latitude/longitude');
      return false;
    } catch (error) {
      console.warn('❌ Error getting location from IP:', error);
      return false;
    }
  };

  // Use fallback location (IP-based only)
  const useFallbackLocation = async (source: string) => {
    console.log(`Using fallback location: ${source}`);
    
    // Try to get location from IP
    const gotIPLocation = await getLocationFromIP();
    if (!gotIPLocation) {
      // If IP location fails, set error state
      setState({
        latitude: null,
        longitude: null,
        error: 'Could not determine your location. Please enable location services.',
        loading: false,
        usingFallback: true,
        fallbackSource: 'no_location',
        address: null,
        city: null,
        country: null,
      });
    }
  };

  const requestLocationPermission = async () => {
    console.log('🔑 Requesting location permission...');
    
    if (Platform.OS === 'ios') {
      try {
        // Configure Geolocation for iOS
        Geolocation.setRNConfiguration({
          skipPermissionRequests: false,
          authorizationLevel: 'whenInUse',
        });
        
        // iOS doesn't return a promise, so we'll assume it's granted
        // The actual permission dialog will show up when getCurrentPosition is called
        console.log('✅ iOS location permission setup complete');
        return true;
      } catch (error) {
        console.warn('❌ Error requesting iOS location permission:', error);
        // Immediately try to get location from IP
        const gotIpLocation = await getLocationFromIP();
        if (!gotIpLocation) {
          useFallbackLocation('permission_error');
        }
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
          console.warn('❌ Location permission denied by user');
          // Immediately try to get location from IP
          console.log('🔍 Permission denied, trying IP-based location...');
          const gotIpLocation = await getLocationFromIP();
          if (!gotIpLocation) {
            useFallbackLocation('permission_denied');
          }
          return false;
        }
        
        console.log('✅ Android location permission granted');
        return true;
      } catch (error) {
        console.warn('❌ Error requesting Android location permission:', error);
        // Immediately try to get location from IP
        const gotIpLocation = await getLocationFromIP();
        if (!gotIpLocation) {
          useFallbackLocation('permission_error');
        }
        return false;
      }
    }
    
    console.log('❌ Unsupported platform for location');
    // Immediately try to get location from IP
    const gotIpLocation = await getLocationFromIP();
    if (!gotIpLocation) {
      useFallbackLocation('unsupported_platform');
    }
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
    
    console.log('📍 Starting location acquisition process');
    setState(prev => ({ ...prev, loading: true }));
    
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      console.log('⚠️ Permission not granted, IP-based location should have been attempted');
      // The requestLocationPermission function already tries to get IP-based location
      // and updates the state accordingly, so we don't need to do anything else here
      return;
    }

    console.log('✅ Permission granted, getting precise location...');
    
    // Set a backup timeout in case Geolocation.getCurrentPosition hangs
    timeoutRef[0] = setTimeout(() => {
      if (isMountedRef.current) {
        console.warn('⏰ Location request timed out after 10 seconds');
        getLocationFromIP().then(gotIpLocation => {
          if (!gotIpLocation) {
            useFallbackLocation('timeout');
          }
        });
      }
    }, 10000); // 10 second backup timeout

    Geolocation.getCurrentPosition(
      position => {
        // Clear the backup timeout since we got a response
        if (timeoutRef[0]) {
          clearTimeout(timeoutRef[0]);
          timeoutRef[0] = null;
        }
        
        console.log('📍 Got precise location:', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
        
        // Get address from coordinates using reverse geocoding
        fetchAddressFromCoordinates(position.coords.latitude, position.coords.longitude)
          .then(addressData => {
            console.log('📍 Address from coordinates:', addressData);
            
            const newState = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              error: null,
              loading: false,
              usingFallback: false,
              fallbackSource: null,
              address: addressData.address,
              city: addressData.city,
              country: addressData.country,
            };
            
            console.log('🔄 Setting state with precise location:', newState);
            setState(newState);
          })
          .catch(error => {
            console.warn('⚠️ Error getting address from coordinates:', error);
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
        
        console.warn('❌ Geolocation error:', error.message);
        
        // Try to get location from IP
        console.log('🔍 Geolocation failed, trying IP-based location...');
        getLocationFromIP().then(gotIpLocation => {
          if (!gotIpLocation) {
            useFallbackLocation('geolocation_error');
          }
        });
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
  
  // We no longer support custom city locations - only use actual location or IP-based fallback

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
    requestLocationPermissionDirectly,
    isUsingFallback: state.usingFallback,
    fallbackSource: state.fallbackSource,
    hasAddress: !!state.address,
  };
};
