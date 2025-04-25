// modules/calendar/screens/CalendarScreen.tsx
import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';

// components
// import {CustomCalendar, TabBar, PrayerTimesList, FastingView, EventsList} from '../components';
import {Divider} from '@/components';

type TabType = 'salah' | 'fasting' | 'events' | 'today';

const CalendarScreen: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<TabType>('salah');

  return (
    <View style={styles.container}>
      {/* <CustomCalendar 
        onDateSelect={setSelectedDate}
        selectedDate={selectedDate}
      /> */}
      <Divider height={10} />
      {/* <TabBar activeTab={activeTab} onTabChange={setActiveTab} /> */}
      <Divider height={10} />
      
      {/* {activeTab === 'salah' && <PrayerTimesList selectedDate={selectedDate} />}
      {activeTab === 'fasting' && <FastingView selectedDate={selectedDate} />}
      {activeTab === 'events' && <EventsList selectedDate={selectedDate} />} */}
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});