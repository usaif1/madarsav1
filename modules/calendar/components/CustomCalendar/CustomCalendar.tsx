// modules/calendar/components/CustomCalendar/CustomCalendar.tsx
import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Calendar, DateData} from 'react-native-calendars';
import CalendarDay from './CalendarDay';

// store
import {useThemeStore} from '@/globalStore';
// Assuming you have a text component with Body1Title2Medium style
// If not, we'll use regular Text with appropriate style
import {Body1Title2Medium} from '@/components';

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
  // Assuming radius.md is available, otherwise define it. Using 8 for now.
  const radiusMd = 8; // Replace with theme value if available e.g., radius.md

  const today = new Date();
  const formattedToday = formatDate(today);
  const formattedSelected = formatDate(selectedDate);
  const specialMarkedDate = '2025-02-28'; // Date to show a dot

  // Prepare marked dates using custom styles
  const markedDates: {[key: string]: any} = {}; // Initialize as any or a more specific type

  // Style for today (only if not selected)
  if (formattedToday !== formattedSelected) {
    markedDates[formattedToday] = {
      customStyles: {
        container: {
          backgroundColor: colors.primary.primary300, // Today's background (not selected)
          borderRadius: radiusMd,
        },
        text: {
          color: colors.primary.primary600, 
        },
      },
    };
  }

  // Style for selected date (overrides today if same)
  markedDates[formattedSelected] = {
    selected: true,
    customStyles: {
      container: {
        backgroundColor: colors.primary.primary500, // Selected background
        borderRadius: radiusMd,
      },
      text: {
        color: 'white', // Selected text color
      },
    },
    ...(formattedSelected === specialMarkedDate && { marked: true, dotColor: 'white' }),
  };

  // Handle the dot for the special marked date if it's neither today nor selected
  if (specialMarkedDate !== formattedToday && specialMarkedDate !== formattedSelected) {
    markedDates[specialMarkedDate] = {
      ...(markedDates[specialMarkedDate] || {}),
      marked: true,
      dotColor: colors.primary.primary600,
    };
  }

  // New function to handle day press and logging
  const handleDayPress = (day: DateData) => {
    const newDate = new Date(day.timestamp);
    console.log('Date Selected Event:', day); // Log the event object
    console.log('Selected Date Value:', newDate); // Log the new Date object
    onDateSelect(newDate);
  };

  // Custom Day Names Header component
  const CustomDayHeader = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.dayNamesContainer}>
        {dayNames.map((day, index) => (
          <View key={index} style={styles.dayNameBox}>
            {/* If Body1Title2Medium component exists, use it, otherwise use Text */}
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
      {/* Render custom day names header outside the Calendar */}
      <CustomDayHeader />
      
      <Calendar
        markingType={'custom'}
        markedDates={markedDates}
        onDayPress={handleDayPress}
        hideArrows={true}
        hideExtraDays={true}
        renderHeader={() => null}
        // Hide the default day names row
        customHeader={() => null}
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
            date={date as any}
            state={state as any}
            marking={marking as any}
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
    width: 38, // Match the day cell width
  },
  dayNameText: {
    fontWeight: '500', // Medium font weight for Body1Title2Medium approximation
    fontSize: 14,
    color: '#333338',
  },
});