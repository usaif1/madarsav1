import { useQuery } from '@tanstack/react-query';
import { fetchPrayerTimes } from '@/api/services/prayerTimesService';
import { useLocation } from '@/api/hooks/useLocation';
import { formatDate } from '../utils/dateUtils';

/**
 * Hook to fetch prayer times for a specific date using the AlAdhan API
 * @param date The date to fetch prayer times for
 * @param method Prayer calculation method (defaults to 3 - Muslim World League)
 */
export const useCalendarPrayerTimes = (date: Date, method: number = 3) => {
  const { latitude, longitude, loading: locationLoading, error: locationError } = useLocation();
  
  // Format date as DD-MM-YYYY for the API
  const formattedDate = formatDate(date);
  
  console.log('useCalendarPrayerTimes: Params:', { 
    date: formattedDate,
    latitude, 
    longitude, 
    method 
  });
  
  const { 
    data, 
    isLoading: prayerTimesLoading, 
    error: prayerTimesError,
    refetch
  } = useQuery({
    queryKey: ['prayerTimes', formattedDate, latitude, longitude, method],
    queryFn: async () => {
      if (!latitude || !longitude) {
        throw new Error('Location data is required to fetch prayer times');
      }
      
      console.log('useCalendarPrayerTimes: Fetching prayer times with params:', {
        date: formattedDate,
        latitude,
        longitude,
        method
      });
      
      try {
        const response = await fetchPrayerTimes(latitude, longitude, formattedDate, method);
        console.log('useCalendarPrayerTimes: API response received:', response);
        return response;
      } catch (error) {
        console.error('useCalendarPrayerTimes: Error fetching prayer times:', error);
        throw error;
      }
    },
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
    gcTime: 1000 * 60 * 60 * 24, // Keep in cache for 24 hours
  });
  
  return {
    data,
    isLoading: locationLoading || prayerTimesLoading,
    error: locationError || prayerTimesError,
    refetch,
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
