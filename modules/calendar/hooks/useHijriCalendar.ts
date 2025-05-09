import { useQuery } from '@tanstack/react-query';
import {
  convertGregorianToHijri,
  convertHijriToGregorian,
  getHijriCalendar,
  getGregorianCalendar,
  getNextHijriHoliday,
  getCurrentIslamicYear,
  getCurrentIslamicMonth,
  getIslamicYearFromGregorian,
  getHijriHoliday,
  getSpecialDays,
  getIslamicMonths,
  getHijriHolidaysByYear,
  DateConversionResponse,
  CalendarResponse,
  HijriHolidayResponse,
  IslamicMonthsResponse,
  SpecialDaysResponse,
  CurrentIslamicYearResponse
} from '../services/hijriCalendarService';
import { formatDate } from '../utils/dateUtils';

/**
 * Hook to convert a Gregorian date to Hijri date
 * @param date Gregorian date (Date object)
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const useGregorianToHijri = (date: Date, method: string = 'HJCoSA') => {
  const formattedDate = formatDate(date);
  
  return useQuery<DateConversionResponse, Error>({
    queryKey: ['gregorianToHijri', formattedDate, method],
    queryFn: () => convertGregorianToHijri(formattedDate, method),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to convert a Hijri date to Gregorian date
 * @param date Hijri date in DD-MM-YYYY format
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const useHijriToGregorian = (date: string, method: string = 'HJCoSA') => {
  return useQuery<DateConversionResponse, Error>({
    queryKey: ['hijriToGregorian', date, method],
    queryFn: () => convertHijriToGregorian(date, method),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to get Hijri calendar for a Gregorian month
 * @param month Gregorian month (1-12)
 * @param year Gregorian year
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const useHijriCalendar = (month: number, year: number, method: string = 'HJCoSA') => {
  return useQuery<CalendarResponse, Error>({
    queryKey: ['hijriCalendar', month, year, method],
    queryFn: () => getHijriCalendar(month, year, method),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to get Gregorian calendar for a Hijri month
 * @param month Hijri month (1-12)
 * @param year Hijri year
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const useGregorianCalendar = (month: number, year: number, method: string = 'HJCoSA') => {
  return useQuery<CalendarResponse, Error>({
    queryKey: ['gregorianCalendar', month, year, method],
    queryFn: () => getGregorianCalendar(month, year, method),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to get the next Hijri holiday
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const useNextHijriHoliday = (method: string = 'HJCoSA') => {
  return useQuery<DateConversionResponse, Error>({
    queryKey: ['nextHijriHoliday', method],
    queryFn: () => getNextHijriHoliday(method),
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

/**
 * Hook to get the current Islamic year
 */
export const useCurrentIslamicYear = () => {
  return useQuery<CurrentIslamicYearResponse, Error>({
    queryKey: ['currentIslamicYear'],
    queryFn: getCurrentIslamicYear,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to get the current Islamic month
 */
export const useCurrentIslamicMonth = () => {
  return useQuery<CurrentIslamicYearResponse, Error>({
    queryKey: ['currentIslamicMonth'],
    queryFn: getCurrentIslamicMonth,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to get Islamic year from Gregorian year
 * @param year Gregorian year
 */
export const useIslamicYearFromGregorian = (year: number) => {
  return useQuery<CurrentIslamicYearResponse, Error>({
    queryKey: ['islamicYearFromGregorian', year],
    queryFn: () => getIslamicYearFromGregorian(year),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to get holiday for a specific Hijri day
 * @param day Day of the month
 * @param month Month (1-12)
 */
export const useHijriHoliday = (day: number, month: number) => {
  return useQuery<HijriHolidayResponse, Error>({
    queryKey: ['hijriHoliday', day, month],
    queryFn: () => getHijriHoliday(day, month),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to get list of special days in the Hijri calendar
 */
export const useSpecialDays = () => {
  return useQuery<SpecialDaysResponse, Error>({
    queryKey: ['specialDays'],
    queryFn: getSpecialDays,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};

/**
 * Hook to get list of Islamic months
 */
export const useIslamicMonths = () => {
  return useQuery<IslamicMonthsResponse, Error>({
    queryKey: ['islamicMonths'],
    queryFn: getIslamicMonths,
    staleTime: 1000 * 60 * 60 * 24 * 30, // 30 days
    gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days
  });
};

/**
 * Hook to get Hijri holidays by year
 * @param year Hijri year
 * @param method Calendar calculation method (default: HJCoSA)
 */
export const useHijriHolidaysByYear = (year: number, method: string = 'HJCoSA') => {
  return useQuery<CalendarResponse, Error>({
    queryKey: ['hijriHolidaysByYear', year, method],
    queryFn: () => getHijriHolidaysByYear(year, method),
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
    gcTime: 1000 * 60 * 60 * 24 * 7, // 7 days
  });
};
