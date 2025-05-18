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
import FajrIcon from '@/assets/home/fajr.svg';
import DhuhrIcon from '@/assets/home/dhuhr.svg';
import AsrIcon from '@/assets/home/asr.svg';
import MaghribIcon from '@/assets/home/maghrib.svg';
import IshaIcon from '@/assets/home/isha.svg';
import { Image } from 'react-native';

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
    icon: FajrIcon,
  },
  dhuhr: {
    name: 'Dhuhr',
    time: '12:27',
    icon: DhuhrIcon,
  },
  asr: {
    name: 'Asr',
    time: '3:21',
    icon: AsrIcon,
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
const calculateBallPosition = (currentPrayer: PrayerType): { left: number, top: number } => {
  // Arc width is 280, so we need to map 5 prayer times to positions along the arc
  const arcWidth = scale(280);
  
  // Calculate the position based on prayer time
  switch (currentPrayer) {
    case 'fajr':
      return { 
        left: scale(20), 
        top: scale(120) 
      };
    case 'dhuhr':
      return { 
        left: scale(70), 
        top: scale(70) 
      };
    case 'asr':
      return { 
        left: scale(140), 
        top: scale(10) 
      };
    case 'maghrib':
      return { 
        left: scale(210), 
        top: scale(70) 
      };
    case 'isha':
      return { 
        left: scale(260), 
        top: scale(120) 
      };
    default:
      return { 
        left: scale(140), 
        top: scale(40) 
      };
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
  const ballPosition = calculateBallPosition(currentPrayer);
  
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
          {/* Prayer Icon and Name with Time Left */}
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.iconNameContainer}>
                <View style={{flexDirection:'row',width:'100%',justifyContent:'space-between'}}>
                  <View style={{flexDirection: 'row'}}>
                <currentPrayerData.icon width={scale(24)} height={scale(24)} fill="white" />
                <H4Bold color="white" style={styles.prayerTitle}>{currentPrayerData.name}</H4Bold>
                </View>
                {/* Day Pill */}
              <View style={styles.dayPill}>
                <Body2Bold color="white">{day}</Body2Bold>
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
    width: scale(75),
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
