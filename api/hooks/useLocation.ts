import { useState, useEffect } from 'react';
import Geolocation from '@react-native-community/geolocation';
import { Platform, PermissionsAndroid } from 'react-native';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useLocation = () => {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

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
        setState(prev => ({
          ...prev,
          error: 'Error requesting location permission',
          loading: false,
        }));
        return false;
      }
    }

    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to show Qibla direction.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Error requesting location permission',
          loading: false,
        }));
        return false;
      }
    }
    return false;
  };

  const getLocation = async () => {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      setState(prev => ({
        ...prev,
        error: 'Location permission not granted',
        loading: false,
      }));
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        });
      },
      error => {
        setState(prev => ({
          ...prev,
          error: error.message,
          loading: false,
        }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const refreshLocation = () => {
    setState(prev => ({ ...prev, loading: true }));
    getLocation();
  };

  return { ...state, refreshLocation };
};
