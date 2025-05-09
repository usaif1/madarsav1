// NextSalah.tsx
import React from 'react';
import {View, TouchableOpacity, StyleSheet, ActivityIndicator} from 'react-native';

// components
import NextSalahIcon from '@/assets/compass/next_salah_icon.svg';
import {Body2Bold, Body2Medium, Title3Bold} from '@/components';
import {useThemeStore} from '@/globalStore';

// hooks
import {useNextPrayer, formatPrayerTime, getNextPrayerName} from '@/api/hooks/usePrayerTimes';
import {useLocation} from '@/api/hooks/useLocation';

const NextSalah: React.FC = () => {
  const {colors} = useThemeStore();

  // Get user location
  const {latitude, longitude, loading: locationLoading, error: locationError} = useLocation();

  // Get next prayer time
  const {
    data: nextPrayerData,
    isLoading: nextPrayerLoading,
    error: nextPrayerError,
  } = useNextPrayer(latitude || undefined, longitude || undefined);

  // Extract next prayer information
  const isLoading = locationLoading || nextPrayerLoading;
  const error = locationError || nextPrayerError;

  // Get next prayer name and time
  const nextPrayerName = nextPrayerData && nextPrayerData.data?.timings ? 
    getNextPrayerName(nextPrayerData.data.timings) : '';
  
  const nextPrayerTime = nextPrayerData && nextPrayerData.data?.timings ? 
    Object.values(nextPrayerData.data.timings)[0] as string : '';
  
  const {formattedTime, timeRemaining} = formatPrayerTime(nextPrayerTime);

  // Log data for debugging
  React.useEffect(() => {
    console.log('Next Prayer Data:', {nextPrayerName, nextPrayerTime, formattedTime, timeRemaining});
  }, [nextPrayerName, nextPrayerTime, formattedTime, timeRemaining]);

  return (
    <View style={styles.container}>
      <NextSalahIcon />

      <View style={styles.textBlock}>
        {isLoading ? (
          <ActivityIndicator size="small" color={colors.primary.primary500} />
        ) : error ? (
          <Body2Medium color="warning">Unable to fetch prayer time</Body2Medium>
        ) : (
          <>
            <Title3Bold>{nextPrayerName || 'Next Prayer'}</Title3Bold>
            <Body2Medium color="sub-heading">{timeRemaining || 'Loading...'}</Body2Medium>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[styles.pill, {backgroundColor: colors.warning.warning600}]}>
        <Body2Bold color="white">Next Salah</Body2Bold>
      </TouchableOpacity>
    </View>
  );
};

export default NextSalah;

/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F6FF', // light grey row bg
    paddingHorizontal: 20,
    paddingVertical: 12,
    columnGap: 10,
  },

  /* ---- left icon ---- */
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#11111A', // dark square bg for your icon
    marginRight: 16,
  },

  /* ---- text block ---- */
  textBlock: {
    flex: 1,
  },

  /* ---- pill button ---- */
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#B67A19', // brown‑orange from screenshot
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
