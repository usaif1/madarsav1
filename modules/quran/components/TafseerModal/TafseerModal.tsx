import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Body1Title2Bold, Body1Title2Regular, H5Medium, CaptionMedium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

interface Word {
  arabic: string;
  transliteration: string;
  translation: string;
}

interface TafseerModalProps {
  visible: boolean;
  onClose: () => void;
  surahId: number;
  surahName: string;
  ayahId: number;
  verse: string;
  words?: Word[];
  translation?: string;
}

const TafseerModal: React.FC<TafseerModalProps> = ({
  visible,
  onClose,
  surahId,
  surahName,
  ayahId,
  verse,
  words = [],
  translation = "In the Name of Allah—the Most Compassionate, Most Merciful."
}) => {
  const [selectedTafseerLanguage, setSelectedTafseerLanguage] = useState('English');
  const [selectedAuthor, setSelectedAuthor] = useState('Author name');

  // Sample tafseer content
  const tafseerContent = `Bismillah (بِسْمِ اللَّهِ) is a phrase in Arabic meaning "in the name of Allah." It is the first verse of the first chapter of the Quran, Al-Fatiha, and is often used by Muslims at the beginning of every action.

The full phrase is "Bismillah ir-Rahman ir-Rahim" (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ) which translates to "In the name of Allah, the Most Gracious, the Most Merciful."

The phrase has deep significance in Islamic tradition:

1. It is a reminder to begin all actions with the remembrance of Allah.
2. It acknowledges that all actions should be done for the sake of Allah.
3. It recognizes Allah's attributes of mercy and compassion.
4. It serves as a form of seeking blessing and guidance from Allah before undertaking any task.

Muslims recite Bismillah before meals, before entering their homes, before beginning a journey, and before starting any significant action.`;

  // Default word breakdown if not provided
  const defaultWords: Word[] = [
    { arabic: 'بِسْمِ', transliteration: 'Bismi', translation: 'In the name' },
    { arabic: 'اللَّهِ', transliteration: 'Allahi', translation: 'of Allah' },
    { arabic: 'الرَّحْمَٰنِ', transliteration: 'Ar-Rahman', translation: 'the Most Gracious' },
    { arabic: 'الرَّحِيمِ', transliteration: 'Ar-Raheem', translation: 'the Most Merciful' },
  ];

  const displayWords = words.length > 0 ? words : defaultWords;

  // Render word boxes
  const renderWordBoxes = (wordsArray: Word[]) => (
    <View style={styles.wordsContainer}>
      {wordsArray.map((word, index) => (
        <View key={index} style={styles.wordBox}>
          <H5Medium style={styles.wordArabic}>{word.arabic}</H5Medium>
          <Body2Medium style={styles.wordTransliteration}>{word.transliteration}</Body2Medium>
          <Body2Bold style={styles.wordTranslation}>{word.translation}</Body2Bold>
        </View>
      ))}
    </View>
  );

  return (
    <Modal 
      isVisible={visible} 
      onBackdropPress={onClose}
      backdropOpacity={0.5}
      style={styles.modal}
      useNativeDriverForBackdrop={true}
      avoidKeyboard={true}
    >
      <View style={styles.sheet}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* Surah Selection Button */}
            <TouchableOpacity style={styles.surahButton}>
              <Body2Medium style={styles.surahButtonText}>{surahName}</Body2Medium>
              <CdnSvg 
                  path={DUA_ASSETS.SURAH_DOWN_ARROW} 
                  width={scale(20)} 
                  height={scale(20)} 
                />
            </TouchableOpacity>

            {/* Verse Selection Button */}
            <TouchableOpacity style={styles.verseButton}>
              <Body2Medium style={styles.verseButtonText}>Verse {ayahId}</Body2Medium>
              <CdnSvg 
                  path={DUA_ASSETS.SURAH_DOWN_ARROW} 
                  width={scale(20)} 
                  height={scale(20)} 
                />
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CdnSvg path={DUA_ASSETS.QURAN_CLOSE_ICON} width={24} height={24} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Verse Content */}
          <View style={styles.verseContent}>
            {/* Top row with bubble index and word boxes */}
            <View style={styles.topRow}>
              {/* Bubble index */}
              <View style={styles.bubbleContainer}>
                <CdnSvg 
                  path={DUA_ASSETS.BUBBLE}
                  width={scale(26)}
                  height={scale(26)}
                />
                <Body1Title2Bold style={styles.bubbleNumber}>
                  {ayahId}
                </Body1Title2Bold>
              </View>
              
              {/* Word-by-word boxes */}
              {renderWordBoxes(displayWords)}
            </View>
            
            {/* Translation section */}
            <View style={styles.translationSection}>
              <Body1Title2Bold style={styles.translationTitle}>Translation</Body1Title2Bold>
              <Body2Medium style={styles.translationText}>{translation}</Body2Medium>
            </View>
          </View>

          {/* Divider Line */}
          <View style={styles.dividerLine} />

          {/* Tafseer Section */}
          <View style={styles.tafseerSection}>
            <Body1Title2Bold style={styles.tafseerTitle}>Tafseer</Body1Title2Bold>
            
            {/* Tafseer Language Buttons */}
            <View style={styles.tafseerButtonsContainer}>
              <TouchableOpacity style={styles.tafseerButton}>
                <Body2Medium style={styles.tafseerButtonText}>English</Body2Medium>
                <CdnSvg 
                  path={DUA_ASSETS.SURAH_DOWN_ARROW} 
                  width={scale(20)} 
                  height={scale(20)} 
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.tafseerButton}>
                <Body2Medium style={styles.tafseerButtonText}>Author name</Body2Medium>
                <CdnSvg 
                  path={DUA_ASSETS.SURAH_DOWN_ARROW} 
                  width={scale(20)} 
                  height={scale(20)} 
                />
              </TouchableOpacity>
            </View>

            {/* Tafseer Content */}
            <Body2Medium style={styles.tafseerText}>{tafseerContent}</Body2Medium>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    paddingBottom: 0,
    paddingHorizontal: 0,
    height: Math.min(verticalScale(800), screenHeight * 0.9),
    maxHeight: screenHeight * 0.95,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  surahButton: {
    width: 111,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    paddingTop: scale(4),
    paddingRight: scale(10),
    paddingBottom: scale(4),
    paddingLeft: scale(14),
    borderRadius: 60,
    backgroundColor: '#F0EAFB',
  },
  surahButtonText: {
    color: ColorPrimary.primary500,
  },
  verseButton: {
    width: 95,
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    paddingTop: scale(4),
    paddingRight: scale(10),
    paddingBottom: scale(4),
    paddingLeft: scale(14),
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#A3A3A3',
    backgroundColor: '#FFFFFF',
  },
  verseButtonText: {
    color: '#A3A3A3',
  },
  closeButton: {
    padding: scale(4),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
  },
  verseContent: {
    paddingVertical: scale(20),
    gap: scale(16),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(6),
  },
  bubbleContainer: {
    position: 'relative',
    width: scale(26),
    height: scale(26),
    marginTop: scale(8),
  },
  bubbleNumber: {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: [{ translateX: -3 }, { translateY: -8 }],
    color: ColorPrimary.primary600,
    fontSize: 12,
  },
  wordsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  wordBox: {
    width: 72,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(2),
    padding: scale(4),
  },
  wordArabic: {
    fontSize: 20,
    lineHeight: 20 * 1.4,
    textAlign: 'right',
    color: '#171717',
  },
  wordTransliteration: {
    fontSize: 10,
    lineHeight: 10 * 1.4,
    textAlign: 'center',
    color: '#525252',
    fontWeight: '400',
  },
  wordTranslation: {
    fontSize: 10,
    lineHeight: 10 * 1.4,
    textAlign: 'center',
    color: '#525252',
    fontWeight: '600',
  },
  translationSection: {
    gap: scale(4),
  },
  translationTitle: {
    fontSize: 14,
    lineHeight: 14 * 1.45,
    color: '#0A0A0A',
    fontWeight: '700',
  },
  translationText: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: '#404040',
  },
  dividerLine: {
    width: 326,
    height: 3,
    backgroundColor: '#8789A31A',
    alignSelf: 'center',
    marginVertical: scale(20),
  },
  tafseerSection: {
    gap: scale(16),
  },
  tafseerTitle: {
    fontSize: 14,
    lineHeight: 14 * 1.45,
    color: '#0A0A0A',
    fontWeight: '700',
  },
  tafseerButtonsContainer: {
    flexDirection: 'row',
    gap: scale(12),
  },
  tafseerButton: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(6),
    paddingTop: scale(4),
    paddingRight: scale(10),
    paddingBottom: scale(4),
    paddingLeft: scale(14),
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#A3A3A3',
    backgroundColor: '#FFFFFF',
  },
  tafseerButtonText: {
    color: '#A3A3A3',
  },
  tafseerText: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: '#404040',
  },
  arrowText: {
    color: '#A3A3A3',
    fontSize: 12,
  },
});

export default TafseerModal; 