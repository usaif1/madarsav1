// modules/home/hooks/usePrayerTimes.ts
import { useState, useEffect } from 'react';
import { useCalendarPrayerTimes, formatPrayerTime } from '@/modules/calendar/hooks/useCalendarPrayerTimes';
import { PrayerTiming } from '@/api/services/prayerTimesService';

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
  const { data, isLoading, error } = useCalendarPrayerTimes(today);
  const [currentPrayer, setCurrentPrayer] = useState<PrayerType>('fajr');
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [dayName, setDayName] = useState<string>('');
  const [prayerTimes, setPrayerTimes] = useState<Record<string, PrayerTimeData>>({});
  
  // Update time left every second
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
    
    // Determine current prayer
    let nextPrayer: PrayerType = 'fajr';
    let nextPrayerTime = prayerTimesInMinutes.fajr;
    
    if (currentTimeInMinutes < prayerTimesInMinutes.fajr) {
      nextPrayer = 'fajr';
      nextPrayerTime = prayerTimesInMinutes.fajr;
      setCurrentPrayer('isha'); // Before Fajr, the current prayer is Isha from yesterday
    } else if (currentTimeInMinutes < prayerTimesInMinutes.dhuhr) {
      nextPrayer = 'dhuhr';
      nextPrayerTime = prayerTimesInMinutes.dhuhr;
      setCurrentPrayer('fajr');
    } else if (currentTimeInMinutes < prayerTimesInMinutes.asr) {
      nextPrayer = 'asr';
      nextPrayerTime = prayerTimesInMinutes.asr;
      setCurrentPrayer('dhuhr');
    } else if (currentTimeInMinutes < prayerTimesInMinutes.maghrib) {
      nextPrayer = 'maghrib';
      nextPrayerTime = prayerTimesInMinutes.maghrib;
      setCurrentPrayer('asr');
    } else if (currentTimeInMinutes < prayerTimesInMinutes.isha) {
      nextPrayer = 'isha';
      nextPrayerTime = prayerTimesInMinutes.isha;
      setCurrentPrayer('maghrib');
    } else {
      // After Isha, the next prayer is Fajr of tomorrow
      nextPrayer = 'fajr';
      nextPrayerTime = prayerTimesInMinutes.fajr + 24 * 60; // Add 24 hours
      setCurrentPrayer('isha');
    }
    
    // Calculate time left
    const timeLeftInMinutes = nextPrayerTime - currentTimeInMinutes;
    
    // Update time left every second
    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();
      const currentTimeInMinutes = currentHour * 60 + currentMinute + currentSecond / 60;
      
      const timeLeftInMinutes = nextPrayerTime - currentTimeInMinutes;
      const hours = Math.floor(timeLeftInMinutes / 60);
      const minutes = Math.floor(timeLeftInMinutes % 60);
      const seconds = Math.floor((timeLeftInMinutes * 60) % 60);
      
      setTimeLeft(`${hours}h ${minutes}m ${seconds}s left`);
    }, 1000);
    
    // Clean up interval
    return () => clearInterval(interval);
  }, [data]);
  
  return {
    prayerTimes,
    currentPrayer,
    timeLeft,
    dayName,
    isLoading,
    error
  };
};

// Helper function to convert time string (HH:MM) to minutes since midnight
const convertTimeToMinutes = (timeString: string): number => {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};
