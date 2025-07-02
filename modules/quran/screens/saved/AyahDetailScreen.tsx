import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { 
  Body2Medium, 
  Body2Bold, 
  H5Bold, 
  H5Medium,
  Body1Title2Bold, 
  Body1Title2Regular,
  CaptionMedium 
} from '@/components/Typography/Typography';
import BackButton from '@/components/BackButton/BackButton';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';
import FastImage from 'react-native-fast-image';

type AyahDetailScreenRouteProp = RouteProp<SavedStackParamList, 'savedAyahDetail'>;
type AyahDetailScreenNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedAyahDetail'>;

// Define the type for a word with enhanced properties
type Word = {
  arabic: string;
  transliteration: string;
  translation: string;
};

// Enhanced mock verse data with word-by-word breakdown
const mockVerse = {
  id: 1,
  surahId: 1,
  surahName: 'Al-Fatiha',
  verseNumber: 1,
  arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  translation: 'In the Name of Allah—the Most Compassionate, Most Merciful.',
  transliteration: 'Bismillāhir-raḥmānir-raḥīm',
  // Added word-by-word breakdown for enhanced card design
  words: [
    { arabic: 'بِسْمِ', transliteration: 'Bismi', translation: 'In the name' },
    { arabic: 'اللَّهِ', transliteration: 'Allahi', translation: 'of Allah' },
    { arabic: 'الرَّحْمَٰنِ', transliteration: 'Ar-Rahman', translation: 'the Most Gracious' },
    { arabic: 'الرَّحِيمِ', transliteration: 'Ar-Raheem', translation: 'the Most Merciful' },
  ] as Word[],
  tafseer: {
    english: 'This verse is the opening of the Quran, teaching us to begin all actions with the name of Allah, acknowledging His mercy and compassion.',
    arabic: 'هذه الآية هي افتتاحية القرآن، تعلمنا أن نبدأ كل الأعمال باسم الله، معترفين برحمته وشفقته.'
  },
  audio: 'https://example.com/audio/1_1.mp3',
};

