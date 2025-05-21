// modules/calendar/components/FastingView/FastingView.tsx
import React, {useState} from 'react';
import {View, StyleSheet, Pressable, ScrollView, ActivityIndicator, Text} from 'react-native';
import {Body1Title2Bold, Body1Title2Medium, Body2Medium, Title3Bold} from '@/components';
import {FazrIcon, MaghribIcon, FazrWhiteIcon, MaghribWhiteIcon,SehriDua, IftarDua} from '@/assets/calendar';
import {ShadowColors} from '@/theme/shadows';
import {scale, verticalScale} from '@/theme/responsive';

// store
import {useThemeStore} from '@/globalStore';

// hooks
import {useCalendarWithLocation, formatPrayerTime} from '../../hooks/useCalendar';

interface FastingViewProps {
  selectedDate: Date;
}

const FastingView: React.FC<FastingViewProps> = ({selectedDate}: FastingViewProps) => {
  const {colors} = useThemeStore();
  const [activeType, setActiveType] = useState<'sehri' | 'iftar'>('sehri');
  
  console.log('FastingView: Rendering with selectedDate:', selectedDate);
  
  const {data, isLoading, error} = useCalendarWithLocation(selectedDate);
  
  console.log('FastingView: API response status:', {
    hasData: !!data,
    isLoading,
    hasError: !!error,
    errorDetails: error instanceof Error ? error.message : String(error)
  });
  
  if (data) {
    console.log('FastingView: Prayer time data available:', {
      hasPrayerTime: !!data.prayerTime,
      fajrTime: data.prayerTime?.fajr,
      maghribTime: data.prayerTime?.maghrib
    });
  }
  
  // Get fasting times from API data
  const sehriTime = data ? formatPrayerTime(data.prayerTime.fajr) : ''; // Sehri time is Fajr time
  const iftarTime = data ? formatPrayerTime(data.prayerTime.maghrib) : ''; // Iftar time is Maghrib time
  
  console.log('FastingView: Formatted times:', { sehriTime, iftarTime });

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
              {activeType === 'sehri' ? <FazrWhiteIcon width={scale(16)} height={scale(16)} /> : <FazrIcon width={scale(16)} height={scale(16)} />}
            </View>
            <Body1Title2Medium>{sehriTime}</Body1Title2Medium>
            <Body2Medium color="sub-heading">Sehri time</Body2Medium>
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
              {activeType === 'iftar' ? <MaghribWhiteIcon width={scale(16)} height={scale(16)} /> : <MaghribIcon width={scale(16)} height={scale(16)} />}
            </View>
            <Body1Title2Medium>{iftarTime}</Body1Title2Medium>
            <Body2Medium color="sub-heading">Iftar time</Body2Medium>
          </Pressable>
        </View>
      </View>
      <View style={styles.duaSvgWrapper}>
        {activeType === 'sehri' ? (
          <SehriDua width="100%" height={verticalScale(160)} style={styles.duaSvg} />
        ) : (
          <IftarDua width="100%" height={verticalScale(160)} style={styles.duaSvg} />
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
    marginTop: verticalScale(8),
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