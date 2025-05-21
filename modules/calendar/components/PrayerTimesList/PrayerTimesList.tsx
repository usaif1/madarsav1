// modules/calendar/components/PrayerTimesList/PrayerTimesList.tsx
import React from 'react';
import {View, StyleSheet, FlatList, ActivityIndicator, Text} from 'react-native';
import {Body1Title2Bold, Body1Title2Medium} from '@/components';
import {
  FazrIcon,
  SunriseIcon,
  DhuhrAsrIcon,
  MaghribIcon,
  IshaIcon,
} from '@/assets/calendar';
import {useThemeStore} from '@/globalStore';
import {verticalScale, scale} from '@/theme/responsive';
import {useCalendarPrayerTimes, formatPrayerTime} from '../../hooks/useCalendarPrayerTimes';

interface PrayerTimeItem {
  id: string;
  name: string;
  time: string;
  icon: React.ReactNode;
}

interface PrayerTimesListProps {
  selectedDate: Date;
}

const PrayerTimesList: React.FC<PrayerTimesListProps> = ({selectedDate}) => {
  const {colors} = useThemeStore();
  
  console.log('PrayerTimesList: Rendering with selectedDate:', selectedDate);
  
  const {data, isLoading, error} = useCalendarPrayerTimes(selectedDate);
  
  console.log('PrayerTimesList: API response status:', {
    hasData: !!data,
    isLoading,
    hasError: !!error,
    errorDetails: error instanceof Error ? error.message : String(error)
  });
  
  // Convert API data to our component format
  const getPrayerTimesFromAPI = (): PrayerTimeItem[] => {
    if (!data || !data.data || !data.data.timings) {
      console.warn('PrayerTimesList: No prayer time data available');
      return [];
    }
    
    const timings = data.data.timings;
    
    console.log('PrayerTimesList: Raw prayer time data:', {
      fajr: timings.Fajr,
      sunrise: timings.Sunrise,
      dhuhr: timings.Dhuhr,
      asr: timings.Asr,
      maghrib: timings.Maghrib,
      isha: timings.Isha
    });
    
    return [
      { id: 'fajr', name: 'Fajr', time: formatPrayerTime(timings.Fajr), icon: <FazrIcon /> },
      { id: 'sunrise', name: 'Sunrise', time: formatPrayerTime(timings.Sunrise), icon: <SunriseIcon /> },
      { id: 'dhuhr', name: 'Dhuhr', time: formatPrayerTime(timings.Dhuhr), icon: <DhuhrAsrIcon /> },
      { id: 'asr', name: 'Asr', time: formatPrayerTime(timings.Asr), icon: <DhuhrAsrIcon /> },
      { id: 'maghrib', name: 'Maghrib', time: formatPrayerTime(timings.Maghrib), icon: <MaghribIcon /> },
      { id: 'isha', name: 'Isha', time: formatPrayerTime(timings.Isha), icon: <IshaIcon /> },
    ];
  };
  
  const prayerTimes = getPrayerTimesFromAPI();
  console.log('PrayerTimesList: Formatted prayer times:', prayerTimes);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.primary600} />
        <Text style={styles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading prayer times</Text>
        <Text style={styles.errorSubtext}>{error instanceof Error ? error.message : String(error)}</Text>
      </View>
    );
  }
  
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
              borderBottomColor: colors.primary.primary100,
              height: verticalScale(44),
              paddingTop: verticalScale(6),
              paddingBottom: verticalScale(6),
              paddingLeft: scale(20),
              paddingRight: scale(20),
              gap: scale(10),
              marginBottom: verticalScale(6)
            },
          ]}>
          <View style={styles.leftContent}>
            <View
              style={[
                styles.iconContainer,
                {
                  borderRadius: scale(8),
                  borderColor: colors.primary.primary100,
                  backgroundColor: colors.primary.primary50,
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
    width: scale(32),
    height: scale(32),
    borderRadius: scale(8),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    marginLeft: scale(12),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  loadingText: {
    marginTop: scale(10),
    fontSize: scale(14),
    color: '#737373',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  errorText: {
    fontSize: scale(16),
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: scale(8),
  },
  errorSubtext: {
    fontSize: scale(14),
    color: '#737373',
    textAlign: 'center',
  }
});