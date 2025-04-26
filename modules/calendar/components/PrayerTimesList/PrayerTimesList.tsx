// modules/calendar/components/PrayerTimesList/PrayerTimesList.tsx
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Body1Title2Bold, Body1Title2Medium} from '@/components';
import {
  FazrIcon,
  SunriseIcon,
  DhuhrAsrIcon,
  MaghribIcon,
  IshaIcon,
} from '@/assets/calendar';

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
    { id: 'fazr', name: 'Fazr', time: '5:45 AM', icon: <FazrIcon /> },
    { id: 'sunrise', name: 'Sunrise', time: '5:45 AM', icon: <SunriseIcon /> },
    { id: 'dhuhr', name: 'Dhuhr', time: '5:45 AM', icon: <DhuhrAsrIcon /> },
    { id: 'asr', name: 'Asr', time: '5:45 AM', icon: <DhuhrAsrIcon /> },
    { id: 'maghrib', name: 'Maghrib', time: '5:45 AM', icon: <MaghribIcon /> },
    { id: 'isha', name: 'Isha', time: '5:45 AM', icon: <IshaIcon /> },
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
          <Body1Title2Medium color="sub-heading">{item.time}</Body1Title2Medium>
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