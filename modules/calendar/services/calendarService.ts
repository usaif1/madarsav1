import apiClients from '../../../api/clients/globalClient';
import { API_ENDPOINTS, API_URLS } from '../../../api/config/apiConfig';

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
    // Get current date parameters if the requested date is in the future
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-based month
    const currentDay = currentDate.getDate();
    
    // Extract parameters from the request
    let { year, month, day, method, latitude, longitude } = params;
    
    // Check if the requested date is in the future and adjust to current date
    // The API might not support future dates
    const isRequestedDateInFuture = 
      year > currentYear || 
      (year === currentYear && month !== undefined && month > currentMonth) ||
      (year === currentYear && month === currentMonth && day !== undefined && day > currentDay);
    
    if (isRequestedDateInFuture) {
      console.warn('Calendar API: Requested date is in the future, using current date instead');
      year = currentYear;
      month = currentMonth;
      day = currentDay;
    }
    
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
    console.log('Calendar API Full URL:', `${API_URLS.ISLAMIC_DEVELOPERS}${API_ENDPOINTS.ISLAMIC_CALENDAR}`);
    
    // Log the exact curl command that would make this request
    let curlCommand = `curl -G "${API_URLS.ISLAMIC_DEVELOPERS}${API_ENDPOINTS.ISLAMIC_CALENDAR}"`;
    Object.entries(queryParams).forEach(([key, value]) => {
      curlCommand += ` \
  -d ${key}=${value}`;
    });
    console.log('Calendar API Equivalent curl command:\n', curlCommand);
    
    // Format parameters with proper data types
    // The API might be strict about parameter types
    const formattedParams: Record<string, string> = {};
    
    // Ensure all parameters are properly formatted as strings
    formattedParams['calendar'] = 'gregorian';
    formattedParams['year'] = String(year);
    if (month !== undefined) formattedParams['month'] = String(month);
    if (day !== undefined) formattedParams['day'] = String(day);
    if (method) formattedParams['method'] = String(method);
    
    // Format latitude and longitude with fixed precision (6 decimal places)
    if (latitude !== undefined) formattedParams['latitude'] = latitude.toFixed(6);
    if (longitude !== undefined) formattedParams['longitude'] = longitude.toFixed(6);
    
    console.log('Calendar API Formatted Params:', formattedParams);
    
    // Build query string manually to ensure proper formatting
    const queryString = Object.entries(formattedParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');
    
    const url = `${API_ENDPOINTS.ISLAMIC_CALENDAR}?${queryString}`;
    console.log('Calendar API Request URL with formatted params:', url);
    
    const response = await apiClients.ISLAMIC_DEVELOPERS.get(url);
    
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
    
    // If we get a 400 error, try to fall back to the current date
    if (error.response?.status === 400) {
      try {
        console.log('Calendar API: Attempting fallback to current date due to 400 error');
        const currentDate = new Date();
        const fallbackParams = {
          calendar: 'gregorian',
          year: currentDate.getFullYear(),
          month: currentDate.getMonth() + 1,
          day: currentDate.getDate(),
          method: params.method,
          latitude: params.latitude,
          longitude: params.longitude
        };
        
        console.log('Calendar API Fallback Request Params:', JSON.stringify(fallbackParams, null, 2));
        
        // Format fallback parameters with proper data types
        const formattedFallbackParams: Record<string, string> = {};
        
        // Ensure all parameters are properly formatted as strings
        formattedFallbackParams['calendar'] = 'gregorian';
        formattedFallbackParams['year'] = String(fallbackParams.year);
        formattedFallbackParams['month'] = String(fallbackParams.month);
        formattedFallbackParams['day'] = String(fallbackParams.day);
        if (fallbackParams.method) formattedFallbackParams['method'] = String(fallbackParams.method);
        
        // Format latitude and longitude with fixed precision (6 decimal places)
        if (fallbackParams.latitude !== undefined) {
          formattedFallbackParams['latitude'] = fallbackParams.latitude.toFixed(6);
        }
        if (fallbackParams.longitude !== undefined) {
          formattedFallbackParams['longitude'] = fallbackParams.longitude.toFixed(6);
        }
        
        console.log('Calendar API Fallback Formatted Params:', formattedFallbackParams);
        
        // Build query string manually to ensure proper formatting
        const fallbackQueryString = Object.entries(formattedFallbackParams)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join('&');
        
        const fallbackUrl = `${API_ENDPOINTS.ISLAMIC_CALENDAR}?${fallbackQueryString}`;
        console.log('Calendar API Fallback Request URL with formatted params:', fallbackUrl);
        
        const fallbackResponse = await apiClients.ISLAMIC_DEVELOPERS.get(fallbackUrl);
        
        console.log('Calendar API Fallback Response Status:', fallbackResponse.status);
        return fallbackResponse.data;
      } catch (fallbackError) {
        console.error('Calendar API: Fallback request also failed:', fallbackError);
        throw error; // Throw the original error
      }
    }
    
    throw error;
  }
};
