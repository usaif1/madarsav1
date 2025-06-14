import { useQuery } from '@tanstack/react-query';
import { fetchPrayerTimes } from '@/api/services/prayerTimesService';
import { useLocationData } from '@/modules/location/hooks/useLocationData';
import { formatDate } from '../utils/dateUtils';
import { useState, useEffect, useRef } from 'react';

/**
 * Hook to fetch prayer times for a specific date using the AlAdhan API
 * @param date The date to fetch prayer times for
 * @param method Prayer calculation method (defaults to 3 - Muslim World League)
 */
export const useCalendarPrayerTimes = (date: Date, method: number = 3) => {
  const { 
    latitude, 
    longitude, 
    loading: locationLoading, 
    error: locationError,
    usingFallback,
    fallbackSource
  } = useLocationData();
  
  // Track retry attempts
  const [retryAttempts, setRetryAttempts] = useState(0);
  const [lastError, setLastError] = useState<Error | null>(null);
  
  // Track if component is mounted
  const isMountedRef = useRef<boolean>(true);
  
  // Format date as DD-MM-YYYY for the API
  const formattedDate = formatDate(date);
  
  // Only log when in development and component is mounted
  useEffect(() => {
    if (__DEV__ && isMountedRef.current) {
      console.log('useCalendarPrayerTimes: Params:', { 
        date: formattedDate,
        latitude, 
        longitude, 
        method,
        usingFallback,
        fallbackSource
      });
    }
  }, [formattedDate, latitude, longitude, method, usingFallback, fallbackSource]);
  
  // Fallback logic removed - using store-based location instead
  useEffect(() => {
    if (lastError && retryAttempts < 3 && isMountedRef.current) {
      // Just retry with current location data from store
      if (__DEV__) {
        console.log(`Prayer times fetch failed. Retrying with store location data...`);
      }
      
      setRetryAttempts(prev => prev + 1);
    }
  }, [lastError, retryAttempts]);
  
  const { 
    data, 
    isLoading: prayerTimesLoading, 
    error: prayerTimesError,
    refetch
  } = useQuery({
    queryKey: ['prayerTimes', formattedDate, latitude, longitude, method],
    queryFn: async () => {
      if (!latitude || !longitude) {
        setLastError(new Error('Location data is required to fetch prayer times'));
        throw new Error('Location data is required to fetch prayer times');
      }
      
      if (__DEV__ && isMountedRef.current) {
        console.log('useCalendarPrayerTimes: Fetching prayer times with params:', {
          date: formattedDate,
          latitude,
          longitude,
          method,
          usingFallback: usingFallback ? 'yes' : 'no',
          fallbackSource
        });
      }
      
      try {
        const response = await fetchPrayerTimes(latitude, longitude, formattedDate, method);
        if (__DEV__ && isMountedRef.current) {
          console.log('useCalendarPrayerTimes: API response received');
        }
        
        if (isMountedRef.current) {
          setLastError(null); // Clear error state on success
        }
        return response;
      } catch (error: any) {
        if (__DEV__ && isMountedRef.current) {
          console.error('useCalendarPrayerTimes: Error fetching prayer times:', error);
        }
        
        if (isMountedRef.current) {
          setLastError(error);
        }
        
        // Provide more user-friendly error message
        if (error.message.includes('timeout') || error.message.includes('network')) {
          throw new Error('Network timeout. Please check your internet connection.');
        } else if (error.response && error.response.status === 400) {
          throw new Error('Invalid parameters for prayer times. Using fallback data.');
        } else {
          throw error;
        }
      }
    },
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
    retry: 2,                   // Retry failed requests twice
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000), // Exponential backoff
  });
  
  // Set up mount/unmount handling
  useEffect(() => {
    isMountedRef.current = true;
    
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return {
    data,
    isLoading: locationLoading || prayerTimesLoading,
    error: locationError || prayerTimesError,
    refetch,
    usingFallback,
    fallbackSource
  };
};

/**
 * Format prayer time from HH:MM 24-hour format to 12-hour format with AM/PM
 * @param timeString Prayer time in HH:MM format (e.g., "05:30" or "17:45")
 * @returns Formatted time string (e.g., "5:30 AM" or "5:45 PM")
 */
export const formatPrayerTime = (timeString?: string): string => {
  if (!timeString) return '';
  
  // Parse the time string (expected format: "HH:MM")
  const [hourStr, minuteStr] = timeString.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  if (isNaN(hour) || isNaN(minute)) {
    console.warn('formatPrayerTime: Invalid time format:', timeString);
    return timeString; // Return original if parsing fails
  }
  
  // Convert to 12-hour format
  const period = hour >= 12 ? 'PM' : 'AM';
  let hour12 = hour % 12;
  if (hour12 === 0) hour12 = 12; // 0 should be displayed as 12 in 12-hour format
  
  // Format with leading zeros for minutes
  const formattedMinute = minute < 10 ? `0${minute}` : minute;
  
  return `${hour12}:${formattedMinute} ${period}`;
};
