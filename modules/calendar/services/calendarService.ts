import apiClients from '../../../api/clients/globalClient';
import { API_ENDPOINTS } from '../../../api/config/apiConfig';

export interface PrayerTime {
  hour: number;
  minute: number;
}

export interface CalendarResponse {
  calendar: {
    julianDay: number;
    unix: number;
    gregorian: {
      numeric: {
        year: number;
        month: number;
        day: number;
      };
      names: {
        month: string;
        weekday: string;
      };
      leapYear: boolean;
    };
    hijri: {
      numeric: {
        year: number;
        month: number;
        day: number;
      };
      names: {
        month: {
          arabic: {
            native: string;
            latin: string;
          };
        };
        weekday: {
          arabic: {
            native: string;
            latin: string;
          };
        };
      };
      leapYear: boolean;
    };
    indianNational: {
      numeric: {
        year: number;
        month: number;
        day: number;
      };
      names: {
        month: string;
        weekday: string;
      };
      leapYear: boolean;
    };
    julian: Record<string, any>;
    solarHijri: {
      numeric: {
        year: number;
        month: number;
        day: number;
      };
      names: {
        month: Record<string, any>;
        weekday: Record<string, any>;
      };
      leapYear: boolean;
    };
  };
  prayerTime: {
    timezone: string;
    sunrise: PrayerTime;
    sunset: PrayerTime;
    fajr: PrayerTime;
    dhuhr: PrayerTime;
    asr: PrayerTime;
    maghrib: PrayerTime;
    isha: PrayerTime;
    middleOfTheNight: PrayerTime;
    lastThirdOfTheNight: PrayerTime;
  };
}

export type PrayerMethod = 
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey';

export interface CalendarParams {
  year: number;
  month?: number;
  day?: number;
  method?: PrayerMethod;
  latitude?: number;
  longitude?: number;
}

export const fetchCalendarData = async (params: CalendarParams): Promise<CalendarResponse[]> => {
  try {
    const { year, month, day, method, latitude, longitude } = params;
    
    // Build query parameters
    const queryParams: Record<string, any> = {
      calendar: 'gregorian',
      year,
    };
    
    // Add optional parameters if provided
    if (month !== undefined) queryParams.month = month;
    if (day !== undefined) queryParams.day = day;
    if (method) queryParams.method = method;
    if (latitude !== undefined) queryParams.latitude = latitude;
    if (longitude !== undefined) queryParams.longitude = longitude;
    
    // Debug logs
    console.log('Calendar API Request URL:', API_ENDPOINTS.ISLAMIC_CALENDAR);
    console.log('Calendar API Request Params:', JSON.stringify(queryParams, null, 2));
    console.log('Calendar API Client:', apiClients.ISLAMIC_DEVELOPERS);
    
    const response = await apiClients.ISLAMIC_DEVELOPERS.get(API_ENDPOINTS.ISLAMIC_CALENDAR, {
      params: queryParams,
    });
    
    console.log('Calendar API Response Status:', response.status);
    console.log('Calendar API Response Data (sample):', JSON.stringify(response.data?.[0], null, 2));
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching calendar data:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
      params: error.config?.params,
    });
    throw error;
  }
};
