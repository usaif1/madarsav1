import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Bold, Body1Title2Medium, Body1Title2Regular } from '@/components/Typography/Typography';
import LinearGradient from 'react-native-linear-gradient';
import { ShadowColors } from '@/theme/shadows';

const { width } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = scale(339);
const DISABLED_CARD_WIDTH = scale(321);

// Emoji data with day mapping
const BASE_CDN_URL = 'https://cdn.madrasaapp.com/assets/home/';

const emojiData = [
  {
    id: 'mon',
    day: 'Mon',
    emoji: `${BASE_CDN_URL}face-with-thermometer.png`,
    selected: true,
  },
  {
    id: 'tue',
    day: 'Tue',
    emoji: `${BASE_CDN_URL}smiling-face-with-halo.png`,
    selected: true,
  },
  {
    id: 'wed',
    day: 'Wed',
    emoji: `${BASE_CDN_URL}hugging-face.png`,
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
  disabled?: boolean;
}

const FeelingToday: React.FC<FeelingTodayProps> = ({
  onExploreDuasPress = () => console.log('Explore Duas pressed'),
  onEmojiPress = (day) => console.log(`Emoji for ${day} pressed`),
  disabled = false,
}) => {

  const styles = getStyles(disabled);

  return (
    <View style={[styles.container]}>

      {/* Header */}
      <LinearGradient
        colors={['#8A57DC', '#411B7F']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}>
        <Body1Title2Bold style={styles.headerText} color="white">How are you feeling today?</Body1Title2Bold>
      </LinearGradient>

      {/* Emoji Days */}
      <View style={styles.emojiContainer}>
        {emojiData.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.emojiDayContainer}
            onPress={() => onEmojiPress(item.day)}
            disabled={disabled}
            activeOpacity={1.0}>
            {/* Emoji or Icon */}
            <View style={styles.emojiCircle}>
              {item.selected ? (
                item.emoji ? (
                  <FastImage 
                    source={{ uri: item.emoji }} 
                    style={styles.emojiImage}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                ) : (
                  <View style={styles.plusContainer}>
                    <Text style={styles.plusText}>+</Text>
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
        style={[styles.exploreDuasContainer]}
        onPress={onExploreDuasPress}
        activeOpacity={1.0}>
        <Body1Title2Bold color="primary">Explore Dua's</Body1Title2Bold>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrowText}>›</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = (disabled: boolean) => StyleSheet.create<any>({
  container: {
    width: disabled ? DISABLED_CARD_WIDTH : DEFAULT_CARD_WIDTH,
    height: verticalScale(170),
    alignSelf: 'center',
    marginBottom: verticalScale(16),
    borderRadius: scale(8),
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#E5E5E5', // Primitives-Neutral-200
  },
  headerText: {
    fontSize: scale(16),
    lineHeight: scale(16 * 1.45),
    textAlign: 'left',
  },
  header: {
    width: disabled ? DISABLED_CARD_WIDTH : DEFAULT_CARD_WIDTH,
    height: verticalScale(44),
    paddingTop: scale(8),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1, // Primitives/Regular
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: disabled ? scale(0) : scale(16),
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
  },
  emojiText: {
    fontSize: scale(20),
    lineHeight: scale(30),
    textAlign: 'center',
  },
  emojiImage: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
  },
  plusContainer: {
    width: scale(16),
    height: scale(16),
    borderRadius: scale(8),
    backgroundColor: '#8A57DC', // Primitives-Primary-500
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusText: {
    color: '#FFFFFF',
    fontSize: scale(12),
    lineHeight: scale(16),
    textAlign: 'center',
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
    width: disabled ? DISABLED_CARD_WIDTH : DEFAULT_CARD_WIDTH,
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
  arrowText: {
    color: '#FFFFFF',
    fontSize: scale(14),
    lineHeight: scale(14),
    textAlign: 'center',
  },
});

export default FeelingToday;