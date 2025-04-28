// modules/calendar/screens/CalendarScreen.tsx
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

// components
import {CustomCalendar, TabBar, PrayerTimesList, FastingView, EventsList} from '../components';
import {Divider} from '@/components';
import CalendarHeader from '../components/CalendarHeader/CalendarHeader';

type TabType = 'salah' | 'fasting' | 'events';

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('salah');
  // Track month and year for CustomCalendar
  const [calendarMonth, setCalendarMonth] = useState(selectedDate.getMonth()); // 0-based
  const [calendarYear, setCalendarYear] = useState(selectedDate.getFullYear());

  // When month/year changes, update selectedDate to first of month
  const handleMonthYearChange = (month: string, year: string) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthIndex = monthNames.indexOf(month);
    const yearNum = parseInt(year, 10);
    setCalendarMonth(monthIndex);
    setCalendarYear(yearNum);
    // Set selectedDate to first day of the selected month/year
    setSelectedDate(new Date(yearNum, monthIndex, 1));
  };

  return (
    <View style={styles.container}>
      <CalendarHeader 
        onMonthYearChange={handleMonthYearChange}
      />
      <CustomCalendar 
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
        month={calendarMonth}
        year={calendarYear}
      />
      <Divider color='#F5F5F5' height={10} />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      <Divider height={10} />
      <View style={{flex: 1,backgroundColor: 'white'}}>
      {activeTab === 'salah' && <PrayerTimesList selectedDate={selectedDate} />}
      {activeTab === 'fasting' && <FastingView selectedDate={selectedDate} />}
      {activeTab === 'events' && <EventsList selectedDate={selectedDate} />}
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