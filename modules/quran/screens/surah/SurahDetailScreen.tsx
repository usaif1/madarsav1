import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahStackParamList } from '../../navigation/surah.navigator';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Body1Title2Bold, Body1Title2Regular, H5Bold, H5Medium } from '@/components/Typography/Typography';
import BackButton from '@/components/BackButton/BackButton';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import SurahHeader from '../../components/SurahHeader/SurahHeader';
import SurahAudioPlayer from '../../components/SurahAudioPlayer/SurahAudioPlayer';
import TafseerModal from '../../components/TafseerModal/TafseerModal';
import ChangeSurahModal from '../../components/ChangeSurahModal/ChangeSurahModal';
import { useQuranNavigation } from '../../context/QuranNavigationContext';
import { useQuranStore } from '../../store/quranStore';
import FastImage from 'react-native-fast-image';

// Define the type for a word
type Word = {
  arabic: string;
  transliteration: string;
  translation: string;
};

// Define the type for a verse
type Verse = {  
  id: number;
  arabic: string;
  translation: string;
  transliteration: string;
  words: Word[];
};

// Sample data for verses with word-by-word breakdown
const SAMPLE_VERSES: Verse[] = [
  {
    id: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the Name of Allah—the Most Compassionate, Most Merciful.',
    transliteration: 'Bismillahir Rahmanir Raheem',
    words: [
      { arabic: 'بِسْمِ', transliteration: 'Bismi', translation: 'In the name' },
      { arabic: 'اللَّهِ', transliteration: 'Allahi', translation: 'of Allah' },
      { arabic: 'الرَّحْمَٰنِ', transliteration: 'Ar-Rahman', translation: 'the Most Gracious' },
      { arabic: 'الرَّحِيمِ', transliteration: 'Ar-Raheem', translation: 'the Most Merciful' },
    ],
  },
  {
    id: 2,
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: 'All praise is for Allah—Lord of all worlds,',
    transliteration: 'Alhamdu lillahi rabbil alamin',
    words: [
      { arabic: 'الْحَمْدُ', transliteration: 'Al-hamdu', translation: 'All praises and thanks' },
      { arabic: 'لِلَّهِ', transliteration: 'lillahi', translation: 'to Allah (be)' },
      { arabic: 'رَبِّ', transliteration: 'rabbi', translation: 'the Lord' },
      { arabic: 'الْعَالَمِينَ', transliteration: 'L-alamina', translation: 'of the universe' },
    ],
  },
  {
    id: 3,
    arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'the Most Compassionate, Most Merciful,',
    transliteration: 'Ar-Rahman ar-Raheem',
    words: [
      { arabic: 'الرَّحْمَٰنِ', transliteration: 'Ar-Rahman', translation: 'the Most Compassionate' },
      { arabic: 'الرَّحِيمِ', transliteration: 'Ar-Raheem', translation: 'Most Merciful' },
    ],
  },
  {
    id: 4,
    arabic: 'مَالِكِ يَوْمِ الدِّينِ',
    translation: 'Master of the Day of Judgment.',
    transliteration: 'Maliki yawmid-din',
    words: [
      { arabic: 'مَالِكِ', transliteration: 'Maliki', translation: 'Master' },
      { arabic: 'يَوْمِ', transliteration: 'yawmi', translation: 'of the Day' },
      { arabic: 'الدِّينِ', transliteration: 'ad-din', translation: 'of Judgment' },
    ],
  },
  {
    id: 5,
    arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    translation: 'You ˹alone˺ we worship and You ˹alone˺ we ask for help.',
    transliteration: `Iyyaka na'budu wa iyyaka nasta'in`,
    words: [
      { arabic: 'إِيَّاكَ', transliteration: 'Iyyaka', translation: 'You (alone)' },
      { arabic: 'نَعْبُدُ', transliteration: 'na\'budu', translation: 'we worship' },
      { arabic: 'وَإِيَّاكَ', transliteration: 'wa iyyaka', translation: 'and You (alone)' },
      { arabic: 'نَسْتَعِينُ', transliteration: 'nasta\'in', translation: 'we ask for help' },
    ],
  },
];

// Define route types for both stacks
type SurahRouteProp = RouteProp<SurahStackParamList, 'surahDetail'>;
type SavedSurahRouteProp = RouteProp<SavedStackParamList, 'savedSurahDetail'>;

