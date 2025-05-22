import React, {useMemo, useEffect} from 'react';
import {StyleSheet, View, Text, ActivityIndicator} from 'react-native';
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

        // Skip if this is the selected date (to avoid overriding styling)
        if (dateString === formattedSelected) return;

        // Get the corresponding Hijri date
        const hijriDate = dayData.hijri;

        // Add Hijri date to the marking
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
        dayComponent={({date, state, marking}) => (
          <CalendarDay
            date={date}
            state={state as '' | 'disabled' | 'today' | undefined}
            marking={marking}
            onPress={handleDayPress}
          />
        )}
      />
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
