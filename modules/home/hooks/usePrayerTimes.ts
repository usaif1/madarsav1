// modules/home/hooks/usePrayerTimes.ts
import { useState, useEffect, useRef } from 'react';
import { useCalendarPrayerTimes, formatPrayerTime } from '@/modules/calendar/hooks/useCalendarPrayerTimes';
import { PrayerTiming } from '@/api/services/prayerTimesService';
import { useLocationData } from '@/modules/location/hooks/useLocationData';

// Prayer time types
export type PrayerType = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

// Prayer time data structure
export interface PrayerTimeData {
  id: string;
  name: string;
  time: string;
  timeRaw: string;
}

export const usePrayerTimes = () => {
  const today = new Date();
  
  // Get location data with fallback support
  const { 
    latitude, 
    longitude, 
    loading: locationLoading, 
    error: locationError,
    usingFallback,
    fallbackSource,
    refreshLocation: refreshLocationData
  } = useLocationData();
  
  // Get prayer times data
  const { 
    data, 
    isLoading: prayerTimesLoading, 
    error: prayerTimesError,
    refetch
  } = useCalendarPrayerTimes(today);
  
  const [currentPrayer, setCurrentPrayer] = useState<PrayerType>('fajr');
  const [nextPrayer, setNextPrayer] = useState<PrayerType>('fajr');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [dayName, setDayName] = useState<string>('');
  const [prayerTimes, setPrayerTimes] = useState<Record<string, PrayerTimeData>>({});
  
  // Track current date to detect date changes
  const currentDateRef = useRef<string>(new Date().toDateString());
  
  // Combine loading and error states
  const isLoading = locationLoading || prayerTimesLoading;
  const error = locationError || prayerTimesError;
  
  // Check for date changes and auto-refresh
  useEffect(() => {
    const checkDateChange = () => {
      const newDate = new Date().toDateString();
      const currentDate = currentDateRef.current;
      
      if (newDate !== currentDate) {
        console.log('📅 Date changed in usePrayerTimes, refreshing...', { oldDate: currentDate, newDate });
        currentDateRef.current = newDate;
        
        // Refresh prayer times for the new date
        if (latitude && longitude) {
          console.log('🔄 Auto-refreshing prayer times for new date...');
          refetch();
        }
      }
    };
    
    // Check for date change every minute
    const dateCheckInterval = setInterval(checkDateChange, 60000);
    
    return () => clearInterval(dateCheckInterval);
  }, [latitude, longitude, refetch]);
  
  // Update prayer times when location or data changes
  useEffect(() => {
    console.log('🌍 Location changed in usePrayerTimes:', { latitude, longitude, usingFallback, fallbackSource });
    
    // If we have coordinates (either from GPS or IP), refetch prayer times
    if (latitude && longitude) {
      console.log('🔄 Refetching prayer times with coordinates:', { latitude, longitude });
      refetch();
    } else {
      console.log('⚠️ No coordinates available for prayer times');
    }
  }, [latitude, longitude, usingFallback, fallbackSource, refetch]);

  // Process prayer times data and update time left
  useEffect(() => {
    if (!data || !data.data || !data.data.timings) return;
    
    // Set day name
    const weekday = data.data.date.gregorian.weekday.en;
    setDayName(weekday);
    
    // Process prayer times
    const timings = data.data.timings;
    const processedTimes: Record<string, PrayerTimeData> = {
      fajr: { 
        id: 'fajr', 
        name: 'Fajr', 
        time: formatPrayerTime(timings.Fajr),
        timeRaw: timings.Fajr
      },
      dhuhr: { 
        id: 'dhuhr', 
        name: 'Dhuhr', 
        time: formatPrayerTime(timings.Dhuhr),
        timeRaw: timings.Dhuhr
      },
      asr: { 
        id: 'asr', 
        name: 'Asr', 
        time: formatPrayerTime(timings.Asr),
        timeRaw: timings.Asr
      },
      maghrib: { 
        id: 'maghrib', 
        name: 'Maghrib', 
        time: formatPrayerTime(timings.Maghrib),
        timeRaw: timings.Maghrib
      },
      isha: { 
        id: 'isha', 
        name: 'Isha', 
        time: formatPrayerTime(timings.Isha),
        timeRaw: timings.Isha
      }
    };
    
    setPrayerTimes(processedTimes);
    
    // Determine current prayer and next prayer
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;
    
    // Convert prayer times to minutes since midnight for comparison
    const prayerTimesInMinutes: Record<PrayerType, number> = {
      fajr: convertTimeToMinutes(timings.Fajr),
      dhuhr: convertTimeToMinutes(timings.Dhuhr),
      asr: convertTimeToMinutes(timings.Asr),
      maghrib: convertTimeToMinutes(timings.Maghrib),
      isha: convertTimeToMinutes(timings.Isha)
    };
    
    // Determine current prayer and next prayer, and calculate next prayer time
    let nextPrayerTime = 0;
    
    if (currentTimeInMinutes < prayerTimesInMinutes.fajr) {
      setCurrentPrayer('isha'); // Before Fajr, the current prayer is Isha from yesterday
      setNextPrayer('fajr');
      nextPrayerTime = prayerTimesInMinutes.fajr;
    } else if (currentTimeInMinutes < prayerTimesInMinutes.dhuhr) {
      setCurrentPrayer('fajr');
      setNextPrayer('dhuhr');
      nextPrayerTime = prayerTimesInMinutes.dhuhr;
    } else if (currentTimeInMinutes < prayerTimesInMinutes.asr) {
      setCurrentPrayer('dhuhr');
      setNextPrayer('asr');
      nextPrayerTime = prayerTimesInMinutes.asr;
    } else if (currentTimeInMinutes < prayerTimesInMinutes.maghrib) {
      setCurrentPrayer('asr');
      setNextPrayer('maghrib');
      nextPrayerTime = prayerTimesInMinutes.maghrib;
    } else if (currentTimeInMinutes < prayerTimesInMinutes.isha) {
      setCurrentPrayer('maghrib');
      setNextPrayer('isha');
      nextPrayerTime = prayerTimesInMinutes.isha;
    } else {
      // After Isha, the next prayer is Fajr of tomorrow
      setCurrentPrayer('isha');
      setNextPrayer('fajr');
      nextPrayerTime = prayerTimesInMinutes.fajr + 24 * 60; // Add 24 hours for tomorrow's Fajr
    }
    
    // Update time left every second
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const currentTimeInMinutes = currentHour * 60 + currentMinute + currentSecond / 60;
      
      let timeLeftInMinutes = nextPrayerTime - currentTimeInMinutes;
      
      // Handle edge case: if time left is negative, it means we're crossing midnight
      // This can happen when the next prayer is Fajr of the next day
      if (timeLeftInMinutes < 0 && nextPrayer === 'fajr') {
        // Add 24 hours (1440 minutes) to get correct time until tomorrow's Fajr
        timeLeftInMinutes += 24 * 60;
      }
      
      // Ensure we never show negative time
      timeLeftInMinutes = Math.max(0, timeLeftInMinutes);
      
      const hours = Math.floor(timeLeftInMinutes / 60);
      const minutes = Math.floor(timeLeftInMinutes % 60);
      const seconds = Math.floor((timeLeftInMinutes * 60) % 60);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
    }, 1000);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [data]);
  
  // Function to refresh location and prayer times
  const refreshLocation = () => {
    refreshLocationData();
    refetch();
  };
  
  return {
    prayerTimes,
    currentPrayer,
    nextPrayer,
    timeLeft,
    dayName,
    isLoading,
    error,
    usingFallback,
    fallbackSource,
    refreshLocation
  };
};

// Helper function to convert time string (HH:MM) to minutes since midnight
const convertTimeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};
