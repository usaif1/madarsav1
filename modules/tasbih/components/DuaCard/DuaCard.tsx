import React from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Body1Title2Bold, Body2Medium } from '@/components';
import { useThemeStore } from '@/globalStore';
import ArrowLeft from '@/assets/profile/arrowleft.svg';
import ArrowRight from '@/assets/profile/arrowright.svg';
import Hamburger from '@/assets/profile/hamburger.svg';

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
  // Responsive scaling
  const cardWidth = Math.min(width - 32, 343);

  return (
    <LinearGradient
      colors={[ '#FEFAEC', '#FCEFC7' ]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.card, { width: cardWidth }]}
    >
      <View style={styles.arabicWrap}>
        <Text style={styles.arabic}>{arabic}</Text>
      </View>
      <View style={styles.arrowRow}>
        <Pressable onPress={onPrev} style={styles.arrowBtn} hitSlop={8} accessibilityLabel="Previous dua">
          <ArrowLeft width={24} height={24} />
        </Pressable>
        <View style={styles.transWrap}>
          <Text style={styles.transliteration}>{transliteration}</Text>
        </View>
        <Pressable onPress={onNext} style={styles.arrowBtn} hitSlop={8} accessibilityLabel="Next dua">
          <ArrowRight width={24} height={24} />
        </Pressable>
      </View>
      <View style={styles.translationWrap}>
        <Body2Medium color="primary" style={styles.translation}>{translation}</Body2Medium>
      </View>
      <Pressable style={styles.changeDuaBtn} onPress={onChangeDua} accessibilityLabel="Change dua">
        <Hamburger width={24} height={24} style={{ marginRight: 8 }} />
        <Body1Title2Bold color="white">Change dua</Body1Title2Bold>
      </Pressable>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    height: 280,
    borderRadius: 16, // radius-md
    paddingTop: 20,
    paddingRight: 24,
    paddingBottom: 20,
    paddingLeft: 24,
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginTop: 100,
    marginBottom: 16,
    gap: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  arabicWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  arabic: {
    fontSize: 26,
    fontWeight: '700',
    color: '#5E4B1C',
    textAlign: 'center',
    lineHeight: 38,
  },
  arrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  arrowBtn: {
    width: 24,
    height: 24,
    borderRadius: 60,
    backgroundColor: '#F9DF90',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    marginHorizontal: 6,
  },
  transWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  transliteration: {
    fontSize: 15,
    color: '#5E4B1C',
    textAlign: 'center',
    fontWeight: '500',
  },
  translationWrap: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  translation: {
    fontSize: 15,
    color: '#5E4B1C',
    textAlign: 'center',
    fontWeight: '400',
  },
  changeDuaBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 28,
    borderRadius: 60,
    backgroundColor: '#9A7E2A',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderColor: '#9A7E2A',
    alignSelf: 'center',
    marginTop: 12,
    gap: 4,
  },
});

export default DuaCard;
