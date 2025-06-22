// modules/calendar/screens/CalendarScreen.tsx
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

// components
import {CustomCalendar, TabBar, PrayerTimesList, FastingView, EventsList} from '../components';
import {Divider} from '@/components';
import CalendarHeader from '../components/CalendarHeader/CalendarHeader';

// hooks
import { useMonthNavigation } from '../hooks/useMonthNavigation';

type TabType = 'salah' | 'fasting' | 'events';

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('salah');
  
  // Use the month navigation hook
  const {
    currentMonth,
    currentYear,
    navigateToNext,
    navigateToPrevious,
    navigateToMonthYear,
    navigateToToday,
    getMonthName,
    getYearString,
  } = useMonthNavigation(selectedDate.getMonth(), selectedDate.getFullYear());

  // Handle Today button press
  const handleTodayPress = () => {
    const today = new Date();
    setSelectedDate(today);
    navigateToToday();
  };

  // When month/year changes from header, update calendar navigation
  const handleMonthYearChange = (month: string, year: string) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = monthNames.indexOf(month);
    const yearNum = parseInt(year, 10);
    navigateToMonthYear(monthIndex, yearNum);
    // Set selectedDate to first day of the selected month/year
    setSelectedDate(new Date(yearNum, monthIndex, 1));
  };

  // Handle calendar month change from swipe gestures
  const handleCalendarMonthChange = (direction: 'next' | 'prev') => {
    if (direction === 'next') {
      navigateToNext();
    } else {
      navigateToPrevious();
    }
  };

  // Get current month and year as strings for CalendarHeader
  const currentMonthName = getMonthName();
  const currentYearString = getYearString();
  
  // Check if the selected date is today
  const today = new Date();
  const isTodaySelected = (
    selectedDate.getDate() === today.getDate() &&
    selectedDate.getMonth() === today.getMonth() &&
    selectedDate.getFullYear() === today.getFullYear()
  );

  return (
    <View style={styles.container}>
      <CalendarHeader 
        onMonthYearChange={handleMonthYearChange}
        currentMonth={currentMonthName}
        currentYear={currentYearString}
        selectedDate={selectedDate}
      />
      <CustomCalendar 
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
        month={currentMonth}
        year={currentYear}
        onMonthChange={handleCalendarMonthChange}
      />
      <Divider color='#F5F5F5' height={10} />
      <TabBar 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onTodayPress={handleTodayPress}
        isTodaySelected={isTodaySelected}
      />
      <Divider height={10} />
      <View style={{flex: 1,backgroundColor: 'white'}}>
      {activeTab === 'salah' && <PrayerTimesList selectedDate={selectedDate} />}
      {activeTab === 'fasting' && <FastingView selectedDate={selectedDate} />}
      {activeTab === 'events' && <EventsList 
        selectedDate={selectedDate} 
        displayMonth={currentMonth} 
        displayYear={currentYear} 
      />}
      </View>
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});