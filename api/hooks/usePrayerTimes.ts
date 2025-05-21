import { useQuery } from '@tanstack/react-query';
import { 
  fetchPrayerTimes, 
  fetchNextPrayer, 
  fetchPrayerMethods,
  PrayerTimesResponse,
  NextPrayerResponse,
  PrayerMethodsResponse
} from '../services/prayerTimesService';

// Query keys for React Query
export const PRAYER_QUERY_KEYS = {
  PRAYER_TIMES: 'prayerTimes',
  NEXT_PRAYER: 'nextPrayer',
  PRAYER_METHODS: 'prayerMethods',
};

/**
 * Hook to fetch prayer times for a specific date and location
 * @param latitude Latitude coordinates of user's location
 * @param longitude Longitude coordinates of user's location
 * @param date Optional date in DD-MM-YYYY format (defaults to today)
 * @param method Optional prayer calculation method (defaults to 3 - Muslim World League)
 * @param timezonestring Optional timezone (if not provided, calculated from coordinates)
 */
export const usePrayerTimes = (
  latitude?: number,
  longitude?: number,
  date?: string,
  method: number = 3,
  timezonestring?: string
) => {
  return useQuery<PrayerTimesResponse, Error>({
    queryKey: [PRAYER_QUERY_KEYS.PRAYER_TIMES, latitude, longitude, date, method, timezonestring],
    queryFn: () => {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required to fetch prayer times');
      }
      return fetchPrayerTimes(latitude, longitude, date, method, timezonestring);
    },
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours (formerly cacheTime)
  });
};

/**
 * Hook to fetch the next prayer time for a specific date and location
 * @param latitude Latitude coordinates of user's location
 * @param longitude Longitude coordinates of user's location
 * @param date Optional date in DD-MM-YYYY format (defaults to today)
 * @param method Optional prayer calculation method (defaults to 3 - Muslim World League)
 * @param timezonestring Optional timezone (if not provided, calculated from coordinates)
 */
export const useNextPrayer = (
  latitude?: number,
  longitude?: number,
  date?: string,
  method: number = 3,
  timezonestring?: string
) => {
  return useQuery<NextPrayerResponse, Error>({
    queryKey: [PRAYER_QUERY_KEYS.NEXT_PRAYER, latitude, longitude, date, method, timezonestring],
    queryFn: () => {
      if (!latitude || !longitude) {
        throw new Error('Latitude and longitude are required to fetch next prayer time');
      }
      return fetchNextPrayer(latitude, longitude, date, method, timezonestring);
    },
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 60, // 1 hour (formerly cacheTime)
    refetchInterval: 1000 * 60, // Refetch every minute to keep the next prayer updated
  });
};

/**
 * Hook to fetch all available prayer calculation methods
 */
export const usePrayerMethods = () => {
  return useQuery<PrayerMethodsResponse, Error>({
    queryKey: [PRAYER_QUERY_KEYS.PRAYER_METHODS],
    queryFn: fetchPrayerMethods,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days (formerly cacheTime)
  });
};

/**
 * Utility function to format prayer time and calculate time remaining
 * @param prayerTime Prayer time in HH:MM format
 * @returns Formatted prayer time and time remaining
 */
export const formatPrayerTime = (prayerTime: string) => {
  if (!prayerTime) return { formattedTime: '', timeRemaining: '' };
  
  // Parse the prayer time (HH:MM format)
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  // Create date objects for the prayer time and current time
  const now = new Date();
  const prayerDate = new Date();
  prayerDate.setHours(hours, minutes, 0, 0);
  
  // If prayer time is earlier than current time, set it to tomorrow
  if (prayerDate < now) {
    prayerDate.setDate(prayerDate.getDate() + 1);
  }
  
  // Calculate time difference in milliseconds
  const diffMs = prayerDate.getTime() - now.getTime();
  
  // Convert to hours, minutes
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  // Format the prayer time (12-hour format with AM/PM)
  const formattedTime = prayerDate.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  
  // Format the time remaining
  let timeRemaining = '';
  if (diffHours > 0) {
    timeRemaining = `${diffHours}h ${diffMinutes}m`;
  } else {
    timeRemaining = `${diffMinutes}m`;
  }
  
  return { formattedTime, timeRemaining };
};

/**
 * Get the name of the next prayer based on the API response
 * @param timings The prayer timings object from the API response
 * @returns The name of the next prayer
 */
export const getNextPrayerName = (timings: Partial<Record<string, string>>) => {
  if (!timings) return '';
  
  // The API returns only one timing in the nextPrayer endpoint
  const prayerName = Object.keys(timings)[0];
  
  // Map API prayer names to user-friendly names
  const prayerNameMap: Record<string, string> = {
    Fajr: 'Fajr',
    Sunrise: 'Sunrise',
    Dhuhr: 'Dhuhr',
    Asr: 'Asr',
    Sunset: 'Sunset',
    Maghrib: 'Maghrib',
    Isha: 'Isha',
  };
  
  return prayerNameMap[prayerName] || prayerName;
};
