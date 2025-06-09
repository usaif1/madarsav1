// modules/calendar/components/EventsList/EventsList.tsx
import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Body1Title2Bold, Body2Medium, Title3Bold } from '@/components';
import { useThemeStore } from '@/globalStore';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { scale, verticalScale } from '@/theme/responsive';

// Import Hijri Calendar API hooks
import { 
  useNextHijriHoliday, 
  useSpecialDays, 
  useHijriHolidaysByYear, 
  useCurrentIslamicYear,
  useHijriHoliday,
  useGregorianToHijri,
  useHijriCalendar
} from '../../hooks/useHijriCalendar';
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
  displayMonth?: number; // 0-indexed month
  displayYear?: number;
}

const EventsList: React.FC<EventsListProps> = ({ selectedDate, displayMonth, displayYear }) => {
  const { colors } = useThemeStore();
  const warningColor = colors.warning as string;
  
  // Use the provided display month/year or default to the selected date
  const currentDisplayMonth = displayMonth !== undefined ? displayMonth : selectedDate.getMonth();
  const currentDisplayYear = displayYear !== undefined ? displayYear : selectedDate.getFullYear();
  
  // Format the selected date for API calls
  const formattedSelectedDate = formatDate(selectedDate);
  
  // Get current Islamic year
  const { data: currentIslamicYearData, isLoading: isYearLoading } = useCurrentIslamicYear();
  
  // Get next Hijri holiday
  const { data: nextHolidayData, isLoading: isNextHolidayLoading } = useNextHijriHoliday();
  
  // Get special days
  const { data: specialDaysData, isLoading: isSpecialDaysLoading } = useSpecialDays();
  
  // Get Hijri date for the selected date
  const { data: selectedDateHijriData, isLoading: isSelectedDateHijriLoading } = useGregorianToHijri(selectedDate);
  
  // Get current Islamic year for holidays
  const currentIslamicYear = currentIslamicYearData?.data 
    ? (typeof currentIslamicYearData.data === 'number' 
      ? currentIslamicYearData.data 
      : parseInt(currentIslamicYearData.data.hijri?.year || '1445'))
    : 1445;
  
  // Get Hijri holidays for the current Islamic year
  const { data: holidaysData, isLoading: isHolidaysLoading } = useHijriHolidaysByYear(currentIslamicYear);
  
  // Get holiday for the selected date (if any)
  const selectedHijriDay = selectedDateHijriData?.data && 
    typeof selectedDateHijriData.data === 'object' &&
    'hijri' in selectedDateHijriData.data &&
    selectedDateHijriData.data.hijri &&
    'day' in selectedDateHijriData.data.hijri
      ? parseInt(String(selectedDateHijriData.data.hijri.day))
      : null;
      
  const selectedHijriMonth = selectedDateHijriData?.data && 
    typeof selectedDateHijriData.data === 'object' &&
    'hijri' in selectedDateHijriData.data &&
    selectedDateHijriData.data.hijri &&
    'month' in selectedDateHijriData.data.hijri &&
    selectedDateHijriData.data.hijri.month &&
    'number' in selectedDateHijriData.data.hijri.month
      ? selectedDateHijriData.data.hijri.month.number
      : null;
  
  const { data: selectedDayHolidayData, isLoading: isSelectedDayHolidayLoading } = 
    useHijriHoliday(
      selectedHijriDay || 1, 
      selectedHijriMonth || 1
    );
  
  // Get the Hijri calendar for the current display month
  const { data: hijriCalendarData, isLoading: isHijriCalendarLoading } = 
    useHijriCalendar(currentDisplayMonth + 1, currentDisplayYear);
  
  // Log API responses for debugging
  useEffect(() => {
    console.log('Current Islamic Year API response:', currentIslamicYearData);
    console.log('Next Hijri Holiday API response:', nextHolidayData);
    console.log('Special Days API response:', specialDaysData);
    console.log('Hijri Holidays API response:', holidaysData);
    console.log('Selected Date Hijri Data:', selectedDateHijriData);
    console.log('Selected Day Holiday Data:', selectedDayHolidayData);
    console.log('Hijri Calendar Data:', hijriCalendarData);
  }, [
    currentIslamicYearData, 
    nextHolidayData, 
    specialDaysData, 
    holidaysData, 
    selectedDateHijriData,
    selectedDayHolidayData,
    hijriCalendarData
  ]);
  
  // Process the events data from the API
  const events = useMemo(() => {
    const eventsArray: IslamicEvent[] = [];
    const today = new Date();
    const todayString = formatDate(today);
    
    // Track different types of events for sorting
    const todayEvents: IslamicEvent[] = [];
    const selectedDateEvents: IslamicEvent[] = [];
    const upcomingHolidays: IslamicEvent[] = [];
    const currentMonthEvents: IslamicEvent[] = [];
    
    // Check if selected date is today
    const isSelectedDateToday = 
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();
    
    // 1. Add today's Hijri date information
    if (selectedDateHijriData?.data && 
        typeof selectedDateHijriData.data === 'object' &&
        'hijri' in selectedDateHijriData.data &&
        'gregorian' in selectedDateHijriData.data) {
      const hijriData = (selectedDateHijriData.data as any).hijri;
      const gregorianData = (selectedDateHijriData.data as any).gregorian;
      
      const eventItem: IslamicEvent = {
        id: 'current-hijri-date',
        date: `${gregorianData.day} ${gregorianData.month.en.substring(0, 3)}`,
        title: `Current Hijri Date`,
        islamicDate: `${hijriData.day} ${hijriData.month.en}, ${hijriData.year} AH`,
        isToday: isSelectedDateToday,
        daysLeft: isSelectedDateToday ? 0 : undefined
      };
      
      if (isSelectedDateToday) {
        // todayEvents.push(eventItem);
      } else {
        // selectedDateEvents.push(eventItem);
      }
    }
    
    // 2. Add holiday for the selected date (if any)
    if (selectedDayHolidayData?.data && Array.isArray(selectedDayHolidayData.data) && selectedDayHolidayData.data.length > 0) {
      // If there are holidays on the selected date
      selectedDayHolidayData.data.forEach((holiday, index) => {
        if (selectedDateHijriData?.data?.hijri && selectedDateHijriData?.data?.gregorian) {
          const hijriData = selectedDateHijriData.data.hijri;
          const gregorianData = selectedDateHijriData.data.gregorian;
          
          const eventItem: IslamicEvent = {
            id: `selected-day-holiday-${index}`,
            date: `${gregorianData.day} ${gregorianData.month.en.substring(0, 3)}`,
            title: holiday,
            islamicDate: `${hijriData.day} ${hijriData.month.en}, ${hijriData.year} AH`,
            isToday: isSelectedDateToday
          };
          
          if (isSelectedDateToday) {
            // todayEvents.push(eventItem);
          } else {
            // selectedDateEvents.push(eventItem);
          }
        }
      });
    }
    
    // 3. Add next upcoming holiday
    if (nextHolidayData?.data?.hijri && nextHolidayData.data.gregorian) {
      const hijriData = nextHolidayData.data.hijri;
      const gregorianData = nextHolidayData.data.gregorian;
      
      if (Array.isArray(hijriData.holidays) && hijriData.holidays.length > 0) {
        // Calculate days left
        const holidayDate = new Date(
          parseInt(gregorianData.year),
          gregorianData.month.number - 1,
          parseInt(gregorianData.day)
        );
        
        const daysLeft = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Only add if it's in the future
        if (daysLeft > 0) {
          upcomingHolidays.push({
            id: 'next-holiday',
            date: `${gregorianData.day} ${gregorianData.month.en.substring(0, 3)}`,
            title: hijriData.holidays[0],
            islamicDate: `${hijriData.day} ${hijriData.month.en}, ${hijriData.year} AH`,
            daysLeft: daysLeft
          });
        }
      }
    }
    
    // 4. Use the same Hijri calendar data that's used to mark the calendar days
    if (hijriCalendarData?.data && Array.isArray(hijriCalendarData.data)) {
      // Process each day in the calendar
      hijriCalendarData.data.forEach((dayData, index) => {
        if (!dayData || !dayData.gregorian || !dayData.hijri) return;
        
        // Get the gregorian date
        const gregorianDate = dayData.gregorian;
        const hijriDate = dayData.hijri;
        
        // Check if this day has any holidays
        if (hijriDate.holidays && hijriDate.holidays.length > 0) {
          // Create a date object for this day
          const holidayDate = new Date(
            parseInt(gregorianDate.year),
            gregorianDate.month.number - 1,
            parseInt(gregorianDate.day)
          );
          
          // Calculate days left
          const daysLeft = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          
          // Check if this is today or the selected date
          const isHolidayToday = 
            holidayDate.getDate() === today.getDate() &&
            holidayDate.getMonth() === today.getMonth() &&
            holidayDate.getFullYear() === today.getFullYear();
          
          const isHolidaySelectedDate = 
            holidayDate.getDate() === selectedDate.getDate() &&
            holidayDate.getMonth() === selectedDate.getMonth() &&
            holidayDate.getFullYear() === selectedDate.getFullYear();
          
          // Add each holiday for this day
          hijriDate.holidays.forEach((holiday, holidayIndex) => {
            const eventItem: IslamicEvent = {
              id: `calendar-holiday-${index}-${holidayIndex}`,
              date: `${gregorianDate.day} ${gregorianDate.month.en.substring(0, 3)}`,
              title: holiday,
              islamicDate: `${hijriDate.day} ${hijriDate.month.en}, ${hijriDate.year} AH`,
              daysLeft: daysLeft > 0 ? daysLeft : undefined,
              isToday: isHolidayToday
            };
            
            // Add to the appropriate category
            if (isHolidayToday) {
              // Avoid duplicates
              if (!todayEvents.some(e => e.title === holiday && e.date === eventItem.date)) {
                todayEvents.push(eventItem);
              }
            } else if (isHolidaySelectedDate) {
              // Avoid duplicates
              if (!selectedDateEvents.some(e => e.title === holiday && e.date === eventItem.date)) {
                selectedDateEvents.push(eventItem);
              }
            } else {
              // Avoid duplicates
              if (!currentMonthEvents.some(e => e.title === holiday && e.date === eventItem.date)) {
                currentMonthEvents.push(eventItem);
              }
            }
          });
        }
      });
    }
    
    // 5. Add special days from the API that fall in the current month
    if (specialDaysData?.data && Array.isArray(specialDaysData.data)) {
      specialDaysData.data.forEach((specialDay, index) => {
        if (!specialDay || !specialDay.name) return;
        
        const specialDayMonth = specialDay.month;
        const specialDayDay = specialDay.day;
        
        // Only add if it's a special day in the current month
        if (specialDayMonth === currentDisplayMonth + 1) {
          // Create a date for this special day in the current year
          const specialDayDate = new Date(currentDisplayYear, currentDisplayMonth, specialDayDay);
          
          const daysLeft = Math.ceil((specialDayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const isSpecialDayToday = 
            specialDayDate.getDate() === today.getDate() &&
            specialDayDate.getMonth() === today.getMonth() &&
            specialDayDate.getFullYear() === today.getFullYear();
          
          const isSpecialDaySelectedDate = 
            specialDayDate.getDate() === selectedDate.getDate() &&
            specialDayDate.getMonth() === selectedDate.getMonth() &&
            specialDayDate.getFullYear() === selectedDate.getFullYear();
          
          const eventItem: IslamicEvent = {
            id: `special-day-${index}`,
            date: `${specialDayDay} ${new Date(0, specialDayMonth - 1).toLocaleString('en', { month: 'short' })}`,
            title: specialDay.name,
            islamicDate: 'Islamic Special Day',
            daysLeft: daysLeft > 0 ? daysLeft : undefined,
            isToday: isSpecialDayToday
          };
          
          if (isSpecialDayToday) {
            todayEvents.push(eventItem);
          } else if (isSpecialDaySelectedDate) {
            selectedDateEvents.push(eventItem);
          } else {
            currentMonthEvents.push(eventItem);
          }
        }
      });
    }
    
    // Sort each category
    
    // Sort today's events (if today is selected)
    todayEvents.sort((a, b) => {
      const aDay = parseInt(a.date.split(' ')[0]);
      const bDay = parseInt(b.date.split(' ')[0]);
      return aDay - bDay;
    });
    
    // Sort selected date events
    selectedDateEvents.sort((a, b) => {
      const aDay = parseInt(a.date.split(' ')[0]);
      const bDay = parseInt(b.date.split(' ')[0]);
      return aDay - bDay;
    });
    
    // Sort upcoming holidays by days left
    upcomingHolidays.sort((a, b) => {
      const aDaysLeft = typeof a.daysLeft === 'number' ? a.daysLeft : Infinity;
      const bDaysLeft = typeof b.daysLeft === 'number' ? b.daysLeft : Infinity;
      return aDaysLeft - bDaysLeft;
    });
    
    // Sort current month events by date
    currentMonthEvents.sort((a, b) => {
      const aDay = parseInt(a.date.split(' ')[0]);
      const bDay = parseInt(b.date.split(' ')[0]);
      return aDay - bDay;
    });
    
    // Combine all events in the desired order:
    // 1. Today's events
    // 2. Next upcoming holiday
    // 3. Selected date events (if different from today)
    // 4. Current month events
    
    // First add today's events
    eventsArray.push(...todayEvents);
    
    // Then add the next upcoming holiday
    eventsArray.push(...upcomingHolidays);
    
    // Then add selected date events (if not today)
    if (!isSelectedDateToday) {
      eventsArray.push(...selectedDateEvents);
    }
    
    // Finally add all other current month events
    eventsArray.push(...currentMonthEvents);
    
    return eventsArray;
  }, [
    selectedDateHijriData, 
    nextHolidayData, 
    specialDaysData, 
    holidaysData,
    selectedDayHolidayData,
    currentDisplayMonth,
    currentDisplayYear,
    selectedDate,
    hijriCalendarData
  ]);
  
  // Show loading state
  const isLoading = 
    isYearLoading || 
    isNextHolidayLoading || 
    isSpecialDaysLoading || 
    isHolidaysLoading ||
    isSelectedDateHijriLoading ||
    isSelectedDayHolidayLoading ||
    isHijriCalendarLoading;
  
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
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: scale(20),
      minHeight: verticalScale(200),
    },
  });
  
  // Show empty state if no events
  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Body2Medium color="sub-heading">No Islamic events found for this period</Body2Medium>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.primary600} />
      </View>
    );
  }
  
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
                  <CdnSvg 
                    path={DUA_ASSETS.CALENDAR_DOT} 
                    width={scale(10)} 
                    height={scale(10)} 
fill={warningColor} 
                  />
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
