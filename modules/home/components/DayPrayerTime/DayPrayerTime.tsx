import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Regular, Body1Title2Bold, Body2Medium, Body2Bold, H4Bold } from '@/components/Typography/Typography';
import LinearGradient from 'react-native-linear-gradient';
import { ShadowColors } from '@/theme/shadows';
import {
  FazrIcon,
  SunriseIcon,
  DhuhrAsrIcon,
  MaghribIcon,
  IshaIcon,
} from '@/assets/calendar';

const { width } = Dimensions.get('window');
const CARD_WIDTH = scale(339);
const CARD_HEIGHT = verticalScale(279);

// Prayer time types
type PrayerType = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

// Prayer time data structure
interface PrayerTimeData {
  name: string;
  time: string;
  icon: React.FC<any>;
}

// Prayer times data
const prayerTimes: Record<string, PrayerTimeData> = {
  fajr: {
    name: 'Fajr',
    time: '5:51',
    icon: FazrIcon,
  },
  dhuhr: {
    name: 'Dhuhr',
    time: '12:27',
    icon: DhuhrAsrIcon,
  },
  asr: {
    name: 'Asr',
    time: '3:21',
    icon: DhuhrAsrIcon,
  },
  maghrib: {
    name: 'Maghrib',
    time: '5:40',
    icon: MaghribIcon,
  },
  isha: {
    name: 'Isha',
    time: '7:04',
    icon: IshaIcon,
  },
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
const calculateBallPosition = (currentPrayer: PrayerType, prayerTimes: Record<string, PrayerTimeData>): { left: number, top: number } => {
  // For now, return fixed positions based on the prayer type
  // In a real app, this would calculate based on current time relative to prayer times
  switch (currentPrayer) {
    case 'fajr':
      return { left: scale(30), top: scale(198) };
    case 'dhuhr':
      return { left: scale(100), top: scale(198) };
    case 'asr':
      return { left: scale(199), top: scale(198) }; // Center
    case 'maghrib':
      return { left: scale(250), top: scale(198) };
    case 'isha':
      return { left: scale(280), top: scale(198) };
    default:
      return { left: scale(199), top: scale(198) }; // Center
  }
};

interface DayPrayerTimeProps {
  currentPrayer: PrayerType;
  timeLeft: string;
  day: string;
}

const DayPrayerTime: React.FC<DayPrayerTimeProps> = ({
  currentPrayer = 'asr',
  timeLeft = '1h 29m 3s left',
  day = 'Sunday',
}) => {
  // Get gradient colors and direction based on current prayer
  const gradientColors = getGradientColors(currentPrayer);
  const gradientDirection = getGradientDirection(currentPrayer);
  
  // Calculate ball position
  const ballPosition = calculateBallPosition(currentPrayer, prayerTimes);
  
  // Get current prayer data
  const currentPrayerData = prayerTimes[currentPrayer];
  
  // Create array of all prayer times for display
  const allPrayerTimes = Object.keys(prayerTimes).map(key => ({
    key,
    ...prayerTimes[key as PrayerType],
    isCurrent: key === currentPrayer,
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        start={gradientDirection.start}
        end={gradientDirection.end}
        style={styles.gradientContainer}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Prayer Icon and Name */}
            <View style={styles.iconContainer}>
              <currentPrayerData.icon width={scale(24)} height={scale(24)} fill="#FFFFFF" />
            </View>
            
            <View style={styles.nameContainer}>
              <H4Bold color="white">{currentPrayerData.name}</H4Bold>
              <Body2Medium color="white">{timeLeft}</Body2Medium>
            </View>
          </View>
          
          {/* Day Pill */}
          <View style={styles.dayPill}>
            <Body2Bold color="white">{day}</Body2Bold>
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
                fill="#FFFFFF" 
                style={prayer.isCurrent ? styles.currentIcon : styles.icon} 
              />
              
              {/* Prayer Name */}
              {prayer.isCurrent ? (
                <Body1Title2Bold color="white" style={styles.prayerName}>
                  {prayer.name}
                </Body1Title2Bold>
              ) : (
                <Body1Title2Regular color="white" style={styles.prayerName}>
                  {prayer.name}
                </Body1Title2Regular>
              )}
              
              {/* Prayer Time */}
              {prayer.isCurrent ? (
                <Body1Title2Bold color="white" style={styles.prayerTime}>
                  {prayer.time}
                </Body1Title2Bold>
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
          <View style={styles.arc} />
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
  },
  gradientContainer: {
    flex: 1,
    padding: scale(16),
  },
  header: {
    width: scale(307),
    height: verticalScale(43),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(20),
  },
  iconContainer: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameContainer: {
    width: scale(223),
    height: verticalScale(43),
    gap: scale(2),
  },
  dayPill: {
    width: scale(64),
    height: verticalScale(21),
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
  prayerTime: {
    fontSize: scale(14),
    textAlign: 'center',
  },
  arcContainer: {
    flex: 1,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: scale(20),
  },
  arc: {
    width: scale(280),
    height: scale(140),
    borderTopLeftRadius: scale(140),
    borderTopRightRadius: scale(140),
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderBottomWidth: 0,
    position: 'absolute',
    bottom: 0,
  },
  ball: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: '#FFFFFF',
    position: 'absolute',
  },
});

export default DayPrayerTime;
