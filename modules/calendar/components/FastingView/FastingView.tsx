// modules/calendar/components/FastingView/FastingView.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Pressable, ScrollView, ActivityIndicator, Text} from 'react-native';
import {Body1Title2Bold, Body1Title2Medium, Body2Medium, Title3Bold} from '@/components';
// icons
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import {ShadowColors} from '@/theme/shadows';
import {scale, verticalScale} from '@/theme/responsive';

// store
import {useThemeStore} from '@/globalStore';

// hooks
import {useLocation} from '@/api/hooks/useLocation';
import {usePrayerTimes} from '@/api/hooks/usePrayerTimes';

interface FastingViewProps {
  selectedDate: Date;
}

/**
 * Helper function to format date for API in DD-MM-YYYY format
 * @param date Date to format
 * @returns Formatted date string
 */
const formatDateForAPI = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
};

const FastingView: React.FC<FastingViewProps> = ({selectedDate}: FastingViewProps) => {
  const {colors} = useThemeStore();
  const [activeType, setActiveType] = useState<'sehri' | 'iftar'>('sehri');
  
  console.log('FastingView: Rendering with selectedDate:', selectedDate);
  
  // Get location data
  const { latitude, longitude, loading: locationLoading, error: locationError } = useLocation();
  
  // Format date for prayer times API (DD-MM-YYYY)
  const formattedDate = formatDateForAPI(selectedDate);
  
  // Fetch prayer times using the prayer times API
  const { data: prayerData, isLoading: prayerLoading, error: prayerError } = usePrayerTimes(
    latitude || undefined,
    longitude || undefined,
    formattedDate
  );
  
  // Combine loading and error states
  const isLoading = locationLoading || prayerLoading;
  const error = locationError || prayerError;
  
  console.log('FastingView: API response status:', {
    hasData: !!prayerData,
    isLoading,
    hasError: !!error,
    errorDetails: error instanceof Error ? error.message : String(error)
  });
  
  if (prayerData) {
    console.log('FastingView: Prayer time data available:', {
      hasTimings: !!prayerData.data.timings,
      imsakTime: prayerData.data.timings.Imsak,
      maghribTime: prayerData.data.timings.Maghrib
    });
  }
  
  // Get fasting times from API data
  const sehriTime = prayerData ? formatTimeString(prayerData.data.timings.Imsak) : ''; // Sehri time is Imsak time
  const iftarTime = prayerData ? formatTimeString(prayerData.data.timings.Maghrib) : ''; // Iftar time is Maghrib time
  
  console.log('FastingView: Formatted times:', { sehriTime, iftarTime });
  
  // Helper function to format time string from API (HH:MM format) to readable format (H:MM AM/PM)
  function formatTimeString(timeStr: string): string {
    if (!timeStr) return '';
    
    // Parse the time (format from API is typically HH:MM)
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    // Format with leading zeros for minutes
    return `${hours12}:${minutes < 10 ? '0' + minutes : minutes} ${period}`;
  }

  const styles = getStyles(colors);
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary.primary600} />
        <Text style={styles.loadingText}>Loading fasting times...</Text>
      </View>
    );
  }
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading fasting times</Text>
        <Text style={styles.errorSubtext}>{error instanceof Error ? error.message : String(error)}</Text>
      </View>
    );
  }
  
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.timesRowWrapper}>
        <View style={styles.timesContainer}>
          {/* Sehri Pressable */}
          <Pressable
            style={[
              styles.timeBox,
              {
                flex: 1,
                maxWidth: scale(180),
                height: verticalScale(110),
                borderRadius: scale(12),
                borderWidth: 1,
                paddingTop: verticalScale(12),
                paddingRight: scale(20),
                paddingBottom: verticalScale(12),
                paddingLeft: scale(20),
                gap: scale(8),
                backgroundColor: activeType === 'sehri' ? colors.primary.primary100 : 'white',
                borderColor: activeType === 'sehri' ? colors.primary.primary300 : ShadowColors['border-light'],
              },
            ]}
            onPress={() => setActiveType('sehri')}>
            <View
              style={[
                styles.iconContainer,
                {
                  borderRadius: scale(6),
                  width: scale(24),
                  height: scale(24),
                  backgroundColor: activeType === 'sehri' ? colors.primary.primary500 : 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <CdnSvg 
                path={activeType === 'sehri' ? DUA_ASSETS.CALENDAR_FAZR_WHITE : DUA_ASSETS.CALENDAR_FAZR} 
                width={scale(16)} 
                height={scale(16)} 
                fill={activeType === 'sehri' ? 'white' : undefined}
              />
            </View>
            <Title3Bold>{sehriTime}</Title3Bold>
            <Body1Title2Medium color="sub-heading">Sehri time</Body1Title2Medium>
          </Pressable>

          {/* Iftar Pressable */}
          <Pressable
            style={[
              styles.timeBox,
              {
                flex: 1,
                maxWidth: scale(180),
                height: verticalScale(110),
                borderRadius: scale(12),
                borderWidth: 1,
                paddingTop: verticalScale(12),
                paddingRight: scale(20),
                paddingBottom: verticalScale(12),
                paddingLeft: scale(20),
                gap: scale(8),
                backgroundColor: activeType === 'iftar' ? colors.primary.primary100 : 'white',
                borderColor: activeType === 'iftar' ? colors.primary.primary300 : ShadowColors['border-light'],
              },
            ]}
            onPress={() => setActiveType('iftar')}>
            <View
              style={[
                styles.iconContainer,
                {
                  borderRadius: scale(6),
                  width: scale(24),
                  height: scale(24),
                  backgroundColor: activeType === 'iftar' ? colors.primary.primary500 : 'white',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
            >
              <CdnSvg 
                path={activeType === 'iftar' ? DUA_ASSETS.CALENDAR_MAGHRIB_WHITE : DUA_ASSETS.CALENDAR_MAGHRIB} 
                width={scale(16)} 
                height={scale(16)} 
                fill={activeType === 'iftar' ? 'white' : undefined}
              />
            </View>
            <Title3Bold>{iftarTime}</Title3Bold>
            <Body1Title2Medium color="sub-heading">Iftar time</Body1Title2Medium>
          </Pressable>
        </View>
      </View>
      <View style={styles.duaSvgWrapper}>
        {activeType === 'sehri' ? (
          <CdnSvg 
            path={DUA_ASSETS.CALENDAR_SEHRI_DUA}
            width={scale(375)} // Width of the container
            height={verticalScale(160)}
            style={[styles.duaSvg, { width: '100%' }]}
          />
        ) : (
          <CdnSvg 
            path={DUA_ASSETS.CALENDAR_IFTAR_DUA}
            width={scale(375)} // Width of the container
            height={verticalScale(160)}
            style={[styles.duaSvg, { width: '100%' }]}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default FastingView;

const getStyles =  (colors: any) => StyleSheet.create({
  container: {
    padding: scale(16),
  },
  timesRowWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    columnGap: scale(8),
    marginBottom: verticalScale(12),
    width: '100%',
    maxWidth: scale(400),
    alignSelf: 'center',
  },
  timeBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(60),
    // backgroundColor and borderColor set inline for theme/selection
    borderWidth: 1,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  duaSvgWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(-12),
    flexGrow: 1,
  },
  duaSvg: {
    width: '100%',
    maxWidth: '100%',
    minWidth: scale(200),
    alignSelf: 'center',
    aspectRatio: 335/160, // maintain aspect ratio
  },
  duaContainer: {
    borderRadius: scale(12),
    padding: scale(16),
    backgroundColor: colors.primary.primary50,
  },
  duaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(16),
  },
  duaLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary.primary300,
  },
  duaContent: {
    alignItems: 'center',
  },
  arabicText: {
    textAlign: 'center',
    marginBottom: verticalScale(8),
    fontSize: scale(24),
    lineHeight: verticalScale(36),
  },
  translationText: {
    textAlign: 'center',
    color: colors.primary.primary500,
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
  },
});