// Define navigation types for both stacks
type SurahNavigationProp = NativeStackNavigationProp<SurahStackParamList, 'surahDetail'>;
type SavedSurahNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedSurahDetail'>;

const SurahDetailScreen: React.FC = () => {
  const route = useRoute<SurahRouteProp | SavedSurahRouteProp>();
  const navigation = useNavigation();
  const { surahId, surahName } = route.params;
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<number>>(new Set());
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showTafseerModal, setShowTafseerModal] = useState(false);
  const [showChangeSurahModal, setShowChangeSurahModal] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
    const { setTabsVisibility } = useQuranNavigation();
  const { saveAyah, removeAyah, isAyahSaved } = useQuranStore();

  // Load saved ayahs on component mount
  useEffect(() => {
    const savedVerses = new Set<number>();
    SAMPLE_VERSES.forEach(verse => {
      const ayahId = `${surahId}-${verse.id}`;
      if (isAyahSaved(ayahId)) {
        savedVerses.add(verse.id);
      }
    });
    setBookmarkedVerses(savedVerses);
  }, [surahId, isAyahSaved]);

  // Determine which stack we're in
  const isSavedStack = route.name === 'savedSurahDetail';

  // Hide both top and bottom tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setTabsVisibility(false, false); // Hide both top and bottom tabs
      return () => {
        // Tabs will be shown again when returning to list screen
      };
    }, [setTabsVisibility])
  );

  // Handle surah change from header
  const handleSurahChange = (newSurahId: number, newSurahName: string) => {
    if (!isSavedStack) {
      // Navigate to the new surah
      (navigation as unknown as SurahNavigationProp).navigate('surahDetail', {
        surahId: newSurahId,
        surahName: newSurahName
      });
    }
  };

  // Handle settings change from header
  const handleSettingsChange = (settings: any) => {
    // Apply settings logic here
    console.log('Settings applied:', settings);
  };

  // Handle tafseer press (read button)
  const handleTafseerPress = (verse: Verse) => {
    setSelectedVerse(verse);
    setShowTafseerModal(true);
  };

  // Toggle bookmark
  const toggleBookmark = (verse: Verse) => {
    const ayahId = `${surahId}-${verse.id}`;
    if (isAyahSaved(ayahId)) {
      removeAyah(ayahId);
      setBookmarkedVerses(prev => {
        const newSet = new Set(prev);
        newSet.delete(verse.id);
        return newSet;
      });
    } else {
      saveAyah({
        id: ayahId,
        surahId: surahId,
        surahName: surahName,
        ayahNumber: verse.id,
        arabic: verse.arabic,
        translation: verse.translation,
        transliteration: verse.transliteration,
      });
      setBookmarkedVerses(prev => {
        const newSet = new Set(prev);
        newSet.add(verse.id);
        return newSet;
      });
    }
  };

  // Handle share
  const handleShare = (verse: Verse) => {
    // Implement share functionality
    console.log('Share verse:', verse.id);
  };

  // Handle play
  const handlePlay = (verse: Verse) => {
    // Show the audio player when play is pressed
    setShowAudioPlayer(true);
  };

  // Handle floating play button press
  const handleFloatingPlayPress = () => {
    setShowAudioPlayer(true);
  };

  // Handle audio player close
  const handleAudioPlayerClose = () => {
    setShowAudioPlayer(false);
  };

  // Render word boxes
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

  // Render a verse item
  const renderVerse = (verse: Verse, index: number) => (
    <View key={verse.id} style={styles.verseCard}>
      {/* Top graphic for first verse */}
      {index === 0 && (
        <View style={styles.graphicContainer}>
          <FastImage 
            source={{ uri: getCdnUrl(DUA_ASSETS.QURAN_SURAH_DETAIL_GRAPHIC) }} 
            style={styles.graphicImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      )}

      {/* Verse content */}
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
              {verse.id}
            </Body1Title2Bold>
          </View>
          
          {/* Word-by-word boxes */}
          {renderWordBoxes(verse.words)}
        </View>
        
        {/* Translation section */}
        <View style={styles.translationSection}>
          <Body1Title2Bold style={styles.translationTitle}>Translation</Body1Title2Bold>
          <Body2Medium style={styles.translationText}>{verse.translation}</Body2Medium>
        </View>
        
        {/* Bottom row */}
        <View style={styles.bottomRow}>
          {/* Left: Surah name and verse number */}
          <View style={styles.referenceContainer}>
            <Body1Title2Regular style={styles.referenceText}>{surahName}</Body1Title2Regular>
            <View style={styles.dot} />
            <Body1Title2Regular style={styles.referenceText}>{verse.id}</Body1Title2Regular>
          </View>
          
          {/* Right: Action icons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleTafseerPress(verse)}
            >
              <CdnSvg 
                path={DUA_ASSETS.QURAN_OPEN_BOOK_ICON}
                width={scale(16)}
                height={scale(16)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => toggleBookmark(verse)}
            >
              {bookmarkedVerses.has(verse.id) ? <CdnSvg 
                path={DUA_ASSETS.BOOKMARK_PRIMARY}
                width={scale(20)}
                height={scale(20)}
              /> : <CdnSvg 
              path={DUA_ASSETS.QURAN_BOOKMARK_ICON}
              width={scale(16)}
              height={scale(16)}
            />}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShare(verse)}
            >
              <CdnSvg 
                path={DUA_ASSETS.SHARE_ALT}
                width={scale(16)}
                height={scale(16)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handlePlay(verse)}
            >
              <CdnSvg 
                path={DUA_ASSETS.SURAH_PLAY_ICON}
                width={scale(16)}
                height={scale(16)}
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
          <SurahHeader
            onBack={() => navigation.goBack()}
            surahName={surahName}
            surahInfo="Meccan • 7 Ayyahs"
            currentSurahId={surahId}
            onSurahChange={handleSurahChange}
            onSettingsChange={handleSettingsChange}
          />
          
          {/* Verses */}
          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: showAudioPlayer ? scale(120) : scale(80) }
            ]}
            showsVerticalScrollIndicator={false}
          >
            {SAMPLE_VERSES.map((verse, index) => renderVerse(verse, index))}
          </ScrollView>
          
          {/* Floating play button - only show when audio player is not visible */}
          {!showAudioPlayer && (
            <TouchableOpacity 
              style={styles.floatingButton}
              onPress={handleFloatingPlayPress}
              activeOpacity={0.8}
            >
              <CdnSvg path={DUA_ASSETS.QURAN_PLAY_WHITE_ICON} width={scale(14)} height={scale(16)} fill="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          {/* Surah Audio Player */}
          {showAudioPlayer && (
            <View style={styles.audioPlayerOverlay}>
              <Pressable 
                style={styles.audioPlayerBackdrop}
                onPress={handleAudioPlayerClose}
              />
              <View style={styles.audioPlayerWrapper}>
                <SurahAudioPlayer
                  surahId={surahId}
                  surahName={surahName}
                  verses={SAMPLE_VERSES}
                  onClose={handleAudioPlayerClose}
                />
              </View>
            </View>
          )}
          
          {/* Tafseer Modal */}
          {showTafseerModal && selectedVerse && (
            <TafseerModal
              visible={showTafseerModal}
              onClose={() => setShowTafseerModal(false)}
              surahId={surahId}
              surahName={surahName}
              ayahId={selectedVerse.id}
              verse={selectedVerse.arabic}
              words={selectedVerse.words}
              translation={selectedVerse.translation}
            />
          )}
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(80), // Extra padding for the floating button
  },
  graphicContainer: {
    width: '100%',
    height: verticalScale(80),
    marginTop:-10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  graphicImage: {
    width: '100%',
    height: '100%',
  },
  verseCard: {
    backgroundColor: '#FFFFFF',
    marginVertical: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
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
    marginTop: scale(8),
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
  floatingButton: {
    position: 'absolute',
    bottom: scale(20),
    right: scale(20),
    width: scale(50),
    height: scale(50),
    borderRadius: scale(28),
    backgroundColor: '#8A57DC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  audioPlayerOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
  },
  audioPlayerBackdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  audioPlayerWrapper: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(34),
  },
  audioPlayerContainer: {
    position: 'absolute',
    bottom: scale(40),
    left: '50%',
    transform: [{ translateX: -scale(190) }],
    alignItems: 'center',
  },
});

export default SurahDetailScreen;
