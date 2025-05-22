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
  const [nextPrayer, setNextPrayer] = useState<PrayerType>('fajr');
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
    nextPrayer,
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
