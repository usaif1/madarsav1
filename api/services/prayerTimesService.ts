import axios from 'axios';
import { API_URLS, API_ENDPOINTS } from '../config/apiConfig';
import { aladhanClient } from '../clients/globalClient';

/**
 * Format a date to DD-MM-YYYY format
 * @param date Date to format
 * @returns Formatted date string
 */
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

// Types for Prayer Times API responses
export interface PrayerTiming {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface PrayerDate {
  readable: string;
  timestamp: string;
  gregorian: {
    date: string;
    format: string;
    day: string;
    weekday: { en: string };
    month: { number: number; en: string };
    year: string;
    designation: { abbreviated: string; expanded: string };
  };
  hijri: {
    date: string;
    format: string;
    day: string;
    weekday: { en: string; ar: string };
    month: { number: number; en: string; ar: string; days: number };
    year: string;
    designation: { abbreviated: string; expanded: string };
    holidays: string[];
  };
}

export interface PrayerTimesResponse {
  code: number;
  status: string;
  data: {
    timings: PrayerTiming;
    date: PrayerDate;
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: { Fajr: number; Isha: number };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: Record<string, number>;
    };
  };
}

export interface NextPrayerResponse {
  code: number;
  status: string;
  data: {
    timings: Partial<PrayerTiming>;
    date: PrayerDate;
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: string;
        params: { Fajr: number; Isha: number };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: Record<string, number>;
    };
  };
}

export interface PrayerMethod {
  id: number;
  name: string;
  params: Record<string, any>;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export interface PrayerMethodsResponse {
  code: number;
  status: string;
  data: Record<string, PrayerMethod>;
}

/**
 * Fetches prayer times for a specific date and location
 * @param latitude Latitude coordinates of user's location
 * @param longitude Longitude coordinates of user's location
 * @param date Optional date in DD-MM-YYYY format (defaults to today)
 * @param method Optional prayer calculation method (defaults to 3 - Muslim World League)
 * @param timezonestring Optional timezone (if not provided, calculated from coordinates)
 */
export const fetchPrayerTimes = async (
  latitude: number,
  longitude: number,
  date?: string,
  method: number = 3,
  timezonestring?: string
): Promise<PrayerTimesResponse> => {
  try {
    // Format date as DD-MM-YYYY if not provided
    const formattedDate = date || formatDate(new Date());
    
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.PRAYER_TIMES}/${formattedDate}`,
      {
        params: {
          latitude,
          longitude,
          method,
          ...(timezonestring && { timezonestring }),
        },
      }
    );
    
    console.log('Prayer Times API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
};

/**
 * Fetches the next prayer time for a specific date and location
 * @param latitude Latitude coordinates of user's location
 * @param longitude Longitude coordinates of user's location
 * @param date Optional date in DD-MM-YYYY format (defaults to today)
 * @param method Optional prayer calculation method (defaults to 3 - Muslim World League)
 * @param timezonestring Optional timezone (if not provided, calculated from coordinates)
 */
export const fetchNextPrayer = async (
  latitude: number,
  longitude: number,
  date?: string,
  method: number = 3,
  timezonestring?: string
): Promise<NextPrayerResponse> => {
  try {
    // Format date as DD-MM-YYYY if not provided
    const formattedDate = date || formatDate(new Date());
    
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.NEXT_PRAYER}/${formattedDate}`,
      {
        params: {
          latitude,
          longitude,
          method,
          ...(timezonestring && { timezonestring }),
        },
      }
    );
    
    console.log('Next Prayer API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching next prayer:', error);
    throw error;
  }
};

/**
 * Fetches all available prayer calculation methods
 */
export const fetchPrayerMethods = async (): Promise<PrayerMethodsResponse> => {
  try {
    const response = await aladhanClient.get(API_ENDPOINTS.PRAYER_METHODS);
    console.log('Prayer Methods API Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching prayer methods:', error);
    throw error;
  }
};
