import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Bold, Body1Title2Medium, Body1Title2Regular } from '@/components/Typography/Typography';
import LinearGradient from 'react-native-linear-gradient';
import ExploreArrow from '@/assets/home/explore-dua-arrow.svg';
import PlusIcon from '@/assets/home/plus.svg';

const { width } = Dimensions.get('window');
const CARD_WIDTH = scale(339);

// Emoji data with day mapping
const emojiData = [
  {
    id: 'mon',
    day: 'Mon',
    emoji: '🤒',
    selected: true,
  },
  {
    id: 'tue',
    day: 'Tue',
    emoji: '😇',
    selected: true,
  },
  {
    id: 'wed',
    day: 'Wed',
    emoji: '🤗',
    selected: true,
  },
  {
    id: 'thu',
    day: 'Thu',
    emoji: null, // Plus icon for Thursday
    selected: true,
  },
  {
    id: 'fri',
    day: 'Fri',
    emoji: null, // Empty for Friday
    selected: false,
  },
  {
    id: 'sat',
    day: 'Sat',
    emoji: null, // Empty for Saturday
    selected: false,
  },
  {
    id: 'sun',
    day: 'Sun',
    emoji: null, // Empty for Sunday
    selected: false,
  },
];

interface FeelingTodayProps {
  onExploreDuasPress?: () => void;
  onEmojiPress?: (day: string) => void;
}

const FeelingToday: React.FC<FeelingTodayProps> = ({
  onExploreDuasPress = () => console.log('Explore Duas pressed'),
  onEmojiPress = (day) => console.log(`Emoji for ${day} pressed`),
}) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#8A57DC', '#411B7F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <Body1Title2Bold color="white">How are you feeling today?</Body1Title2Bold>
      </LinearGradient>

      {/* Emoji Days */}
      <View style={styles.emojiContainer}>
        {emojiData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.emojiDayContainer}
            onPress={() => onEmojiPress(item.day)}
            activeOpacity={0.7}>
            {/* Emoji or Icon */}
            <View style={styles.emojiCircle}>
              {item.selected ? (
                item.emoji ? (
                  <Text style={styles.emojiText}>{item.emoji}</Text>
                ) : (
                  <View style={styles.plusContainer}>
                    <PlusIcon width={scale(16.25)} height={scale(16.25)} fill="#FFFFFF" />
                  </View>
                )
              ) : (
                <View style={styles.emptyCircle} />
              )}
            </View>
            
            {/* Day Text */}
            <Body1Title2Medium style={[
              styles.dayText,
              !item.selected && styles.inactiveDayText
            ]}>
              {item.day}
            </Body1Title2Medium>
          </TouchableOpacity>
        ))}
      </View>

      {/* Footer - Explore Duas */}
      <TouchableOpacity
        style={styles.exploreDuasContainer}
        onPress={onExploreDuasPress}
        activeOpacity={0.7}>
        <Body1Title2Bold color="primary">Explore Dua's</Body1Title2Bold>
        <View style={styles.arrowContainer}>
          <ExploreArrow width={scale(14.625)} height={scale(14.625)} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    height: verticalScale(170),
    alignSelf: 'center',
    marginBottom: verticalScale(16),
    borderRadius: scale(8),
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E5E5E5', // Primitives-Neutral-200
  },
  header: {
    width: CARD_WIDTH,
    height: verticalScale(44),
    paddingTop: scale(8),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1, // Primitives/Regular
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    backgroundColor: '#FFFFFF',
  },
  emojiDayContainer: {
    width: scale(45.57),
    height: verticalScale(56),
    alignItems: 'center',
    gap: scale(6),
  },
  emojiCircle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5', // For Thursday plus button background
  },
  emojiText: {
    fontSize: scale(20),
    lineHeight: scale(30),
    textAlign: 'center',
  },
  plusContainer: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    backgroundColor: '#8A57DC', // Primitives-Primary-500
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCircle: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    borderWidth: 1.5,
    borderColor: '#D4D4D4', // Primitives-Neutral-300
    borderStyle: 'dashed',
  },
  dayText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: scale(14),
    lineHeight: scale(14 * 1.45),
    letterSpacing: 0,
    textAlign: 'center',
    color: '#171717', // Tokens/Heading-main
  },
  inactiveDayText: {
    fontWeight: '400',
    color: '#A3A3A3', // Primitives-Neutral-400
  },
  exploreDuasContainer: {
    width: CARD_WIDTH,
    height: verticalScale(38),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(14),
    gap: scale(4),
    backgroundColor: '#F9F6FF', // Primitives-Primary-50
    borderTopWidth: 1, // Primitives/Regular
    borderTopColor: '#E5E5E5',
  },
  arrowContainer: {
    width: scale(18),
    height: scale(18),
    borderRadius: scale(9),
    backgroundColor: '#8A57DC', // Primitives-Primary-500
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FeelingToday;
