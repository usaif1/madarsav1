// DuaCard.tsx
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
  const styles = getStyles(colors);
  const cardWidth = Math.min(width - 32, 363);

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
              color="yellow-800"
              style={[styles.transliteration]}
              numberOfLines={3}
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
            color="yellow-800"
            style={[styles.translation]}
            numberOfLines={3}
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
      {/* Change Dua Button positioned at bottom center - Fixed onPress handler */}
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

const getStyles = (colors:any) => StyleSheet.create({
  cardContainer: {
    position: 'relative',
    marginTop: scale(16),
    marginBottom: scale(40),
    alignSelf: 'center',
  },
  card: {
    height: scale(280),
    borderRadius: scale(16),
    paddingTop: scale(20),
    paddingRight: scale(24),
    paddingLeft: scale(24),
    paddingBottom: scale(24),
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    shadowColor: '#000', // overridden inline
    shadowOpacity: 0.06,
    shadowRadius: scale(8),
    elevation: 2,
  },
  arabicWrap: {
    alignItems: 'center',
    marginBottom: scale(8),
  },
  arabic: {
    fontSize: scale(20),
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: scale(28),
  },
  dashedLine: {
    width: '100%',
    height: 1,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    alignSelf: 'center',
    marginVertical: scale(8),
    borderColor: colors.accent.accent700,
  },
  transRowWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: scale(40),
  },
  transBg: {
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    alignSelf: 'stretch',
    minWidth: '60%',
  },
  transliteration: {
    fontSize: scale(14),
    textAlign: 'center',
  },
  translationBg: {
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    alignSelf: 'stretch',
    marginTop: scale(8),
    marginBottom: scale(8),
    minHeight: scale(44),
    maxHeight: scale(48),
    justifyContent: 'center',
  },
  translation: {
    fontSize: scale(14),
    textAlign: 'center',
    lineHeight: scale(22),
  },
  arrowBtn: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -scale(12) }],
    zIndex: 2,
    padding: scale(2),
    backgroundColor: colors.accent.accent300,
  },
  arrowLeft: {
    left: -scale(12),
  },
  arrowRight: {
    right: -scale(12),
  },
  changeDuaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: scale(140),
    height: scale(36),
    borderRadius: scale(60),
    paddingVertical: scale(4),
    paddingHorizontal: scale(12),
    position: 'absolute',
    bottom: -scale(18),
    left: '50%',
    transform: [{ translateX: -scale(70) }],
    zIndex: 3,
    backgroundColor: colors.accent.accent700,
  },
});

export default DuaCard;