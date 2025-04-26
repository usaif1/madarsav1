import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import CalendarDay from './CalendarDay';

// store
import {useThemeStore} from '@/globalStore';
import {Body1Title2Medium} from '@/components';

interface CustomCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  month?: number; // 0-based
  year?: number;
}

const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateSelect,
  month,
  year,
}) => {
  const {colors} = useThemeStore();
  const radiusMd = 8;

  // Memoize the current date string to prevent unnecessary re-renders
  const currentDateString = useMemo(() => {
    const displayMonth = typeof month === 'number' ? month : selectedDate.getMonth();
    const displayYear = typeof year === 'number' ? year : selectedDate.getFullYear();
    return `${displayYear}-${(displayMonth + 1).toString().padStart(2, '0')}-01`;
  }, [month, year, selectedDate]);

  const today = new Date();
  const formattedToday = formatDate(today);
  const formattedSelected = formatDate(selectedDate);
  const specialMarkedDate = formatDate(new Date(2025, 3, 26)); // Fixed hardcoded date

  // Prepare marked dates
  const markedDates = useMemo(() => {
    const marked: {[key: string]: any} = {};

    // Style for today (only if not selected)
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

    // Style for selected date (overrides today if same)
    marked[formattedSelected] = {
      selected: true,
      customStyles: {
        container: {
          backgroundColor: colors.primary.primary500,
          borderRadius: radiusMd,
        },
        text: {
          color: 'white',
        },
      },
      ...(formattedSelected === specialMarkedDate && { marked: true, dotColor: 'white' }),
    };

    // Handle the dot for the special marked date
    if (specialMarkedDate !== formattedToday && specialMarkedDate !== formattedSelected) {
      marked[specialMarkedDate] = {
        ...(marked[specialMarkedDate] || {}),
        marked: true,
        dotColor: colors.primary.primary600,
      };
    }

    return marked;
  }, [formattedToday, formattedSelected, specialMarkedDate, colors, radiusMd]);

  const handleDayPress = (day: DateData) => {
    const newDate = new Date(day.timestamp);
    console.log('Date Selected Event:', day);
    console.log('Selected Date Value:', newDate);
    onDateSelect(newDate);
  };

  const CustomDayHeader = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.dayNamesContainer}>
        {dayNames.map((day, index) => (
          <View key={index} style={styles.dayNameBox}>
            {Body1Title2Medium ? (
              <Body1Title2Medium color="heading">{day}</Body1Title2Medium>
            ) : (
              <Text style={styles.dayNameText}>{day}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <CustomDayHeader />
      <Calendar
        key={currentDateString} // Force re-render when month/year changes
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        hideArrows={true}
        hideExtraDays={true}
        renderHeader={() => null}
        customHeader={() => null}
        current={currentDateString}
        theme={{
          calendarBackground: 'white',
          textSectionTitleColor: '#333338',
          dayTextColor: '#333338',
          textDisabledColor: '#AAABB3',
          arrowColor: colors.primary.primary600,
          monthTextColor: colors.primary.primary800,
          textMonthFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 14,
          textDayHeaderFontSize: 14,
        }}
        dayComponent={({date, state, marking}) => (
          <CalendarDay
            date={date}
            state={state}
            marking={marking}
          />
        )}
      />
    </View>
  );
};

export default CustomCalendar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  dayNamesContainer: {
    flexDirection: 'row',
    backgroundColor: '#F0EAFB',
    paddingVertical: 12,
    justifyContent: 'space-around',
    borderRadius: 8,
    marginTop: 8,
    width: '98%',
    alignSelf: 'center',
  },
  dayNameBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
  },
  dayNameText: {
    fontWeight: '500',
    fontSize: 14,
    color: '#333338',
  },
});