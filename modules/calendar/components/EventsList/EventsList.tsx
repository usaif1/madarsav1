// modules/calendar/components/EventsList/EventsList.tsx
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Body1Title2Bold, Body2Medium, Title3Bold } from '@/components';
import { useThemeStore } from '@/globalStore';
import { DotIcon } from '@/assets/calendar';
import { scale, verticalScale } from '@/theme/responsive';

// Import Hijri Calendar API hooks
import { useNextHijriHoliday, useSpecialDays, useHijriHolidaysByYear, useCurrentIslamicYear } from '../../hooks/useHijriCalendar';
import { formatDate } from '../../utils/dateUtils';

interface IslamicEvent {
  id: string;
  date: string;
  title: string;
  islamicDate: string;
  daysLeft?: number | string;
  isToday?: boolean;
}

interface EventsListProps {
  selectedDate: Date;
}

const EventsList: React.FC<EventsListProps> = ({ selectedDate }) => {
  const { colors } = useThemeStore();
  
  // Get current Islamic year
  const { data: currentIslamicYearData, isLoading: isYearLoading } = useCurrentIslamicYear();
  
  // Get next Hijri holiday
  const { data: nextHolidayData, isLoading: isNextHolidayLoading } = useNextHijriHoliday();
  
  // Get special days
  const { data: specialDaysData, isLoading: isSpecialDaysLoading } = useSpecialDays();
  
  // Get current Islamic year for holidays
  const currentYear = currentIslamicYearData?.data?.hijri?.year 
    ? parseInt(currentIslamicYearData.data.hijri.year) 
    : new Date().getFullYear();
  
  // Get Hijri holidays for the current year
  const { data: holidaysData, isLoading: isHolidaysLoading } = useHijriHolidaysByYear(currentYear);
  
  // Log API responses for debugging
  useEffect(() => {
    console.log('Current Islamic Year API response:', currentIslamicYearData);
    console.log('Next Hijri Holiday API response:', nextHolidayData);
    console.log('Special Days API response:', specialDaysData);
    console.log('Hijri Holidays API response:', holidaysData);
  }, [currentIslamicYearData, nextHolidayData, specialDaysData, holidaysData]);
  
  // Process the events data from the API
  const events = useMemo(() => {
    const eventsArray: IslamicEvent[] = [];
    
    // Add today's date (current Hijri date)
    if (currentIslamicYearData?.data) {
      // The API response structure might be different than expected
      // Handle both possible structures
      const hijriData = typeof currentIslamicYearData.data === 'object' && 'hijri' in currentIslamicYearData.data
        ? currentIslamicYearData.data.hijri
        : null;
      const gregorianData = typeof currentIslamicYearData.data === 'object' && 'gregorian' in currentIslamicYearData.data
        ? currentIslamicYearData.data.gregorian
        : null;
      
      if (hijriData && gregorianData) {
        eventsArray.push({
          id: 'today',
          date: `${gregorianData.day} ${typeof gregorianData.month === 'object' ? gregorianData.month.en.substring(0, 3) : 'Jan'}`,
          title: `${hijriData.day} ${typeof hijriData.month === 'object' ? hijriData.month.en : 'Muharram'}`,
          islamicDate: `${typeof hijriData.month === 'object' ? hijriData.month.en : 'Muharram'}, ${hijriData.year} AH`,
          isToday: true,
          daysLeft: 0
        });
      }
    }
    
    // Add next holiday
    if (nextHolidayData?.data) {
      // Handle both possible structures
      const hijriData = typeof nextHolidayData.data === 'object' && 'hijri' in nextHolidayData.data
        ? nextHolidayData.data.hijri
        : null;
      const gregorianData = typeof nextHolidayData.data === 'object' && 'gregorian' in nextHolidayData.data
        ? nextHolidayData.data.gregorian
        : null;
      
      if (hijriData && gregorianData) {
        // Calculate days left
        const today = new Date();
        const holidayDate = new Date(
          `${gregorianData.year}-${typeof gregorianData.month === 'object' && 'number' in gregorianData.month ? gregorianData.month.number.toString().padStart(2, '0') : '01'}-${gregorianData.day.toString().padStart(2, '0')}`
        );
        const daysLeft = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only add if it's in the future
        if (daysLeft > 0 && Array.isArray(hijriData.holidays) && hijriData.holidays.length > 0) {
          eventsArray.push({
            id: 'next-holiday',
            date: `${gregorianData.day} ${typeof gregorianData.month === 'object' ? gregorianData.month.en.substring(0, 3) : 'Jan'}`,
            title: hijriData.holidays[0] || 'Islamic Holiday',
            islamicDate: `${typeof hijriData.month === 'object' ? hijriData.month.en : 'Muharram'}, ${hijriData.year} AH`,
            daysLeft: daysLeft
          });
        }
      }
    }
    
    // Add special days from the API (like Ramadan, Eid, etc.)
    if (specialDaysData?.data) {
      // The API response structure might be different than expected
      const specialDays = typeof specialDaysData.data === 'object' && 'specialDays' in specialDaysData.data
        ? specialDaysData.data.specialDays
        : Array.isArray(specialDaysData.data) ? specialDaysData.data : [];
      
      // If specialDays is an array, process each item
      if (Array.isArray(specialDays)) {
        specialDays.forEach((specialDay, index) => {
          if (!specialDay || !specialDay.name) return;
          
          // For array-based special days
          const month = specialDay.month;
          const day = specialDay.day;
          const name = specialDay.name;
          
          // Create a date for this year
          const today = new Date();
          const currentYear = today.getFullYear();
          const eventDate = new Date(currentYear, month - 1, day);
          
          // If the date has already passed this year, use next year
          if (eventDate < today) {
            eventDate.setFullYear(currentYear + 1);
          }
          
          const daysLeft = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // Only add if it's in the future and not too far away (within next 90 days)
          if (daysLeft > 0 && daysLeft <= 90) {
            eventsArray.push({
              id: `special-${index}`,
              date: `${day} ${new Date(0, month - 1).toLocaleString('en', { month: 'short' })}`,
              title: name,
              islamicDate: 'Islamic Special Day',
              daysLeft: daysLeft
            });
          }
        });
      } else if (typeof specialDays === 'object') {
        // Process each special day if it's an object
        Object.entries(specialDays).forEach(([key, specialDay]: [string, any], index) => {
          if (!specialDay || typeof specialDay !== 'object') return;
          
          const gregorianDate = 'gregorian' in specialDay ? specialDay.gregorian : null;
          const hijriDate = 'hijri' in specialDay ? specialDay.hijri : null;
          
          if (!gregorianDate || !hijriDate) return;
          
          // Calculate days left
          const today = new Date();
          const eventDate = new Date(
            `${gregorianDate.year}-${typeof gregorianDate.month === 'object' && 'number' in gregorianDate.month ? gregorianDate.month.number.toString().padStart(2, '0') : '01'}-${gregorianDate.day.toString().padStart(2, '0')}`
          );
          const daysLeft = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // Only add if it's in the future and not too far away (within next 90 days)
          if (daysLeft > 0 && daysLeft <= 90) {
            eventsArray.push({
              id: `special-${index}`,
              date: `${gregorianDate.day} ${typeof gregorianDate.month === 'object' ? gregorianDate.month.en.substring(0, 3) : 'Jan'}`,
              title: key,
              islamicDate: `${typeof hijriDate.month === 'object' ? hijriDate.month.en : 'Muharram'}, ${hijriDate.year} AH`,
              daysLeft: daysLeft
            });
          }
        });
      }
    }
    
    // Sort events by days left
    return eventsArray.sort((a, b) => {
      // Today always comes first
      if (a.isToday) return -1;
      if (b.isToday) return 1;
      
      // Then sort by days left
      const aDaysLeft = typeof a.daysLeft === 'number' ? a.daysLeft : 0;
      const bDaysLeft = typeof b.daysLeft === 'number' ? b.daysLeft : 0;
      return aDaysLeft - bDaysLeft;
    });
  }, [currentIslamicYearData, nextHolidayData, specialDaysData]);
  
  // Show loading state
  const isLoading = isYearLoading || isNextHolidayLoading || isSpecialDaysLoading || isHolidaysLoading;
  
  const styles = StyleSheet.create({
    titleWrapper: {
      flex: 1,
      marginRight: scale(4),
      overflow: 'hidden',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(20),
      minHeight: verticalScale(300),
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    list: {
      paddingHorizontal: scale(8),
    },
    eventItem: {
      flexDirection: 'row',
      height: verticalScale(70),
      alignItems: 'center',
      gap: scale(20), 
      borderBottomWidth: 1,
      borderBottomColor: colors.primary.primary100,
      padding: scale(16), 
    },
    dateContainer: {
      width: scale(38),
      height: scale(38),
      borderRadius: scale(8),
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.primary.primary50,
    },
    eventContent: {
      flex: 1,
      overflow: 'hidden',
    },
    daysLeft: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      paddingLeft: scale(8),
      flexDirection: 'row',
      gap: scale(4),
      flexShrink: 0,
      minWidth: scale(80),
    },
  });
  
  return (
    <FlatList
      data={events}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.eventItem}>
          <View style={styles.dateContainer}>
            <Body1Title2Bold style={{fontSize: scale(14)}} color="primary">{item.date.split(' ')[0]}</Body1Title2Bold>
            <Body2Medium style={{fontSize: scale(10)}} color="primary">{item.date.split(' ')[1]}</Body2Medium>
          </View>
          
          <View style={styles.eventContent}>
            <View style={styles.titleContainer}>
              <View style={styles.titleWrapper}>
                <Body1Title2Bold numberOfLines={1} ellipsizeMode="tail">{item.title}</Body1Title2Bold>
              </View>
              {item.daysLeft !== undefined && (
                <View style={styles.daysLeft}>
                  <DotIcon width={scale(10)} height={scale(10)} />
                  {item.isToday ? (
                    <Body2Medium style={{fontSize: scale(12)}} color="warning">Today</Body2Medium>
                  ) : (
                    <Body2Medium style={{fontSize: scale(12)}} color="warning">{item.daysLeft} days left</Body2Medium>
                  )}
                </View>
              )}
            </View>
            <Body2Medium style={{fontSize: scale(12)}} color="sub-heading">{item.islamicDate}</Body2Medium>
          </View>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default EventsList;
