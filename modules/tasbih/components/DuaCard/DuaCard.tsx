// DuaCard.tsx
import React from 'react';
import { View, StyleSheet, Text, Pressable, useWindowDimensions, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Body1Title2Bold, Body1Title2Medium } from '@/components';
import { useThemeStore } from '@/globalStore';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
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
          <View style={[styles.transBg]}> 
            <ScrollView 
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <Body1Title2Medium
                color="accent-yellow-900"
                style={[styles.arabic]}>{arabic}</Body1Title2Medium>
            </ScrollView>
          </View></View>

        {/* First Divider */}
        <View style={styles.dashedLine} />
        {/* Transliteration with Navigation Controls */}
        <View style={styles.transRowWrap}>
          <View style={[styles.transBg]}> 
            <ScrollView 
              contentContainerStyle={styles.scrollContentContainer}
              showsVerticalScrollIndicator={false}
              nestedScrollEnabled={true}
            >
              <Body1Title2Medium
                color="yellow-800"
                style={[styles.transliteration]}
              >
                {transliteration}
              </Body1Title2Medium>
            </ScrollView>
          </View>
        </View>
        {/* Second Divider */}
        <View style={styles.dashedLine} />
        {/* Translation inside card, with scrollable content */}
        <View style={[styles.translationBg]}> 
          <ScrollView 
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <Body1Title2Medium
              color="yellow-800"
              style={[styles.translation]}
            >
              {translation}
            </Body1Title2Medium>
          </ScrollView>
        </View>
      </LinearGradient>
      {/* Navigation buttons positioned at the middle of the card's sides */}
      <Pressable 
        onPress={onPrev} 
        style={[styles.arrowBtn, styles.arrowLeft]} 
        hitSlop={8} 
        accessibilityLabel="Previous dua"
      >
        <CdnSvg path={DUA_ASSETS.ARROW_LEFT} width={16} height={16} />
      </Pressable>
      <Pressable 
        onPress={onNext} 
        style={[styles.arrowBtn, styles.arrowRight]} 
        hitSlop={8} 
        accessibilityLabel="Next dua"
      >
        <CdnSvg path={DUA_ASSETS.ARROW_RIGHT} width={16} height={16} />
      </Pressable>
      {/* Change Dua Button positioned at bottom center - Fixed onPress handler */}
      <Pressable 
        style={styles.changeDuaBtn} 
        onPress={onChangeDua} 
        accessibilityLabel="Change dua"
      >
        <CdnSvg path={DUA_ASSETS.HAMBURGER_ICON} width={18} height={18} style={{ marginRight: 4 }} />
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
    height: scale(320),
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
    justifyContent: 'center',
    marginBottom: scale(8),
    height: scale(70),
  },
  arabic: {
    fontSize: scale(20),
    fontWeight: '700',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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
    height: scale(60),
  },
  scrollContentContainer: {
    minHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(4),
  },
  transliteration: {
    fontSize: scale(14),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  translationBg: {
    borderRadius: scale(8),
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    alignSelf: 'stretch',
    marginTop: scale(8),
    marginBottom: scale(8),
    height: scale(70),
  },
  translation: {
    fontSize: scale(14),
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
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