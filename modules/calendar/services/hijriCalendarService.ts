import { API_ENDPOINTS } from '@/api/config/apiConfig';
import { aladhanClient } from '@/api/clients/globalClient';

// Types for Hijri Calendar API responses
export interface HijriDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
    ar: string;
  };
  month: {
    number: number;
    en: string;
    ar: string;
    days: number;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
  holidays: string[];
  adjustedHolidays?: string[];
  method?: string;
}

export interface GregorianDate {
  date: string;
  format: string;
  day: string;
  weekday: {
    en: string;
  };
  month: {
    number: number;
    en: string;
  };
  year: string;
  designation: {
    abbreviated: string;
    expanded: string;
  };
  lunarSighting?: boolean;
}

export interface DateConversionResponse {
  code: number;
  status: string;
  data: {
    hijri: HijriDate;
    gregorian: GregorianDate;
  };
}

export interface CalendarResponse {
  code: number;
  status: string;
  data: Array<{
    hijri: HijriDate;
    gregorian: GregorianDate;
  }>;
}

export interface HijriHolidayResponse {
  code: number;
  status: string;
  data: string[];
}

export interface IslamicMonthsResponse {
  code: number;
  status: string;
  data: {
    [key: string]: {
      number: number;
      en: string;
      ar: string;
    };
  };
}

export interface SpecialDaysResponse {
  code: number;
  status: string;
  data: Array<{
    month: number;
    day: number;
    name: string;
  }>;
}

export interface CurrentIslamicYearResponse {
  code: number;
  status: string;
  data: number;
}

export interface CalendarMethod {
  id: string;
  name: string;
}

/**
 * Convert a Gregorian date to Hijri date
 * @param date Gregorian date in DD-MM-YYYY format
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const convertGregorianToHijri = async (
  date: string,
  method: string = 'HJCoSA'
): Promise<DateConversionResponse> => {
  try {
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.GREGORIAN_TO_HIJRI}/${date}`,
      {
        params: {
          calendarMethod: method,
        },
      }
    );
    
    console.log('Gregorian to Hijri conversion response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error converting Gregorian to Hijri date:', error);
    throw error;
  }
};

/**
 * Convert a Hijri date to Gregorian date
 * @param date Hijri date in DD-MM-YYYY format
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const convertHijriToGregorian = async (
  date: string,
  method: string = 'HJCoSA'
): Promise<DateConversionResponse> => {
  try {
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.HIJRI_TO_GREGORIAN}/${date}`,
      {
        params: {
          calendarMethod: method,
        },
      }
    );
    
    console.log('Hijri to Gregorian conversion response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error converting Hijri to Gregorian date:', error);
    throw error;
  }
};

/**
 * Get Hijri calendar for a Gregorian month
 * @param month Gregorian month (1-12)
 * @param year Gregorian year
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const getHijriCalendar = async (
  month: number,
  year: number,
  method: string = 'HJCoSA'
): Promise<CalendarResponse> => {
  try {
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.HIJRI_CALENDAR}/${month}/${year}`,
      {
        params: {
          calendarMethod: method,
        },
      }
    );
    
    console.log('Hijri calendar response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Hijri calendar:', error);
    throw error;
  }
};

/**
 * Get Gregorian calendar for a Hijri month
 * @param month Hijri month (1-12)
 * @param year Hijri year
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const getGregorianCalendar = async (
  month: number,
  year: number,
  method: string = 'HJCoSA'
): Promise<CalendarResponse> => {
  try {
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.GREGORIAN_CALENDAR}/${month}/${year}`,
      {
        params: {
          calendarMethod: method,
        },
      }
    );
    
    console.log('Gregorian calendar response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Gregorian calendar:', error);
    throw error;
  }
};

/**
 * Get the next Hijri holiday
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const getNextHijriHoliday = async (
  method: string = 'HJCoSA'
): Promise<DateConversionResponse> => {
  try {
    const response = await aladhanClient.get(
      API_ENDPOINTS.NEXT_HIJRI_HOLIDAY,
      {
        params: {
          calendarMethod: method,
        },
      }
    );
    
    console.log('Next Hijri holiday response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching next Hijri holiday:', error);
    throw error;
  }
};

/**
 * Get the current Islamic year
 */
export const getCurrentIslamicYear = async (): Promise<CurrentIslamicYearResponse> => {
  try {
    const response = await aladhanClient.get(API_ENDPOINTS.CURRENT_ISLAMIC_YEAR);
    console.log('Current Islamic year response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current Islamic year:', error);
    throw error;
  }
};

/**
 * Get the current Islamic month
 */
export const getCurrentIslamicMonth = async (): Promise<CurrentIslamicYearResponse> => {
  try {
    const response = await aladhanClient.get(API_ENDPOINTS.CURRENT_ISLAMIC_MONTH);
    console.log('Current Islamic month response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching current Islamic month:', error);
    throw error;
  }
};

/**
 * Get Islamic year from Gregorian year
 * @param year Gregorian year
 */
export const getIslamicYearFromGregorian = async (
  year: number
): Promise<CurrentIslamicYearResponse> => {
  try {
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.ISLAMIC_YEAR_FROM_GREGORIAN}/${year}`
    );
    console.log('Islamic year from Gregorian response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Islamic year from Gregorian:', error);
    throw error;
  }
};

/**
 * Get holiday for a specific Hijri day
 * @param day Day of the month
 * @param month Month (1-12)
 */
export const getHijriHoliday = async (
  day: number,
  month: number
): Promise<HijriHolidayResponse> => {
  try {
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.HIJRI_HOLIDAYS}/${day}/${month}`
    );
    console.log('Hijri holiday response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Hijri holiday:', error);
    throw error;
  }
};

/**
 * Get list of special days in the Hijri calendar
 */
export const getSpecialDays = async (): Promise<SpecialDaysResponse> => {
  try {
    const response = await aladhanClient.get(API_ENDPOINTS.SPECIAL_DAYS);
    console.log('Special days response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching special days:', error);
    throw error;
  }
};

/**
 * Get list of Islamic months
 */
export const getIslamicMonths = async (): Promise<IslamicMonthsResponse> => {
  try {
    const response = await aladhanClient.get(API_ENDPOINTS.ISLAMIC_MONTHS);
    console.log('Islamic months response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Islamic months:', error);
    throw error;
  }
};

/**
 * Get Hijri holidays by year
 * @param year Hijri year
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const getHijriHolidaysByYear = async (
  year: number,
  method: string = 'HJCoSA'
): Promise<CalendarResponse> => {
  try {
    const response = await aladhanClient.get(
      `${API_ENDPOINTS.HIJRI_HOLIDAYS_BY_YEAR}/${year}`,
      {
        params: {
          calendarMethod: method,
        },
      }
    );
    console.log('Hijri holidays by year response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching Hijri holidays by year:', error);
    throw error;
  }
};
