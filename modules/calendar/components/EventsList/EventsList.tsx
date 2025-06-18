// modules/calendar/components/EventsList/EventsList.tsx
import React, { useEffect, useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Body1Title2Bold, Body2Medium, Title3Bold } from '@/components';
import { useThemeStore } from '@/globalStore';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { scale, verticalScale } from '@/theme/responsive';

// Import only the required Hijri Calendar API hooks
import { 
  useHijriHolidaysByYear, 
  useCurrentIslamicYear
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
  const warningColor = String(colors.warning);
  const flatListRef = useRef<FlatList>(null);
  
  // Use the provided display year or default to the selected date year
  const currentDisplayYear = displayYear !== undefined ? displayYear : selectedDate.getFullYear();
  const currentDisplayMonth = displayMonth !== undefined ? displayMonth : selectedDate.getMonth();
  
  console.log('🎯 EventsList - Display Year:', currentDisplayYear);
  
  // Get current Islamic year (only for calculating display year)
  const { data: currentIslamicYearData, isLoading: isYearLoading } = useCurrentIslamicYear();
  
  // Get current Islamic year for calculations
  const currentIslamicYear = currentIslamicYearData?.data 
    ? (typeof currentIslamicYearData.data === 'number' 
      ? currentIslamicYearData.data 
      : parseInt((currentIslamicYearData.data as any)?.hijri?.year || '1445'))
    : 1445;
  
  // Calculate Islamic year for the display year
  const calculateIslamicYearForGregorianYear = (gregorianYear: number): number => {
    // Islamic year is about 622 years behind Gregorian with correction factor
    const approximateIslamicYear = Math.floor((gregorianYear - 622) * 1.030684);
    return Math.max(approximateIslamicYear, 1);
  };
  
  // Always use current Islamic year for current year, calculate for others
  const displayIslamicYear = currentDisplayYear === new Date().getFullYear() 
    ? currentIslamicYear
    : calculateIslamicYearForGregorianYear(currentDisplayYear);
    
  // To get a complete Gregorian year, we need TWO consecutive Islamic years
  const primaryIslamicYear = displayIslamicYear;
  const secondaryIslamicYear = displayIslamicYear + 1;
  
  console.log('🗓️ Using Islamic Years for events:', {
    displayYear: currentDisplayYear,
    primary: primaryIslamicYear,
    secondary: secondaryIslamicYear
  });
  
  // ONLY fetch the 2 APIs we actually need for events
  const { data: yearHolidaysData, isLoading: isYearHolidaysLoading } = 
    useHijriHolidaysByYear(primaryIslamicYear);
    
  const { data: secondaryYearHolidaysData, isLoading: isSecondaryYearHolidaysLoading } = 
    useHijriHolidaysByYear(secondaryIslamicYear);
  
  // Process the events data - REMOVED dependency on selectedDate since events are year-wide
  const events = useMemo(() => {
    console.log('🎯 === EVENTS ARRAY CREATION (Year-based) ===');
    console.log('🗓️ Display Year:', currentDisplayYear);
    console.log('🗓️ Islamic Years:', { primary: primaryIslamicYear, secondary: secondaryIslamicYear });
    
    const eventsArray: IslamicEvent[] = [];
    const today = new Date();
    
    // Helper function to process holiday data from either API response
    const processHolidayData = (holidayData: any, yearLabel: string) => {
      if (holidayData?.data && Array.isArray(holidayData.data)) {
        console.log(`✅ Processing ${holidayData.data.length} days from ${yearLabel} Holidays`);
        
        holidayData.data.forEach((dayData: any, index: number) => {
          if (!dayData || !dayData.gregorian || !dayData.hijri) {
            return;
          }
          
          const gregorianDate = dayData.gregorian;
          const hijriDate = dayData.hijri;
          
          // Check if this day has any holidays
          if (hijriDate.holidays && hijriDate.holidays.length > 0) {
            // Use API's actual date - no hardcoded assumptions
            const apiYear = parseInt(gregorianDate.year);
            const apiMonth = gregorianDate.month.number - 1; // Convert to 0-based month
            const apiDay = parseInt(gregorianDate.day);
            
            const holidayDate = new Date(apiYear, apiMonth, apiDay);
            
            // FILTER: Only include events within the current display year
            if (apiYear !== currentDisplayYear) {
              return; // Skip events not in the current display year
            }
            
            // Calculate days left relative to TODAY for consistent behavior
            const daysLeft = Math.ceil((holidayDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const isPast = daysLeft < 0;
            
            // Add each holiday for this day
            hijriDate.holidays.forEach((holiday: string, holidayIndex: number) => {
              const eventItem: IslamicEvent = {
                id: `${yearLabel.toLowerCase()}-holiday-${index}-${holidayIndex}`,
                date: `${gregorianDate.day} ${gregorianDate.month.en.substring(0, 3)}`,
                title: holiday,
                islamicDate: `${hijriDate.day} ${hijriDate.month.en}, ${hijriDate.year} AH`,
                daysLeft: daysLeft,
                isPast: isPast
              };
              
              // Avoid duplicates
              if (!eventsArray.some(e => e.title === holiday && e.date === eventItem.date)) {
                console.log(`➕ Adding ${yearLabel} Holiday Event:`, eventItem.title);
                eventsArray.push(eventItem);
              }
            });
          }
        });
      } else {
        console.log(`❌ ${yearLabel} Holidays API returned no valid data`);
      }
    };
    
    // Process both Islamic years
    processHolidayData(yearHolidaysData, 'Primary');
    processHolidayData(secondaryYearHolidaysData, 'Secondary');
    
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
    
    console.log('🎯 Final Events Array:', eventsArray.length, 'events for year', currentDisplayYear);
    
    return eventsArray;
  }, [
    // REMOVED selectedDate dependency - only depend on year-related data
    currentDisplayYear,
    primaryIslamicYear,
    secondaryIslamicYear,
    yearHolidaysData,
    secondaryYearHolidaysData
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
  
  // Show loading state - only for the 2 APIs we actually use
  const isLoading = isYearLoading || isYearHolidaysLoading || isSecondaryYearHolidaysLoading;
  
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
