import React, {useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import CalendarDay from './CalendarDay';
import {useThemeStore} from '@/globalStore';
import {Body1Title2Medium} from '@/components';
import {islamicEvents} from '../../data/eventsData';
import type { lightColors } from '@/theme/lightColors';
import { scale, verticalScale } from '@/theme/responsive';

interface CustomCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  month?: number;
  year?: number;
}

// Helper: Map event IDs to theme color keys
type ThemeColors = typeof lightColors;
type EventColorGetter = (colors: ThemeColors) => string;

const EVENT_COLORS: Record<string, EventColorGetter> = {
  'ramadan-start': (colors) => colors.primary.primary600,
  'eid-al-fitr': (colors) => colors.success.success500,
  'eid-al-adha': (colors) => colors.error.error600,
  'islamic-new-year': (colors) => colors.info.info600,
  'laylatul-qadr': (colors) => colors.accent.accent600,
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateSelect,
  month,
  year,
}) => {
  const {colors} = useThemeStore();
  const radiusMd = scale(8);

  const currentDateString = useMemo(() => {
    const displayMonth = typeof month === 'number' ? month : selectedDate.getMonth();
    const displayYear = typeof year === 'number' ? year : selectedDate.getFullYear();
    return `${displayYear}-${(displayMonth + 1).toString().padStart(2, '0')}-01`;
  }, [month, year, selectedDate]);

  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const formattedSelected = selectedDate.toISOString().split('T')[0];

  // Build markedDates using islamicEvents
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

    // Add Islamic holidays from islamicEvents
    islamicEvents.forEach(event => {
      const dateString = event.gregorianDateRange.start.toISOString().split('T')[0];
      if (dateString !== formattedSelected) { // Don't override selected date styling
        marked[dateString] = {
          ...marked[dateString],
          marked: true,
          dotColor: EVENT_COLORS[event.id] ? EVENT_COLORS[event.id](colors) : colors.primary.primary600,
          holidayName: event.title,
        };
      }
    });

    return marked;
  }, [formattedToday, formattedSelected, colors, radiusMd]);

  const handleDayPress = (day: DateData) => {
    const newDate = new Date(day.timestamp);
    onDateSelect(newDate);
  };

  const CustomDayHeader = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={[styles.dayNamesContainer, {backgroundColor: colors.primary.primary100, borderRadius: radiusMd, paddingVertical: verticalScale(12), marginTop: verticalScale(8)}]}>
        {dayNames.map((day, index) => (
          <View key={index} style={[styles.dayNameBox, {width: scale(38)}]}>
            {Body1Title2Medium ? (
              <Body1Title2Medium color="heading">{day}</Body1Title2Medium>
            ) : (
              <Text style={[styles.dayNameText, {color: colors.secondary.neutral800, fontSize: scale(14)}]}>{day}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: colors.primary.primary50}]}> 
      <CustomDayHeader />
      <Calendar
        key={currentDateString}
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        hideArrows={true}
        hideExtraDays={true}
        renderHeader={() => null}
        customHeader={() => null}
        current={currentDateString}
        theme={{
          calendarBackground: colors.primary.primary50,
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
            state={state}
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
    // backgroundColor set inline for theme
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