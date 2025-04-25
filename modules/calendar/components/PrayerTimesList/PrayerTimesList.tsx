// modules/calendar/components/PrayerTimesList/PrayerTimesList.tsx
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Body1Title2Bold, Body2Medium} from '@/components';

interface PrayerTime {
  id: string;
  name: string;
  time: string;
  icon: React.ReactNode; // This would be your SVG component
}

interface PrayerTimesListProps {
  selectedDate: Date;
}

// Mock data - in real app, you would fetch this based on location and date
const getPrayerTimes = (date: Date): PrayerTime[] => {
  // This would be replaced with actual API call or calculation
  return [
    { id: 'fajr', name: 'Fajr', time: '5:45 AM', icon: <></> },
    { id: 'sunrise', name: 'Sunrise', time: '5:45 AM', icon: <></> },
    { id: 'dhuhr', name: 'Dhuhr', time: '5:45 AM', icon: <></> },
    { id: 'asr', name: 'Asr', time: '5:45 AM', icon: <></> },
    { id: 'maghrib', name: 'Maghrib', time: '5:45 AM', icon: <></> },
    { id: 'isha', name: 'Isha', time: '5:45 AM', icon: <></> },
  ];
};

const PrayerTimesList: React.FC<PrayerTimesListProps> = ({selectedDate}) => {
  const prayerTimes = getPrayerTimes(selectedDate);
  
  return (
    <FlatList
      data={prayerTimes}
      keyExtractor={item => item.id}
      renderItem={({item}) => (
        <View style={styles.item}>
          <View style={styles.leftContent}>
            {item.icon}
            <Body1Title2Bold color="heading" style={styles.name}>
              {item.name}
            </Body1Title2Bold>
          </View>
          <Body2Medium color="sub-heading">{item.time}</Body2Medium>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
};

export default PrayerTimesList;

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginLeft: 12,
  }
});