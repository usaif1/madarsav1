import React, {useMemo, useEffect, useRef} from 'react';
import {StyleSheet, View, Text, ActivityIndicator, PanResponder, Animated} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import CalendarDay from './CalendarDay';
import {useThemeStore} from '@/globalStore';
import {Body1Title2Medium} from '@/components';
// Comment out local data in favor of API
// import { islamicEvents } from '../../data/eventsData';
import type {lightColors} from '@/theme/lightColors';
import {scale, verticalScale} from '@/theme/responsive';

// Import Hijri Calendar API hooks
import {useHijriCalendar, useSpecialDays} from '../../hooks/useHijriCalendar';
import {formatDate} from '../../utils/dateUtils';

interface CustomCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  month?: number;
  year?: number;
  onMonthChange?: (month: number, year: number) => void;
}

// Helper: Map event IDs to theme color keys
type ThemeColors = typeof lightColors;
type EventColorGetter = (colors: ThemeColors) => string;

const EVENT_COLORS: Record<string, EventColorGetter> = {
  'ramadan-start': colors => colors.primary.primary600,
  'eid-al-fitr': colors => colors.success.success500,
  'eid-al-adha': colors => colors.error.error600,
  'islamic-new-year': colors => colors.info.info600,
  'laylatul-qadr': colors => colors.accent.accent600,
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateSelect,
  month,
  year,
  onMonthChange,
}) => {
  const {colors} = useThemeStore();
  const radiusMd = scale(8);
  
  // Animation values for swipe
  const pan = useRef(new Animated.ValueXY()).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Get the current display month and year
  const displayMonth =
    typeof month === 'number' ? month + 1 : selectedDate.getMonth() + 1;
  const displayYear =
    typeof year === 'number' ? year : selectedDate.getFullYear();

  const currentDateString = useMemo(() => {
    return `${displayYear}-${displayMonth.toString().padStart(2, '0')}-01`;
  }, [displayMonth, displayYear]);

  // Fetch Hijri calendar data for the current month
  const {
    data: hijriCalendarData,
    isLoading: isHijriCalendarLoading,
    error: hijriCalendarError,
  } = useHijriCalendar(displayMonth, displayYear);

  // Fetch special days data
  const {data: specialDaysData, isLoading: isSpecialDaysLoading} =
    useSpecialDays();

  // Log API responses for debugging
  useEffect(() => {
    if (hijriCalendarData) {
      console.log('Hijri Calendar API response:', hijriCalendarData);
    }
    if (specialDaysData) {
      console.log('Special Days API response:', specialDaysData);
    }
  }, [hijriCalendarData, specialDaysData]);

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const formattedSelected = selectedDate.toISOString().split('T')[0];

  // Build markedDates using API data
  const markedDates = useMemo(() => {
    const marked: {[key: string]: any} = {};

    // Mark today if not selected
    if (formattedToday !== formattedSelected) {
      marked[formattedToday] = {
        customStyles: {
          container: {
            backgroundColor: colors.primary.primary300,
            borderRadius: radiusMd,
          },
          text: {
            color: colors.primary.primary600,
          },
        },
      };
    }

    // Mark selected date
    marked[formattedSelected] = {
      selected: true,
      customStyles: {
        container: {
          backgroundColor: colors.primary.primary600,
          borderRadius: radiusMd,
        },
        text: {
          color: 'white',
        },
      },
    };

    // Add Hijri dates and holidays from API data
    if (hijriCalendarData?.data) {
      const calendarData = hijriCalendarData.data;

      // Process each day in the calendar
      calendarData.forEach(dayData => {
        if (!dayData || !dayData.gregorian || !dayData.hijri) return;

        // Parse the gregorian date from the API response
        const gregorianDate = dayData.gregorian;
        const dateObj = new Date(
          `${gregorianDate.year}-${gregorianDate.month.number
            .toString()
            .padStart(2, '0')}-${gregorianDate.day
            .toString()
            .padStart(2, '0')}`,
        );
        const dateString = dateObj.toISOString().split('T')[0];

        // Get the corresponding Hijri date
        const hijriDate = dayData.hijri;

        // Add Hijri date to the marking (merge with existing data)
        marked[dateString] = {
          ...marked[dateString],
          hijriDate: {
            day: hijriDate.day,
            month: hijriDate.month.en,
            year: hijriDate.year,
          },
        };

        // Check if this day has any holidays
        if (hijriDate.holidays && hijriDate.holidays.length > 0) {
          marked[dateString] = {
            ...marked[dateString],
            marked: true,
            dotColor: colors.primary.primary600,
            holidayName: hijriDate.holidays[0],
          };
        }
      });
    }

    return marked;
  }, [formattedToday, formattedSelected, colors, radiusMd, hijriCalendarData]);

  const handleDayPress = (day: DateData) => {
    const newDate = new Date(day.timestamp);
    onDateSelect(newDate);
  };

  // Handle month navigation
  const handleMonthNavigation = (direction: 'next' | 'prev') => {
    if (!onMonthChange) return;
    
    const currentMonth = typeof month === 'number' ? month : selectedDate.getMonth();
    const currentYear = typeof year === 'number' ? year : selectedDate.getFullYear();
    
    let newMonth = currentMonth;
    let newYear = currentYear;
    
    if (direction === 'next') {
      newMonth = currentMonth + 1;
      if (newMonth > 11) {
        newMonth = 0;
        newYear = currentYear + 1;
      }
    } else {
      newMonth = currentMonth - 1;
      if (newMonth < 0) {
        newMonth = 11;
        newYear = currentYear - 1;
      }
    }
    
    console.log('CustomCalendar: Navigating to month', newMonth, 'year', newYear);
    onMonthChange(newMonth, newYear);
  };

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to horizontal swipes
        return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Only allow horizontal movement
        pan.x.setValue(gestureState.dx);
        
        // Fade out as we swipe
        const absX = Math.abs(gestureState.dx);
        const maxDistance = 150; // Max swipe distance
        const newOpacity = Math.max(0.6, 1 - (absX / maxDistance) * 0.4);
        opacity.setValue(newOpacity);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dx, vx } = gestureState;
        const isSwipeRight = dx > 80 || vx > 0.3;
        const isSwipeLeft = dx < -80 || vx < -0.3;

        if (isSwipeRight) {
          // Swipe right - go to previous month (like turning a page backwards)
          console.log('Swiping right - going to previous month');
          Animated.parallel([
            Animated.timing(pan.x, { toValue: 300, duration: 200, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          ]).start(() => {
            handleMonthNavigation('prev');
            // Reset animations for next month
            pan.x.setValue(-300);
            opacity.setValue(0);
            
            requestAnimationFrame(() => {
              Animated.parallel([
                Animated.spring(pan.x, { toValue: 0, useNativeDriver: true, friction: 7, tension: 40 }),
                Animated.spring(opacity, { toValue: 1, useNativeDriver: true, friction: 7, tension: 40 }),
              ]).start();
            });
          });
        } else if (isSwipeLeft) {
          // Swipe left - go to next month (like turning a page forwards)
          console.log('Swiping left - going to next month');
          Animated.parallel([
            Animated.timing(pan.x, { toValue: -300, duration: 200, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          ]).start(() => {
            handleMonthNavigation('next');
            // Reset animations for next month
            pan.x.setValue(300);
            opacity.setValue(0);
            
            requestAnimationFrame(() => {
              Animated.parallel([
                Animated.spring(pan.x, { toValue: 0, useNativeDriver: true, friction: 7, tension: 40 }),
                Animated.spring(opacity, { toValue: 1, useNativeDriver: true, friction: 7, tension: 40 }),
              ]).start();
            });
          });
        } else {
          // Not enough swipe, return to center
          Animated.parallel([
            Animated.spring(pan.x, { toValue: 0, useNativeDriver: true, friction: 5 }),
            Animated.spring(opacity, { toValue: 1, useNativeDriver: true, friction: 5 }),
          ]).start();
        }
      },
    })
  ).current;

  const CustomDayHeader = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <View
        style={[
          styles.dayNamesContainer,
          {
            backgroundColor: colors.primary.primary100,
            borderRadius: radiusMd,
            paddingVertical: verticalScale(12),
            marginTop: verticalScale(8),
          },
        ]}>
        {dayNames.map((day, index) => (
          <View key={index} style={[styles.dayNameBox, {width: scale(38)}]}>
            {Body1Title2Medium ? (
              <Body1Title2Medium color="heading">{day}</Body1Title2Medium>
            ) : (
              <Text
                style={[
                  styles.dayNameText,
                  {color: colors.secondary.neutral800, fontSize: scale(14)},
                ]}>
                {day}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  // Show loading state while fetching calendar data
  if (isHijriCalendarLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary.primary600} />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: 'white'}]}>
      <CustomDayHeader />
      <Animated.View 
        style={[
          {
            transform: [{ translateX: pan.x }],
            opacity: opacity,
          }
        ]}
        {...panResponder.panHandlers}
      >
        <Calendar
          key={currentDateString}
          markingType={'custom'}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          hideArrows={false}
          hideExtraDays={true}
          renderHeader={() => null}
          customHeader={() => null}
          current={currentDateString}
          style={{backgroundColor: 'white'}}
          onMonthChange={monthData => {
            const newMonth = monthData.month - 1; // Convert to 0-indexed month
            const newYear = monthData.year;
            if (onMonthChange) {
              console.log('Calendar onMonthChange called:', newMonth, newYear);
              onMonthChange(newMonth, newYear);
            }
          }}
          theme={{
            calendarBackground: 'white',
            textSectionTitleColor: colors.secondary.neutral800,
            dayTextColor: colors.secondary.neutral800,
            textDisabledColor: colors.secondary.neutral300,
            arrowColor: colors.primary.primary600,
            monthTextColor: colors.primary.primary800,
            textMonthFontWeight: 'bold',
            textDayFontSize: scale(14),
            textMonthFontSize: scale(14),
            textDayHeaderFontSize: scale(14),
          }}
          dayComponent={({date, state, marking}) => {
            if (!date) return null;
            return (
              <CalendarDay
                date={date}
                state={state as '' | 'disabled' | 'today' | undefined}
                marking={marking}
                onPress={handleDayPress}
              />
            );
          }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
    minHeight: verticalScale(300),
  },
  dayNamesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // paddingVertical, borderRadius, marginTop set inline for theme/responsive
    width: '98%',
    alignSelf: 'center',
  },
  dayNameBox: {
    alignItems: 'center',
    justifyContent: 'center',
    // width set inline for responsive
  },
  dayNameText: {
    fontWeight: '500',
    // fontSize set inline for responsive
  },
});

export default CustomCalendar;
