import { useQuery } from '@tanstack/react-query';
import { fetchCalendarData, CalendarParams, CalendarResponse } from '../services/calendarService';
import { useLocationData } from '../../location/hooks/useLocationData';

export const useCalendarData = (params: CalendarParams) => {
  return useQuery<CalendarResponse[], Error>({
    queryKey: ['calendar', params],
    queryFn: async () => {
      console.log('useCalendarData: Fetching with params:', JSON.stringify(params, null, 2));
      try {
        const data = await fetchCalendarData(params);
        console.log('useCalendarData: Fetch successful, received data length:', data?.length);
        return data;
      } catch (error) {
        console.error('useCalendarData: Fetch failed:', error);
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // Consider data fresh for 1 hour
  });
};

// Hook that combines location with calendar data
export const useCalendarWithLocation = (date: Date, method: string = 'MuslimWorldLeague') => {
  const { latitude, longitude, loading: locationLoading, error: locationError } = useLocationData();
  
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-based, API expects 1-based
  const day = date.getDate();
  
  console.log('useCalendarWithLocation: Location data:', { latitude, longitude, locationLoading, locationError });
  console.log('useCalendarWithLocation: Date info:', { year, month, day, method });
  
  const params: CalendarParams = {
    year,
    month,
    day,
    method: method as any,
  };
  
  // Add location if available
  if (latitude !== null && longitude !== null) {
    params.latitude = latitude;
    params.longitude = longitude;
  } else {
    console.warn('useCalendarWithLocation: Location data not available, API call may fail');
  }
  
  const { 
    data, 
    isLoading: calendarLoading, 
    error: calendarError,
    refetch
  } = useCalendarData(params);
  
  console.log('useCalendarWithLocation: Calendar data status:', { 
    hasData: !!data, 
    calendarLoading, 
    hasError: !!calendarError,
    errorMessage: calendarError?.message
  });
  
  return {
    data: data?.[0], // API returns an array with a single item
    isLoading: locationLoading || calendarLoading,
    error: locationError || calendarError,
    refetch,
  };
};

// Format prayer time to readable string (e.g., "5:45 AM")
export const formatPrayerTime = (time?: { hour: number; minute: number }): string => {
  if (!time) return '';
  
  let hour = time.hour;
  const minute = time.minute;
  const period = hour >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  if (hour > 12) hour -= 12;
  if (hour === 0) hour = 12;
  
  // Format minutes with leading zero if needed
  const formattedMinute = minute < 10 ? `0${minute}` : minute;
  
  return `${hour}:${formattedMinute} ${period}`;
};
