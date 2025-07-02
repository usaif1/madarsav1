// dependencies
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Carousel from 'react-native-snap-carousel';

// components
import {Body1Title2Regular, H4Bold} from '@/components';
import {Divider} from '@/components';
import PrayerTimesGraphic from './PrayerTimesGraphic';
import FeelingToday from '@/modules/home/components/FeelingToday/FeelingToday';
import SplashDuaCard from './SplashDuaCard';

// store
import {useThemeStore} from '@/globalStore';
import DecliningDayGraphic from './DecliningDayGraphic';
import PrayerBeads from './PrayerBeads';
import { scale } from '@/theme/responsive';

const {width: SCREEN_WIDTH} = Dimensions.get('window');

type SlideContent = {title: string; description: string};

interface Slide {
  id: number;
  content: SlideContent;
}

interface ProgressSegmentProps {
  progress: Animated.Value;
  style?: StyleProp<ViewStyle>;
}

const slides: Slide[] = [
  {
    id: 1,
    content: {
      title: 'Your Spiritual Companion',
      description:
        'Your Complete Islamic Worship App: Quran, Hadith, Prayer Times, Qibla, Zakat, Tasbih and Spiritual Tools—All in One Place.',
    },
  },
  {
    id: 2,
    content: {
      title: 'Nourish Your Soul',
      description:
        'Spiritual Healing at Your Fingertips Dua, Galleries, Mood Tracking—Your Divine Path to Inner Peace.',
    },
  },
  {
    id: 3,
    content: {
      title: 'Combining Deen & Dunya',
      description:
        'Modern tech education rooted in Islamic principles—coding, design, and business skills taught within a traditional Maktab framework.',
    },
  },
];

const ProgressSegment: React.FC<ProgressSegmentProps> = ({progress, style}) => {
  const {colors} = useThemeStore();

  return (
    <Animated.View
      style={[
        styles.segmentFill,
        {backgroundColor: colors.primary.primary600},
        style,
        {
          width: progress.interpolate({
            inputRange: [0, 1],
            outputRange: ['0%', '100%'],
          }),
        },
      ]}
    />
  );
};

export default function App() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const progressAnims = useRef<Animated.Value[]>([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const carouselRef = useRef<Carousel<Slide>>(null);

  useEffect(() => {
    progressAnims.forEach((anim, index) => {
      if (index < activeIndex) {
        anim.setValue(1);
      }
      if (index > activeIndex) {
        anim.setValue(0);
      }
    });

    const currentAnim = progressAnims[activeIndex];
    currentAnim.setValue(0);

    const animation = Animated.timing(currentAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    });

    animation.start(({finished}) => {
      if (finished && activeIndex < slides.length - 1) {
        const newIndex = activeIndex + 1;
        setActiveIndex(newIndex);
        carouselRef.current?.snapToItem(newIndex);
      }
    });

    return () => animation.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  const handleSnapToItem = (index: number) => setActiveIndex(index);

  const renderItem = ({item}: {item: Slide}) => {
    // Render different graphics based on slide ID
    const renderSlideGraphics = () => {
      switch (item.id) {
        case 1:
          // First slide - Prayer Times, Declining Day, and Prayer Beads
          return (
            <View>
              <PrayerTimesGraphic />
              <Divider height={10} />
              <View
                style={{flexDirection: 'row', alignItems: 'flex-start', columnGap: 10}}>
                <DecliningDayGraphic />
                <PrayerBeads />
              </View>
            </View>
          );
        case 2:
          // Second slide - Feelings and Dua Card Graphics
          return (
            <View style={styles.graphicsContainer}>
              {/* <FastImage 
                source={{ uri: 'https://cdn.madrasaapp.com/assets/splash/FeelingsGraphic.png' }} 
                style={styles.feelingsImage} 
                resizeMode={FastImage.resizeMode.cover}
              />
              <Divider height={9} />
              <FastImage 
                source={{ uri: 'https://cdn.madrasaapp.com/assets/splash/DuaCardGraphic.png' }} 
                style={styles.duaCardImage} 
                resizeMode={FastImage.resizeMode.cover}
              /> */}
              <FeelingToday disabled={true} />
              <SplashDuaCard />
            </View>
          );
        case 3:
          // Third slide - Deen and Duniya Graphics
          return (
            <View style={styles.graphicsContainer}>
               <FastImage 
                source={{ uri: 'https://cdn.madrasaapp.com/assets/splash/MaktabGraphic.png' }} 
                style={styles.slideImage} 
                resizeMode={FastImage.resizeMode.contain}
              />
              <FastImage 
                source={{ uri: 'https://cdn.madrasaapp.com/assets/splash/DeenGraphic2.png' }} 
                style={[styles.slideImage, {marginTop: scale(-20)}]} 
                resizeMode={FastImage.resizeMode.contain}
              />
              <FastImage 
                source={{ uri: 'https://cdn.madrasaapp.com/assets/splash/DuniyaGraphic2.png' }} 
                style={[styles.slideImage, {marginTop: scale(-20)}]} 
                resizeMode={FastImage.resizeMode.contain}
              />
            </View>
          );
        default:
          return null;
      }
    };

    return (
      <View style={styles.slide}>
        <H4Bold>{item.content.title}</H4Bold>
        <Divider height={6} />
        <Body1Title2Regular color="sub-heading" style={{textAlign: 'center'}}>
          {item.content.description}
        </Body1Title2Regular>
        <Divider height={22} />
        {renderSlideGraphics()}
      </View>
    );
  };

  const {colors} = useThemeStore();

  return (
    <>
      <View style={styles.progressContainer}>
        {progressAnims.map((progress, index) => (
          <View
            key={index}
            style={[
              styles.segmentContainer,
              {backgroundColor: colors.primary.primary100},
            ]}>
            <ProgressSegment progress={progress} />
          </View>
        ))}
      </View>

      <Carousel<Slide>
        ref={carouselRef}
        data={slides}
        renderItem={renderItem}
        sliderWidth={SCREEN_WIDTH}
        itemWidth={SCREEN_WIDTH}
        onSnapToItem={handleSnapToItem}
        enableMomentum={false}
        lockScrollWhileSnapping={true}
      />
    </>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    width: 375,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
    gap: 4,
  },
  segmentContainer: {
    flex: 1,
    height: 4,
    borderRadius: 3,
    overflow: 'hidden',
  },
  segmentFill: {
    height: '100%',
    borderRadius: 3,
  },
  slide: {
    width: SCREEN_WIDTH,
    paddingHorizontal: 27,
    paddingTop: 18,
    alignItems: 'center',
  },
  graphicsContainer: {
    maxWidth:scale(321),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  slideImage: {
    width: SCREEN_WIDTH - 54, // Account for horizontal padding
    height: 150,
  },
  feelingsImage: {
    width: scale(321),
    height: scale(145),
    borderRadius: 16,
  },
  duaCardImage: {
    width: scale(321),
    height: scale(186.97),
    borderRadius: 13.7,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  dayText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: '#4285F4',
    padding: 18,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
