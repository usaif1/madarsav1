// modules/calendar/components/CustomCalendar/CustomCalendar.tsx
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Calendar} from 'react-native-calendars';
import CalendarDay from './CalendarDay';

// store
import {useThemeStore} from '@/globalStore';

interface CustomCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

// Helper function to format dates for the calendar
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const {colors} = useThemeStore();
  
  const today = new Date();
  const formattedToday = formatDate(today);
  const formattedSelected = formatDate(selectedDate);

  // Prepare marked dates
  const markedDates = {
    [formattedToday]: {
      selected: formattedToday === formattedSelected,
      marked: true,
      selectedColor: colors.primary.primary300,
    },
    [formattedSelected]: {
      selected: true,
      selectedColor: colors.primary.primary600,
    },
  };

  // Override specific dates like '2025-02-28' to show a dot
  if (formattedSelected !== '2025-02-28') {
    markedDates['2025-02-28'] = {
      marked: true,
      dotColor: '#6D48B8',
    };
  }

  return (
    <View style={styles.container}>
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={day => {
          const newDate = new Date(day.timestamp);
          onDateSelect(newDate);
        }}
        // Hide month navigation arrows
        hideArrows={true}
        // Hide month header with name
        hideExtraDays={true}
        renderHeader={() => null}
        theme={{
          calendarBackground: '#F5F5F7',
          textSectionTitleColor: '#333338',
          selectedDayBackgroundColor: colors.primary.primary600,
          selectedDayTextColor: 'white',
          todayTextColor: colors.primary.primary600,
          dayTextColor: '#333338',
          textDisabledColor: '#AAABB3',
          dotColor: colors.primary.primary600,
          selectedDotColor: 'white',
          arrowColor: colors.primary.primary600,
          monthTextColor: colors.primary.primary800,
          textMonthFontWeight: 'bold',
          textDayFontSize: 14,
          textMonthFontSize: 14,
          textDayHeaderFontSize: 14,
        }}
        // Custom day renderer to show Islamic dates
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
    backgroundColor: '#F5F5F7',
  },
  dayContainer: {
    width: 36,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
});