const AyahDetailScreen: React.FC = () => {
  const route = useRoute<AyahDetailScreenRouteProp>();
  const navigation = useNavigation<AyahDetailScreenNavigationProp>();
  const { ayahId, surahName, verseNumber } = route.params;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [selectedTafseer, setSelectedTafseer] = useState<'english' | 'arabic'>('english');

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle play/pause audio
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would be implemented here
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    setIsSaved(!isSaved);
    // Save/unsave logic would be implemented here
  };

  // Handle share functionality
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${mockVerse.arabic}\n\n${mockVerse.translation}\n\n${surahName} (${verseNumber})`,
      });
    } catch (error) {
      console.error('Error sharing verse:', error);
    }
  };

  // Handle tafseer button press
  const handleTafseerPress = () => {
    // Navigate to tafseer or show modal
    console.log('Show tafseer for verse:', mockVerse.id);
  };

  // Render word-by-word boxes matching SurahDetailScreen design
  const renderWordBoxes = (words: Word[]) => (
    <View style={styles.wordsContainer}>
      {words.map((word, index) => (
        <View key={index} style={styles.wordBox}>
          <H5Medium style={styles.wordArabic}>{word.arabic}</H5Medium>
          <Body2Medium style={styles.wordTransliteration}>{word.transliteration}</Body2Medium>
          <Body2Bold style={styles.wordTranslation}>{word.translation}</Body2Bold>
        </View>
      ))}
    </View>
  );

  // Render the main ayah card matching SurahDetailScreen style
  const renderAyahCard = () => (
    <View style={styles.verseCard}>
      {/* Top graphic similar to SurahDetailScreen first verse */}
      <View style={styles.graphicContainer}>
        <FastImage 
          source={{ uri: getCdnUrl(DUA_ASSETS.QURAN_SURAH_DETAIL_GRAPHIC) }} 
          style={styles.graphicImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>

      {/* Verse content matching SurahDetailScreen structure */}
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
              {verseNumber}
            </Body1Title2Bold>
          </View>
          
          {/* Word-by-word boxes */}
          {renderWordBoxes(mockVerse.words)}
        </View>
        
        {/* Translation section */}
        <View style={styles.translationSection}>
          <Body1Title2Bold style={styles.translationTitle}>Translation</Body1Title2Bold>
          <Body2Medium style={styles.translationText}>{mockVerse.translation}</Body2Medium>
        </View>
        
        {/* Bottom row with reference and actions */}
        <View style={styles.bottomRow}>
          {/* Left: Surah name and verse number */}
          <View style={styles.referenceContainer}>
            <Body1Title2Regular style={styles.referenceText}>{surahName}</Body1Title2Regular>
            <View style={styles.dot} />
            <Body1Title2Regular style={styles.referenceText}>{verseNumber}</Body1Title2Regular>
          </View>
          
          {/* Right: Action icons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleTafseerPress}
            >
              <CdnSvg 
                path={DUA_ASSETS.QURAN_OPEN_BOOK_ICON}
                width={scale(20)}
                height={scale(20)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleBookmarkToggle}
            >
              <CdnSvg 
                path={isSaved ? DUA_ASSETS.BOOKMARK_PRIMARY : DUA_ASSETS.QURAN_BOOKMARK_ICON}
                width={scale(20)}
                height={scale(20)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <CdnSvg 
                path={DUA_ASSETS.SHARE_ALT}
                width={scale(20)}
                height={scale(20)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handlePlayPause}
            >
              <CdnSvg 
                path={DUA_ASSETS.SURAH_PLAY_ICON}
                width={scale(20)}
                height={scale(20)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <H5Bold style={styles.headerTitle}>{surahName}</H5Bold>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Ayah Card */}
        {renderAyahCard()}
        
        {/* Tafseer section */}
        <View style={styles.tafseerContainer}>
          <H5Bold style={styles.tafseerTitle}>Tafseer</H5Bold>
          
          {/* Tafseer language selector */}
          <View style={styles.tafseerTabs}>
            <TouchableOpacity
              style={[
                styles.tafseerTab,
                selectedTafseer === 'english' && styles.tafseerTabActive
              ]}
              onPress={() => setSelectedTafseer('english')}
            >
              <Body2Medium 
                style={[
                  styles.tafseerTabText,
                  selectedTafseer === 'english' && styles.tafseerTabTextActive
                ]}
              >
                English
              </Body2Medium>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tafseerTab,
                selectedTafseer === 'arabic' && styles.tafseerTabActive
              ]}
              onPress={() => setSelectedTafseer('arabic')}
            >
              <Body2Medium 
                style={[
                  styles.tafseerTabText,
                  selectedTafseer === 'arabic' && styles.tafseerTabTextActive
                ]}
              >
                Arabic
              </Body2Medium>
            </TouchableOpacity>
          </View>
          
          {/* Tafseer content */}
          <View style={styles.tafseerContent}>
            <Body2Medium style={styles.tafseerText}>
              {selectedTafseer === 'english' ? mockVerse.tafseer.english : mockVerse.tafseer.arabic}
            </Body2Medium>
          </View>
        </View>
      </ScrollView>
      
      {/* Floating play button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={handlePlayPause}
        activeOpacity={0.8}
      >
        <CdnSvg 
          path={DUA_ASSETS.QURAN_PLAY_WHITE_ICON} 
          width={36} 
          height={36} 
          fill="#FFFFFF" 
        />
      </TouchableOpacity>
      
      {/* Footer */}
      <HadithImageFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // Changed to match SurahDetailScreen
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: scale(24), // Same width as back button for balanced layout
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(80), // Extra padding for the floating button
  },
  
  // Card styles matching SurahDetailScreen
  verseCard: {
    backgroundColor: '#FFFFFF',
    marginVertical: scale(8),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  graphicContainer: {
    width: '100%',
    height: verticalScale(121),
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicImage: {
    width: '100%',
    height: '100%',
  },
  verseContent: {
    padding: scale(16),
    paddingHorizontal: scale(24),
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
  
  // Word-by-word styles matching SurahDetailScreen
  wordsContainer: {
    flex: 1,
    flexDirection: 'row-reverse', // Right-to-left order for Arabic
    flexWrap: 'wrap-reverse', // Wrap from right to left
    justifyContent: 'flex-end', // Align to the right
    alignItems: 'flex-start',
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
    textAlign: 'left', // Left align within word box (for proper Arabic RTL rendering)
    color: '#171717',
    writingDirection: 'rtl', // Explicit RTL direction for Arabic text
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
    marginTop: scale(8),
  },
  
  // Translation section styles
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
  
  // Bottom row styles
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  referenceText: {
    fontSize: 14,
    lineHeight: 14 * 1.45,
    color: '#6B7280',
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: '#D4D4D4',
    borderRadius: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },

  // Tafseer section styles (preserved from original)
  tafseerContainer: {
    margin: scale(16),
    marginBottom: scale(24),
  },
  tafseerTitle: {
    marginBottom: scale(12),
  },
  tafseerTabs: {
    flexDirection: 'row',
    marginBottom: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tafseerTab: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    marginRight: scale(8),
  },
  tafseerTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: ColorPrimary.primary500,
  },
  tafseerTabText: {
    color: '#737373',
  },
  tafseerTabTextActive: {
    color: ColorPrimary.primary500,
  },
  tafseerContent: {
    backgroundColor: '#FAFAFA',
    padding: scale(16),
    borderRadius: scale(8),
  },
  tafseerText: {
    color: '#404040',
    lineHeight: scale(24),
  },
  
  // Floating button matching SurahDetailScreen
  floatingButton: {
    position: 'absolute',
    bottom: scale(20),
    right: scale(20),
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: ColorPrimary.primary500,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default AyahDetailScreen;