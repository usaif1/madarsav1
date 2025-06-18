// modules/calendar/components/EventsList/EventsList.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Body1Title2Bold, Body2Medium, Title3Bold } from '@/components';
import { useThemeStore } from '@/globalStore';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { scale, verticalScale } from '@/theme/responsive';

// Import the same Hijri Calendar API hook used by CustomCalendar for consistency
import { useHijriCalendar } from '../../hooks/useHijriCalendar';
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
  const warningColor = String(colors.warning);
  const flatListRef = useRef<FlatList>(null);
  
  // Use the provided display year or default to the selected date year
  const currentDisplayYear = displayYear !== undefined ? displayYear : selectedDate.getFullYear();
  const currentDisplayMonth = displayMonth !== undefined ? displayMonth : selectedDate.getMonth();
  
  console.log('🎯 EventsList - Display Year:', currentDisplayYear);
  console.log('📅 Using same API as CustomCalendar for perfect consistency');
  
  // Call useHijriCalendar for all 12 months of the display year
  // This ensures perfect consistency with CustomCalendar dots
  const month1 = useHijriCalendar(1, currentDisplayYear);
  const month2 = useHijriCalendar(2, currentDisplayYear);
  const month3 = useHijriCalendar(3, currentDisplayYear);
  const month4 = useHijriCalendar(4, currentDisplayYear);
  const month5 = useHijriCalendar(5, currentDisplayYear);
  const month6 = useHijriCalendar(6, currentDisplayYear);
  const month7 = useHijriCalendar(7, currentDisplayYear);
  const month8 = useHijriCalendar(8, currentDisplayYear);
  const month9 = useHijriCalendar(9, currentDisplayYear);
  const month10 = useHijriCalendar(10, currentDisplayYear);
  const month11 = useHijriCalendar(11, currentDisplayYear);
  const month12 = useHijriCalendar(12, currentDisplayYear);
  
  // Collect all month data and loading states
  const monthlyData = [
    { data: month1.data, isLoading: month1.isLoading, error: month1.error, month: 1 },
    { data: month2.data, isLoading: month2.isLoading, error: month2.error, month: 2 },
    { data: month3.data, isLoading: month3.isLoading, error: month3.error, month: 3 },
    { data: month4.data, isLoading: month4.isLoading, error: month4.error, month: 4 },
    { data: month5.data, isLoading: month5.isLoading, error: month5.error, month: 5 },
    { data: month6.data, isLoading: month6.isLoading, error: month6.error, month: 6 },
    { data: month7.data, isLoading: month7.isLoading, error: month7.error, month: 7 },
    { data: month8.data, isLoading: month8.isLoading, error: month8.error, month: 8 },
    { data: month9.data, isLoading: month9.isLoading, error: month9.error, month: 9 },
    { data: month10.data, isLoading: month10.isLoading, error: month10.error, month: 10 },
    { data: month11.data, isLoading: month11.isLoading, error: month11.error, month: 11 },
    { data: month12.data, isLoading: month12.isLoading, error: month12.error, month: 12 },
  ];
  
  // Check if any month is still loading
  const isLoading = monthlyData.some(month => month.isLoading);
  
  // Process the events data from all 12 months - same as CustomCalendar processing
  const events = useMemo(() => {
    console.log('🎯 === EVENTS ARRAY CREATION (12-Month Hijri Calendar API) ===');
    console.log('🗓️ Display Year:', currentDisplayYear);
    console.log('📊 Using same useHijriCalendar API as CustomCalendar for perfect consistency');
    
    const eventsArray: IslamicEvent[] = [];
    const today = new Date();
    
    // Process each month's data
    monthlyData.forEach(({ data: hijriCalendarData, month }) => {
      if (!hijriCalendarData?.data || !Array.isArray(hijriCalendarData.data)) {
        console.log(`⚠️ Month ${month}: No valid data`);
        return;
      }
      
      console.log(`✅ Processing Month ${month}: ${hijriCalendarData.data.length} days`);
      
      // Process each day in the month - exactly like CustomCalendar
      hijriCalendarData.data.forEach((dayData, index) => {
        if (!dayData || !dayData.gregorian || !dayData.hijri) {
          return;
        }
        
        const gregorianDate = dayData.gregorian;
        const hijriDate = dayData.hijri;
        
        // Check if this day has any holidays - same logic as CustomCalendar
        if (hijriDate.holidays && hijriDate.holidays.length > 0) {
          console.log(`🎉 Month ${month}, Day ${index}: Found holidays for ${gregorianDate.day}/${gregorianDate.month.number}:`, hijriDate.holidays);
          
          // Parse the gregorian date from the API response - same as CustomCalendar
          const holidayDate = new Date(
            `${gregorianDate.year}-${gregorianDate.month.number
              .toString()
              .padStart(2, '0')}-${gregorianDate.day
              .toString()
              .padStart(2, '0')}`
          );
          
          console.log(`📅 Holiday Date: ${holidayDate.toDateString()}`);
          
          // Calculate days left relative to TODAY for consistent behavior
          const daysLeft = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
          const isPast = daysLeft < 0;
          
          // Add each holiday for this day
          hijriDate.holidays.forEach((holiday: string, holidayIndex: number) => {
            const eventItem: IslamicEvent = {
              id: `month-${month}-day-${index}-holiday-${holidayIndex}`,
              date: `${gregorianDate.day} ${gregorianDate.month.en.substring(0, 3)}`,
              title: holiday,
              islamicDate: `${hijriDate.day} ${hijriDate.month.en}, ${hijriDate.year} AH`,
              daysLeft: daysLeft,
              isPast: isPast
            };
            
            // Avoid duplicates (same holiday on same date)
            if (!eventsArray.some(e => e.title === holiday && e.date === eventItem.date)) {
              console.log(`➕ Adding Month ${month} Holiday Event:`, eventItem.title);
              eventsArray.push(eventItem);
            } else {
              console.log(`🔄 Skipping duplicate event:`, holiday);
            }
          });
        }
      });
    });
    
    // Sort events chronologically within the display year
    eventsArray.sort((a, b) => {
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
    
    console.log('🎯 Final Events Array (from 12-month Hijri Calendar API):', eventsArray.length, 'events for year', currentDisplayYear);
    console.log('✅ Events will exactly match CustomCalendar dots since using same API');
    
    return eventsArray;
  }, [
    // Depend on all 12 months of data - only changes when year changes
    currentDisplayYear,
    ...monthlyData.map(month => month.data)
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
      const timeoutId = setTimeout(() => {
        flatListRef.current?.scrollToIndex({
          index: firstCurrentMonthEventIndex,
          animated: true,
          viewPosition: 0.1,
        });
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [events, firstCurrentMonthEventIndex, currentDisplayMonth]);
  
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
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.primary600} />
        <Body2Medium color="sub-heading" style={{ marginTop: scale(16) }}>
          Loading events for {currentDisplayYear}...
        </Body2Medium>
      </View>
    );
  }
  
  // Show empty state if no events
  if (events.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Body2Medium color="sub-heading">No Islamic events found for {currentDisplayYear}</Body2Medium>
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
        console.log('Scroll to index failed:', info);
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
