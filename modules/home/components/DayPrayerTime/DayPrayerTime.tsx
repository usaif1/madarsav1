import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Regular, Body1Title2Bold, Body2Medium, Body2Bold, H4Bold, Body1Title2Medium } from '@/components/Typography/Typography';
import LinearGradient from 'react-native-linear-gradient';
import { ShadowColors } from '@/theme/shadows';
import FajrIcon from '@/assets/home/fajr.svg';
import DhuhrIcon from '@/assets/home/dhuhr.svg';
import AsrIcon from '@/assets/home/asr.svg';
import MaghribIcon from '@/assets/home/maghrib.svg';
import IshaIcon from '@/assets/home/isha.svg';
import { Image } from 'react-native';
import { usePrayerTimes, PrayerType } from '../../hooks/usePrayerTimes';
import { useThemeStore } from '@/globalStore';

const { width } = Dimensions.get('window');
const CARD_WIDTH = scale(339);
const CARD_HEIGHT = verticalScale(279);

// Map prayer types to their icons
const prayerIcons: Record<string, React.FC<any>> = {
  fajr: FajrIcon,
  dhuhr: DhuhrIcon,
  asr: AsrIcon,
  maghrib: MaghribIcon,
  isha: IshaIcon,
};

// Get gradient colors based on prayer type
const getGradientColors = (prayer: PrayerType): string[] => {
  switch (prayer) {
    case 'fajr':
    case 'dhuhr':
      return ['#E0F2FE', '#36BFFA']; // Day time gradient
    case 'asr':
      return ['#DC6803', '#FFFAEB']; // Afternoon gradient
    case 'maghrib':
    case 'isha':
      return ['#411B7F', '#0B0515']; // Night time gradient
    default:
      return ['#411B7F', '#0B0515']; // Default to night time
  }
};

// Get gradient direction based on prayer type
const getGradientDirection = (prayer: PrayerType): { start: { x: number, y: number }, end: { x: number, y: number } } => {
  switch (prayer) {
    case 'fajr':
    case 'dhuhr':
      return { start: { x: 0, y: 1 }, end: { x: 0, y: 0 } }; // Bottom to top
    case 'asr':
      return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }; // Top to bottom
    case 'maghrib':
    case 'isha':
      return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }; // Diagonal
    default:
      return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }; // Default diagonal
  }
};

// Calculate position of the indicator ball on the arc
const calculateBallPosition = (currentPrayer: PrayerType): { left: number, top: number } => {
  // Arc width is 280, so we need to map 5 prayer times to positions along the arc
  const arcWidth = scale(280);

  // Calculate the position based on prayer time
  switch (currentPrayer) {
    case 'fajr':
      return { 
        left: scale(20), 
        top: scale(50) 
      };
    case 'dhuhr':
      return { 
        left: scale(70), 
        top: scale(20) 
      };
    case 'asr':
      return { 
        left: scale(140), 
        top: scale(10) 
      };
    case 'maghrib':
      return { 
        left: scale(210), 
        top: scale(25) 
      };
    case 'isha':
      return { 
        left: scale(270), 
        top: scale(65) 
      };
    default:
      return { 
        left: scale(140), 
        top: scale(40) 
      };
  }
};

interface DayPrayerTimeProps {}

