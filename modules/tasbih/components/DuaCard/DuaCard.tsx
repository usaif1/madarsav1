import React from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Body1Title2Bold, Body1Title2Medium } from '@/components';
import { useThemeStore } from '@/globalStore';
import ArrowLeft from '@/assets/profile/arrowleft.svg';
import ArrowRight from '@/assets/profile/arrowright.svg';
import Hamburger from '@/assets/profile/hamburger.svg';
import { scale } from '@/theme/responsive';

interface DuaCardProps {
  arabic: string;
  transliteration: string;
  translation: string;
  onPrev: () => void;
  onNext: () => void;
  onChangeDua: () => void;
}

const DuaCard: React.FC<DuaCardProps> = ({ arabic, transliteration, translation, onPrev, onNext, onChangeDua }) => {
  const { colors } = useThemeStore();
  const { width } = useWindowDimensions();
  // Responsive scaling - increased by 20 as requested
  const cardWidth = Math.min(width - 32, 363); // Increased from 343 to 363

  return (
    <View style={[styles.cardContainer, { width: cardWidth }]}> 
      <LinearGradient
        colors={['#FEFAEC', '#FCEFC7']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[styles.card, { width: cardWidth }]}
      >
        {/* Arabic Text */}
        <View style={styles.arabicWrap}>
          <Body1Title2Medium
            color="accent-yellow-900"
            style={[styles.arabic]}>{arabic}</Body1Title2Medium>
        </View>
        {/* First Divider */}
        <View style={styles.dashedLine} />
        {/* Transliteration with Navigation Controls */}
        <View style={styles.transRowWrap}>
          <View style={[styles.transBg]}> 
            <Body1Title2Medium
              color="accent-yellow-800"
              style={[styles.transliteration]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {transliteration}
            </Body1Title2Medium>
          </View>
        </View>
        {/* Second Divider */}
        <View style={styles.dashedLine} />
        {/* Translation inside card, with truncation and background */}
        <View style={[styles.translationBg]}> 
          <Body1Title2Medium
            color="accent-yellow-800"
            style={[styles.translation]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {translation}
          </Body1Title2Medium>
        </View>
      </LinearGradient>
      {/* Navigation buttons positioned at the middle of the card's sides */}
      <Pressable 
        onPress={onPrev} 
        style={[styles.arrowBtn, styles.arrowLeft]} 
        hitSlop={8} 
        accessibilityLabel="Previous dua"
      >
        <ArrowLeft width={16} height={16} />
      </Pressable>
      <Pressable 
        onPress={onNext} 
        style={[styles.arrowBtn, styles.arrowRight]} 
        hitSlop={8} 
        accessibilityLabel="Next dua"
      >
        <ArrowRight width={16} height={16} />
      </Pressable>
      {/* Change Dua Button positioned at bottom center */}
      <Pressable 
        style={styles.changeDuaBtn} 
        onPress={onChangeDua} 
        accessibilityLabel="Change dua"
      >
        <Hamburger width={18} height={18} style={{ marginRight: 4 }} />
        <Body1Title2Bold color="white">Change dua</Body1Title2Bold>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 40,
    alignSelf: 'center',
  },
  card: {
    height: 280, // Adjusted height to work with the bottom-positioned button
    borderRadius: 16,
    paddingTop: 20,
    paddingRight: 24,
    paddingLeft: 24,
    paddingBottom: 24, // Increased bottom padding
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  arabicWrap: {
    alignItems: 'center',
    marginBottom: 8,
  },
  arabic: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 38,
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: '#9A7E2A',
    borderStyle: 'dashed',
    alignSelf: 'center',
    marginVertical: 8,
  },
  transRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 40,
  },
  transBg: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'stretch',
    minWidth: '60%',
  },
  transliteration: {
    fontSize: 17,
    textAlign: 'center',
    fontWeight: '700',
  },
  translationBg: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'stretch',
    marginTop: 8,
    marginBottom: 8,
    minHeight: 44,
    maxHeight: 48,
    justifyContent: 'center',
  },
  translation: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 22,
  },
  arrowBtn: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    backgroundColor: '#F9DF90',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%', // Middle of card height
    transform: [{ translateY: -12 }], // Half of button height for centering
    zIndex: 2,
    padding: 2,
  },
  arrowLeft: {
    left: -12,
  },
  arrowRight: {
    right: -12,
  },
  changeDuaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 36,
    borderRadius: 60,
    backgroundColor: '#9A7E2A',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#9A7E2A',
    position: 'absolute',
    bottom: -18, // Position halfway outside the card
    left: '50%', // Center horizontally
    transform: [{ translateX: -70 }], // Half of button width for centering
    zIndex: 3,
  },
});

export default DuaCard;