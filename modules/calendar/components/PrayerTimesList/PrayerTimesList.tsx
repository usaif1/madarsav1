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
import {useThemeStore} from '@/globalStore';
import {ShadowColors} from '@/theme/shadows';

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
  const {colors} = useThemeStore();
  const prayerTimes = getPrayerTimes(selectedDate);
  
  return (
    <FlatList
      data={prayerTimes}
      keyExtractor={item => item.id}
      renderItem={({item, index}) => (
        <View
          style={[
            styles.item,
            {
              borderBottomWidth: index !== prayerTimes.length - 1 ? 0.8 : 0,
              borderBottomColor: ShadowColors['border-light'],
              height: 44,
              paddingTop: 6,
              paddingBottom: 6,
              paddingLeft: 20,
              paddingRight: 20,
              gap: 10,
              marginBottom: 6
            },
          ]}>
          <View style={styles.leftContent}>
          <View
            style={[
              styles.iconContainer,
              {
                borderRadius: 8,
              },
            ]}>
            {item.icon}
          </View>
            <Body1Title2Bold color="heading" style={styles.name}>
              {item.name}
            </Body1Title2Bold>
          </View>
          <Body1Title2Medium color="sub-heading">{item.time}</Body1Title2Medium>
        </View>
      )}
    />
  );
};

export default PrayerTimesList;

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8, 
    borderWidth: 1,
    borderColor: '#F5F4FB', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginLeft: 12,
  }
});