const DayPrayerTime: React.FC<DayPrayerTimeProps> = () => {
  const { colors } = useThemeStore();
  const { 
    prayerTimes, 
    currentPrayer, 
    nextPrayer, 
    timeLeft, 
    dayName, 
    isLoading, 
    error,
    usingFallback,
    fallbackSource,
    refreshLocation
  } = usePrayerTimes();
  
  // The hook now provides fallback location information
  // If loading, show loading indicator
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#8A57DC" />
        <Text style={styles.loadingText}>Loading prayer times...</Text>
      </View>
    );
  }

  // If error, show error message
  if (error) {
    return (
      <View style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Error loading prayer times</Text>
        <Text style={styles.errorSubtext}>{error instanceof Error ? error.message : String(error)}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => refreshLocation()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Get gradient colors and direction based on current prayer
  const gradientColors = getGradientColors(currentPrayer);
  const gradientDirection = getGradientDirection(currentPrayer);
  
  // Calculate ball position
  const ballPosition = calculateBallPosition(currentPrayer);
  
  // Get next prayer data for the header
  const NextPrayerIcon = prayerIcons[nextPrayer];
  const nextPrayerName = prayerTimes[nextPrayer]?.name || '';
  const nextPrayerTime = prayerTimes[nextPrayer]?.time || '';
  
  // Create array of all prayer times for display
  const allPrayerTimes = Object.keys(prayerTimes).map(key => {
    // Remove AM/PM from time display
    let timeDisplay = prayerTimes[key]?.time || '';
    timeDisplay = timeDisplay.replace(/\s(AM|PM)$/i, '');
    
    return {
      key,
      name: prayerTimes[key]?.name || '',
      time: timeDisplay,
      icon: prayerIcons[key],
      isCurrent: key === currentPrayer,
    };
  });

  return (
    <View style={styles.container}>
      {usingFallback && (
        <View style={styles.fallbackBanner}>
          <Text style={styles.fallbackText}>
            {fallbackSource?.includes('custom_') 
              ? `Using ${fallbackSource.replace('custom_', '')} as location reference` 
              : 'Using estimated location'}
          </Text>
        </View>
      )}
      <LinearGradient
        colors={gradientColors}
        start={gradientDirection.start}
        end={gradientDirection.end}
        style={styles.gradientContainer}>
        
        {/* Header Section */}
        <View style={styles.header}>
          {/* Prayer Icon and Name with Time Left */}
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.iconNameContainer}>
                <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                  <View style={{flexDirection: 'row'}}>
                {NextPrayerIcon && <NextPrayerIcon width={scale(24)} height={scale(24)} fill="white" />}
                <H4Bold color="white" style={styles.prayerTitle}>{nextPrayerName}</H4Bold>
                </View>
                {/* Day Pill */}
              <View style={styles.dayPill}>
                <Body2Bold color="white">{dayName}</Body2Bold>
              </View></View>
                <View style={{flexDirection: 'row'}}>
            {/* Time Left */}
            <Body2Medium color="white" style={styles.timeLeft}>{timeLeft}</Body2Medium></View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Prayer Times Row */}
        <View style={styles.prayerTimesRow}>
          {allPrayerTimes.map((prayer) => (
            <View 
              key={prayer.key} 
              style={[
                styles.prayerTimeItem,
                prayer.isCurrent && styles.currentPrayerItem
              ]}>
              {/* Prayer Icon */}
              <prayer.icon 
                width={scale(24)} 
                height={scale(24)} 
                fill="white" 
                style={prayer.isCurrent ? styles.currentIcon : styles.icon} 
              />
              
              {/* Prayer Name */}
              {prayer.isCurrent ? (
                <Body1Title2Bold color="white" style={styles.prayerNameBold}>
                  {prayer.name}
                </Body1Title2Bold>
              ) : (
                <Body1Title2Medium color="white" style={styles.prayerName}>
                  {prayer.name}
                </Body1Title2Medium>
              )}
              
              {/* Prayer Time */}
              {prayer.isCurrent ? (
                <Body1Title2Regular color="white" style={styles.prayerTime}>
                  {prayer.time}
                </Body1Title2Regular>
              ) : (
                <Body1Title2Regular color="white" style={styles.prayerTime}>
                  {prayer.time}
                </Body1Title2Regular>
              )}
            </View>
          ))}
        </View>
        
        {/* Arc with Ball Indicator */}
        <View style={styles.arcContainer}>
          <Image 
            source={require('@/assets/home/arc.png')} 
            style={styles.arcImage} 
            resizeMode="contain"
          />
          <View style={[styles.ball, { left: ballPosition.left, top: ballPosition.top }]} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
    marginBottom: verticalScale(16),
    borderRadius: scale(8),
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: ShadowColors['border-light'],
    paddingBottom: 0,
    position: 'relative',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: scale(10),
    fontSize: scale(14),
    color: '#737373',
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
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
    marginBottom: scale(12),
  },
  retryButton: {
    backgroundColor: '#8A57DC',
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    borderRadius: scale(20),
    marginTop: scale(8),
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    fontWeight: '600',
  },
  fallbackBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(251, 191, 36, 0.9)',
    paddingVertical: scale(4),
    zIndex: 10,
  },
  fallbackText: {
    fontSize: scale(12),
    color: '#78350F',
    textAlign: 'center',
    fontWeight: '500',
  },
  gradientContainer: {
    flex: 1,
    padding: scale(16),
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    marginBottom: scale(16),
  },
  headerContent: {
    width: '100%',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(2),
  },
  iconNameContainer: {
    alignItems: 'flex-start',
  },
  prayerTitle: {
    marginLeft: scale(8),
  },
  timeLeft: {
    marginLeft: scale(4), // Align with the prayer name (24px icon + 8px gap + 12px margin)
  },
  dayPill: {
    maxWidth: scale(90),
    paddingVertical: scale(2),
    paddingHorizontal: scale(10),
    borderRadius: scale(60),
    backgroundColor: 'rgba(255, 255, 255, 0.27)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerTimesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scale(24),
  },
  prayerTimeItem: {
    width: scale(63),
    height: verticalScale(72),
    alignItems: 'center',
    gap: scale(8),
    opacity: 0.5,
  },
  currentPrayerItem: {
    opacity: 1,
  },
  icon: {
    opacity: 0.7,
  },
  currentIcon: {
    opacity: 1,
  },
  prayerName: {
    fontSize: scale(14),
    textAlign: 'center',
  },
  prayerNameBold: {
    fontSize: scale(14),
    textAlign: 'center',
    fontWeight: '700',
  },
  prayerTime: {
    fontSize: scale(14),
    textAlign: 'center',
  },
  arcContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 0,
    width: '100%',
    overflow: 'hidden',
  },
  arcImage: {
    width: scale(340),
    height: scale(140),
    marginLeft: scale(-1),
    marginRight: scale(-1),
  },
  ball: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: 'white',
    position: 'absolute',
  },
});

export default DayPrayerTime;
