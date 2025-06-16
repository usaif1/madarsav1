// modules/calendar/components/EventsList/EventsList.tsx
import React, { useEffect, useMemo, useRef } from 'react';
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
  daysLeft: number;
  isToday?: boolean;
  isPast?: boolean;
}

interface EventsListProps {
  selectedDate: Date;
  displayMonth?: number; // 0-indexed month
  displayYear?: number;
}

const EventsList: React.FC<EventsListProps> = ({ selectedDate, displayMonth, displayYear }) => {
  const { colors } = useThemeStore();
  const warningColor = colors.warning as string;
  const flatListRef = useRef<FlatList>(null);
  
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
  console.log('selectedHijriDay', selectedHijriDay);
  console.log('selectedHijriMonth', selectedHijriMonth);
  const { data: selectedDayHolidayData, isLoading: isSelectedDayHolidayLoading } = 
    useHijriHoliday(
      selectedHijriDay || 1, 
      selectedHijriMonth || 1
    );
  
  // Get the Hijri calendar for the current display month (still needed for current month events)
  const { data: hijriCalendarData, isLoading: isHijriCalendarLoading } = 
    useHijriCalendar(currentDisplayMonth + 1, currentDisplayYear);
  
  // Get holidays for the entire Islamic year to show full year events
  const { data: yearHolidaysData, isLoading: isYearHolidaysLoading } = 
    useHijriHolidaysByYear(currentIslamicYear);
  
  // Log API responses for debugging
  useEffect(() => {
    console.log('Current Islamic Year API response:', currentIslamicYearData);
    console.log('Next Hijri Holiday API response:', nextHolidayData);
    console.log('Special Days API response:', specialDaysData);
    console.log('Hijri Holidays API response:', holidaysData);
    console.log('Selected Date Hijri Data:', selectedDateHijriData);
    console.log('Selected Day Holiday Data:', selectedDayHolidayData);
    console.log('Hijri Calendar Data:', hijriCalendarData);
    console.log('Year Holidays Data:', yearHolidaysData);
  }, [
    currentIslamicYearData, 
    nextHolidayData, 
    specialDaysData, 
    holidaysData, 
    selectedDateHijriData,
    selectedDayHolidayData,
    hijriCalendarData,
    yearHolidaysData
  ]);
  
  // Process the events data from the API
  const events = useMemo(() => {
    console.log('🎯 === EVENTS ARRAY CREATION STARTED ===');
    console.log('📅 Selected Date:', selectedDate);
    console.log('📊 Display Month/Year:', currentDisplayMonth, currentDisplayYear);
    
    const eventsArray: IslamicEvent[] = [];
    const today = new Date();
    
    // Get all months for the current year to fetch events from
    const allMonthsInYear = Array.from({ length: 12 }, (_, i) => i + 1);
    
    // Check if selected date is today
    const isSelectedDateToday = 
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear();
    
    console.log('🔍 Is Selected Date Today:', isSelectedDateToday);
    
    // We'll collect events from the current month's hijri calendar data
    // but we need to expand this to get all year's events
    
    // 1. Add next upcoming holiday
    console.log('\n🚀 STEP 1: Processing Next Hijri Holiday API');
    console.log('📡 API: useNextHijriHoliday');
    console.log('📝 Response Data:', nextHolidayData);
    
    if (nextHolidayData?.data?.hijri && nextHolidayData.data.gregorian) {
      const hijriData = nextHolidayData.data.hijri;
      const gregorianData = nextHolidayData.data.gregorian;
      
      console.log('✅ Next Holiday Found:', {
        hijriData,
        gregorianData,
        holidays: hijriData.holidays
      });
      
      if (Array.isArray(hijriData.holidays) && hijriData.holidays.length > 0) {
        // Calculate days left relative to selected date
        const holidayDate = new Date(
          parseInt(gregorianData.year),
          gregorianData.month.number - 1,
          parseInt(gregorianData.day)
        );
        
        const daysLeft = Math.ceil((holidayDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));
        const isPast = holidayDate.getTime() < today.getTime();
        
        const nextHolidayEvent = {
          id: 'next-holiday',
          date: `${gregorianData.day} ${gregorianData.month.en.substring(0, 3)}`,
          title: hijriData.holidays[0],
          islamicDate: `${hijriData.day} ${hijriData.month.en}, ${hijriData.year} AH`,
          daysLeft: daysLeft,
          isPast: isPast
        };
        
        console.log('➕ Adding Next Holiday Event (COMMENTED OUT):', nextHolidayEvent);
        // eventsArray.push(nextHolidayEvent);
      } else {
        console.log('❌ No holidays found in next holiday response');
      }
    } else {
      console.log('❌ Next Holiday API returned no valid data');
    }
    
    console.log('📊 Events Array after Step 1:', eventsArray.length, 'events');
    
    // 2. Use the same Hijri calendar data that's used to mark the calendar days
    console.log('\n🚀 STEP 2: Processing Hijri Calendar API for Current Month');
    console.log('📡 API: useHijriCalendar');
    console.log('📝 Response Data:', hijriCalendarData);
    
    if (hijriCalendarData?.data && Array.isArray(hijriCalendarData.data)) {
      console.log('✅ Processing', hijriCalendarData.data.length, 'days from Hijri Calendar');
      
      // Process each day in the calendar
      hijriCalendarData.data.forEach((dayData, index) => {
        if (!dayData || !dayData.gregorian || !dayData.hijri) {
          console.log(`⚠️ Day ${index}: Invalid day data`);
          return;
        }
        
        // Get the gregorian date
        const gregorianDate = dayData.gregorian;
        const hijriDate = dayData.hijri;
        
        // Check if this day has any holidays
        if (hijriDate.holidays && hijriDate.holidays.length > 0) {
          console.log(`🎉 Day ${index}: Found holidays for ${gregorianDate.day}/${gregorianDate.month.number}:`, hijriDate.holidays);
          
          // Create a date object for this day
          const holidayDate = new Date(
            parseInt(gregorianDate.year),
            gregorianDate.month.number - 1,
            parseInt(gregorianDate.day)
          );
          
          // Calculate days left relative to selected date
          const daysLeft = Math.ceil((holidayDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Add each holiday for this day
          hijriDate.holidays.forEach((holiday, holidayIndex) => {
            const isPast = holidayDate.getTime() < today.getTime();
            
            const eventItem: IslamicEvent = {
              id: `calendar-holiday-${index}-${holidayIndex}`,
              date: `${gregorianDate.day} ${gregorianDate.month.en.substring(0, 3)}`,
              title: holiday,
              islamicDate: `${hijriDate.day} ${hijriDate.month.en}, ${hijriDate.year} AH`,
              daysLeft: daysLeft,
              isPast: isPast
            };
            
            // Avoid duplicates
            if (!eventsArray.some(e => e.title === holiday && e.date === eventItem.date)) {
              console.log('➕ Adding Calendar Holiday Event (COMMENTED OUT):', eventItem);
              // eventsArray.push(eventItem);
            } else {
              console.log('🔄 Skipping duplicate event:', holiday);
            }
          });
        }
      });
    } else {
      console.log('❌ Hijri Calendar API returned no valid data');
    }
    
    console.log('📊 Events Array after Step 2:', eventsArray.length, 'events');
    
    // 3. Add year-wide holidays from the Islamic calendar
    console.log('\n🚀 STEP 3: Processing Year-Wide Hijri Holidays API');
    console.log('📡 API: useHijriHolidaysByYear');
    console.log('📝 Islamic Year:', currentIslamicYear);
    console.log('📝 Response Data:', yearHolidaysData);
    
    if (yearHolidaysData?.data && Array.isArray(yearHolidaysData.data)) {
      console.log('✅ Processing', yearHolidaysData.data.length, 'days from Year Holidays');
      
      yearHolidaysData.data.forEach((dayData, index) => {
        if (!dayData || !dayData.gregorian || !dayData.hijri) {
          console.log(`⚠️ Year Day ${index}: Invalid day data`);
          return;
        }
        
        // Get the gregorian date
        const gregorianDate = dayData.gregorian;
        const hijriDate = dayData.hijri;
        
        // Check if this day has any holidays
        if (hijriDate.holidays && hijriDate.holidays.length > 0) {
          console.log(`🎉 Year Day ${index}: Found holidays for ${gregorianDate.day}/${gregorianDate.month.number}:`, hijriDate.holidays);
          
          // Create a date object for this day
          const holidayDate = new Date(
            parseInt(gregorianDate.year),
            gregorianDate.month.number - 1,
            parseInt(gregorianDate.day)
          );
          
          // Calculate days left relative to selected date
          const daysLeft = Math.ceil((holidayDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));
          const isPast = holidayDate.getTime() < today.getTime();
          
          // Add each holiday for this day
          hijriDate.holidays.forEach((holiday, holidayIndex) => {
            const eventItem: IslamicEvent = {
              id: `year-holiday-${index}-${holidayIndex}`,
              date: `${gregorianDate.day} ${gregorianDate.month.en.substring(0, 3)}`,
              title: holiday,
              islamicDate: `${hijriDate.day} ${hijriDate.month.en}, ${hijriDate.year} AH`,
              daysLeft: daysLeft,
              isPast: isPast
            };
            
            // Avoid duplicates (check both current month data and year data)
            if (!eventsArray.some(e => e.title === holiday && e.date === eventItem.date)) {
              console.log('➕ Adding Year Holiday Event:', eventItem);
              eventsArray.push(eventItem);
            } else {
              console.log('🔄 Skipping duplicate year event:', holiday);
            }
          });
        }
      });
    } else {
      console.log('❌ Year Holidays API returned no valid data');
    }
    
    console.log('📊 Events Array after Step 3:', eventsArray.length, 'events');
    
    // 4. Add special days from the API for the entire year
    console.log('\n🚀 STEP 4: Processing Special Days API');
    console.log('📡 API: useSpecialDays');
    console.log('📝 Response Data:', specialDaysData);
    
    if (specialDaysData?.data && Array.isArray(specialDaysData.data)) {
      console.log('✅ Processing', specialDaysData.data.length, 'special days');
      
      specialDaysData.data.forEach((specialDay, index) => {
        if (!specialDay || !specialDay.name) {
          console.log(`⚠️ Special Day ${index}: Invalid special day data`);
          return;
        }
        
        console.log(`🌟 Special Day ${index}:`, specialDay);
        
        const specialDayMonth = specialDay.month;
        const specialDayDay = specialDay.day;
        
        // Create a date for this special day in the current year
        const specialDayDate = new Date(currentDisplayYear, specialDayMonth - 1, specialDayDay);
        
        // Calculate days left relative to selected date
        const daysLeft = Math.ceil((specialDayDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24));
        const isPast = specialDayDate.getTime() < today.getTime();
        
        const eventItem: IslamicEvent = {
          id: `special-day-${index}`,
          date: `${specialDayDay} ${new Date(0, specialDayMonth - 1).toLocaleString('en', { month: 'short' })}`,
          title: specialDay.name,
          islamicDate: 'Islamic Special Day',
          daysLeft: daysLeft,
          isPast: isPast
        };
        
        // Avoid duplicates
        if (!eventsArray.some(e => e.title === specialDay.name && e.date === eventItem.date)) {
          console.log('➕ Adding Special Day Event:', eventItem);
          eventsArray.push(eventItem);
        } else {
          console.log('🔄 Skipping duplicate special day:', specialDay.name);
        }
      });
    } else {
      console.log('❌ Special Days API returned no valid data');
    }
    
    console.log('📊 Events Array after Step 4:', eventsArray.length, 'events');
    
    console.log('\n🔄 STEP 5: Sorting Events');
    console.log('📝 Events before sorting:', eventsArray.map(e => ({ title: e.title, date: e.date, daysLeft: e.daysLeft })));
    
    // Sort all events by date (chronological order)
    eventsArray.sort((a, b) => {
      // Parse the date strings to get comparable dates
      const parseEventDate = (dateStr: string) => {
        const [day, monthAbbr] = dateStr.split(' ');
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                           'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = monthNames.indexOf(monthAbbr);
        return new Date(currentDisplayYear, month, parseInt(day));
      };
      
      const dateA = parseEventDate(a.date);
      const dateB = parseEventDate(b.date);
      
      return dateA.getTime() - dateB.getTime();
    });
    
    console.log('📝 Events after sorting:', eventsArray.map(e => ({ title: e.title, date: e.date, daysLeft: e.daysLeft })));
    
    console.log('\n🎯 === FINAL EVENTS ARRAY ===');
    console.log('📊 Total Events:', eventsArray.length);
    console.log('📝 Complete Final Array:', eventsArray);
    
    // Group by API source for summary
    const apiSummary = {
      'useNextHijriHoliday (COMMENTED OUT)': eventsArray.filter(e => e.id.startsWith('next-holiday')).length,
      'useHijriCalendar (COMMENTED OUT)': eventsArray.filter(e => e.id.startsWith('calendar-holiday')).length,
      'useHijriHolidaysByYear (ACTIVE)': eventsArray.filter(e => e.id.startsWith('year-holiday')).length,
      'useSpecialDays (ACTIVE)': eventsArray.filter(e => e.id.startsWith('special-day')).length,
    };
    
    console.log('📊 Events by API Source:', apiSummary);
    console.log('🎯 === EVENTS ARRAY CREATION COMPLETED ===\n');
    
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
    hijriCalendarData,
    yearHolidaysData
  ]);

  // Find the first event that belongs to the current display month
  const firstCurrentMonthEventIndex = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonthAbbr = monthNames[currentDisplayMonth];
    
    return events.findIndex(event => {
      const eventMonthAbbr = event.date.split(' ')[1];
      return eventMonthAbbr === currentMonthAbbr;
    });
  }, [events, currentDisplayMonth]);

  // Auto-scroll to the first event of the current month
  useEffect(() => {
    if (events.length > 0 && firstCurrentMonthEventIndex !== -1 && flatListRef.current) {
      // Add a small delay to ensure the FlatList is fully rendered
      const timeoutId = setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: firstCurrentMonthEventIndex,
          animated: true,
          viewPosition: 0.1, // Show the item near the top of the list
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [events, firstCurrentMonthEventIndex, currentDisplayMonth]);
  
  // Show loading state
  const isLoading = 
    isYearLoading || 
    isNextHolidayLoading || 
    isSpecialDaysLoading || 
    isHolidaysLoading ||
    isSelectedDateHijriLoading ||
    isSelectedDayHolidayLoading ||
    isHijriCalendarLoading ||
    isYearHolidaysLoading;
  
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
      ref={flatListRef}
      data={events}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        const isToday = item.daysLeft === 0;
        const opacity = item.isPast ? 0.5 : 1.0;
        
        return (
          <View style={[styles.eventItem, { opacity }]}>
            <View style={styles.dateContainer}>
              <Body1Title2Bold style={{fontSize: scale(14)}} color="primary">{item.date.split(' ')[0]}</Body1Title2Bold>
              <Body2Medium style={{fontSize: scale(10)}} color="primary">{item.date.split(' ')[1]}</Body2Medium>
            </View>
            
            <View style={styles.eventContent}>
              <View style={styles.titleContainer}>
                <View style={styles.titleWrapper}>
                  <Body1Title2Bold numberOfLines={1} ellipsizeMode="tail">{item.title}</Body1Title2Bold>
                </View>
                <View style={styles.daysLeft}>
                  <CdnSvg 
                    path={DUA_ASSETS.CALENDAR_DOT} 
                    width={scale(10)} 
                    height={scale(10)} 
                    fill={warningColor} 
                  />
                  {isToday ? (
                    <Body2Medium style={{fontSize: scale(12)}} color="warning">Today</Body2Medium>
                  ) : item.daysLeft > 0 ? (
                    <Body2Medium style={{fontSize: scale(12)}} color="warning">{item.daysLeft} days left</Body2Medium>
                  ) : (
                    <Body2Medium style={{fontSize: scale(12)}} color="warning">{Math.abs(item.daysLeft)} days ago</Body2Medium>
                  )}
                </View>
              </View>
              <Body2Medium style={{fontSize: scale(12)}} color="sub-heading">{item.islamicDate}</Body2Medium>
            </View>
          </View>
        );
      }}
      contentContainerStyle={styles.list}
      onScrollToIndexFailed={info => {
        // Handle scroll failure gracefully
        console.log('Scroll to index failed:', info);
        // Try to scroll to a safe position
        if (info.averageItemLength && flatListRef.current) {
          flatListRef.current.scrollToOffset({
            offset: info.averageItemLength * info.index,
            animated: true,
          });
        }
      }}
    />
  );
};

export default EventsList;
