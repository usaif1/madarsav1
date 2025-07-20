import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JuzzStackParamList } from '../../navigation/juzz.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Body1Title2Bold, Body1Title2Regular, H5Medium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import SurahHeader from '../../components/SurahHeader/SurahHeader';
import SurahAudioPlayer from '../../components/SurahAudioPlayer/SurahAudioPlayer';
import TafseerModal from '../../components/TafseerModal/TafseerModal';
import ChangeJuzzModal from '../../components/ChangeJuzzModal/ChangeJuzzModal';
import { useQuranNavigation } from '../../context/QuranNavigationContext';
import { useQuranStore } from '../../store/quranStore';
import quranService from '../../services/quranService';
import { Verse as ApiVerse } from '../../types/quranFoundationTypes';
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
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
  transliteration: string;
  words: Word[];
};

// Dynamic bubble index component that adapts to number size
const BubbleIndex = memo(({ number }: { number: number }) => {
  const numberStr = number.toString();
  const digitCount = numberStr.length;
  
  // Calculate bubble size based on digit count
  const bubbleSize = Math.max(26, digitCount * 8 + 18); // Minimum 26, grows with digits
  const fontSize = digitCount >= 3 ? 10 : digitCount >= 2 ? 11 : 12; // Smaller font for more digits
  
  return (
    <View style={[styles.bubbleContainer, { width: scale(bubbleSize), height: scale(bubbleSize) }]}>
      <CdnSvg 
        path={DUA_ASSETS.BUBBLE}
        width={scale(bubbleSize)}
        height={scale(bubbleSize)}
      />
      <Body1Title2Bold style={[
        styles.bubbleNumber, 
        { 
          fontSize: scale(fontSize),
          // Dynamic positioning for perfect centering
          left: '50%',
          top: '50%',
          transform: [
            { translateX: -(digitCount * 3) }, // Adjust for text width
            { translateY: -scale(fontSize / 2) } // Adjust for text height
          ]
        }
      ]}>
        {number}
      </Body1Title2Bold>
    </View>
  );
});

// Sample data for verses with word breakdown
const SAMPLE_VERSES: Verse[] = [
  {
    id: 1,
    surahId: 1,
    surahName: 'Al-Fatiha',
    ayahNumber: 1,
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
    surahId: 1,
    surahName: 'Al-Fatiha',
    ayahNumber: 2,
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
    surahId: 1,
    surahName: 'Al-Fatiha',
    ayahNumber: 3,
    arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'the Most Compassionate, Most Merciful,',
    transliteration: 'Ar-Rahman ar-Raheem',
    words: [
      { arabic: 'الرَّحْمَٰنِ', transliteration: 'Ar-Rahman', translation: 'the Most Compassionate' },
      { arabic: 'الرَّحِيمِ', transliteration: 'Ar-Raheem', translation: 'Most Merciful' },
    ],
  },
];

type JuzzDetailScreenRouteProp = RouteProp<JuzzStackParamList, 'juzzDetail'>;
type JuzzDetailScreenNavigationProp = NativeStackNavigationProp<JuzzStackParamList, 'juzzDetail'>;

// Memoized verse component to prevent unnecessary re-renders
const VerseItem = memo(({
  verse,
  index,
  juzzId,
  juzzName,
  bookmarkedVerses,
  onTafseerPress,
  onToggleBookmark,
  onShare,
  onPlay
}: {
  verse: Verse;
  index: number;
  juzzId: number;
  juzzName: string;
  bookmarkedVerses: Set<number>;
  onTafseerPress: (verse: Verse) => void;
  onToggleBookmark: (verse: Verse) => void;
  onShare: (verse: Verse) => void;
  onPlay: (verse: Verse) => void;
}) => {
  // Memoize word boxes to prevent re-renders
  const wordBoxes = useMemo(() => (
    <View style={styles.wordsContainer}>
      {verse.words.map((word, wordIndex) => (
        <View key={`${verse.id}-word-${wordIndex}`} style={styles.wordBox}>
          <H5Medium style={styles.wordArabic}>{word.arabic}</H5Medium>
          <Body2Medium style={styles.wordTransliteration}>{word.transliteration}</Body2Medium>
          <Body2Bold style={styles.wordTranslation}>{word.translation}</Body2Bold>
        </View>
      ))}
    </View>
  ), [verse.words, verse.id]);

  // Memoize bookmark icon
  const bookmarkIcon = useMemo(() => {
    return bookmarkedVerses.has(verse.id) ? (
      <CdnSvg 
        path={DUA_ASSETS.BOOKMARK_PRIMARY}
        width={scale(20)}
        height={scale(20)}
      />
    ) : (
      <CdnSvg 
        path={DUA_ASSETS.QURAN_BOOKMARK_ICON}
        width={scale(16)}
        height={scale(16)}
      />
    );
  }, [bookmarkedVerses, verse.id]);

  return (
    <View style={styles.verseCard}>
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
          {/* Dynamic Bubble index */}
          <BubbleIndex number={verse.ayahNumber} />
          
          {/* Word-by-word boxes */}
          {wordBoxes}
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
            <Body1Title2Regular style={styles.referenceText}>{verse.surahName}</Body1Title2Regular>
            <View style={styles.dot} />
            <Body1Title2Regular style={styles.referenceText}>{verse.ayahNumber}</Body1Title2Regular>
          </View>
          
          {/* Right: Action icons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onTafseerPress(verse)}
            >
              <CdnSvg 
                path={DUA_ASSETS.QURAN_OPEN_BOOK_ICON}
                width={scale(16)}
                height={scale(16)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onToggleBookmark(verse)}
            >
              {bookmarkIcon}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onShare(verse)}
            >
              <CdnSvg 
                path={DUA_ASSETS.SHARE_ALT}
                width={scale(16)}
                height={scale(16)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => onPlay(verse)}
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
});

const JuzzDetailScreen: React.FC = () => {
  const route = useRoute<JuzzDetailScreenRouteProp>();
  const navigation = useNavigation<JuzzDetailScreenNavigationProp>();
  const { juzzId, juzzName } = route.params;
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<number>>(new Set());
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showTafseerModal, setShowTafseerModal] = useState(false);
  const [showChangeJuzzModal, setShowChangeJuzzModal] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<Verse | null>(null);
  const { setTabsVisibility } = useQuranNavigation();
  const { saveAyah, removeAyah, isAyahSaved } = useQuranStore();
  
  // State for API data
  const [verses, setVerses] = useState<Verse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    nextPage: number | null;
  }>({
    currentPage: 1,
    totalPages: 1,
    totalRecords: 0,
    nextPage: null
  });
  const [loadingMore, setLoadingMore] = useState(false);

  // Memoize route params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => ({ juzzId, juzzName }), [juzzId, juzzName]);

  // Convert API verse to our Verse format
  const convertApiVerseToVerse = useCallback((apiVerse: ApiVerse): Verse => {
    // Extract surah ID and name from verse_key (format: "1:1" where 1 is surah ID and 1 is verse number)
    const [surahId, ayahNumber] = apiVerse.verse_key.split(':').map(Number);
    
    // Create words array from API words if available
    const words: Word[] = apiVerse.words?.map(word => ({
      arabic: word.text,
      transliteration: word.transliteration?.text || '',
      translation: word.translation?.text || ''
    })) || [];
    
    return {
      id: apiVerse.id,
      surahId,
      surahName: `Surah ${surahId}`, // We could fetch the actual surah name if needed
      ayahNumber,
      arabic: apiVerse.text_uthmani,
      translation: apiVerse.translations?.[0]?.text || '',
      transliteration: words.map(w => w.transliteration).join(' '),
      words
    };
  }, []);
  
  // Fetch verses for the juz
  const fetchVerses = useCallback(async (page: number = 1) => {
    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      setError(null);
      
      const response = await quranService.getVersesByJuz(
        juzzId,
        page,
        10, // perPage
        'ar', // language
        true, // includeWords
        '131', // translationIds (English)
        undefined, // audioId
        undefined // tafsirIds
      );
      
      const convertedVerses = response.verses.map(convertApiVerseToVerse);
      
      if (page === 1) {
        setVerses(convertedVerses);
      } else {
        setVerses(prev => [...prev, ...convertedVerses]);
      }
      
      setPagination({
        currentPage: response.pagination.current_page,
        totalPages: response.pagination.total_pages,
        totalRecords: response.pagination.total_records,
        nextPage: response.pagination.next_page
      });
      
    } catch (err) {
      console.error('Error fetching verses:', err);
      setError('Failed to load verses. Please try again.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [juzzId, convertApiVerseToVerse]);
  
  // Load verses on component mount or when juzzId changes
  useEffect(() => {
    fetchVerses(1);
  }, [memoizedParams.juzzId, fetchVerses]);
  
  // Load saved ayahs on component mount - separate effect to prevent re-renders
  useEffect(() => {
    if (verses.length > 0) {
      const savedVerses = new Set<number>();
      verses.forEach(verse => {
        const ayahId = `${juzzId}-${verse.id}`;
        if (isAyahSaved(ayahId)) {
          savedVerses.add(verse.id);
        }
      });
      setBookmarkedVerses(savedVerses);
    }
  }, [verses, juzzId, isAyahSaved]);

  // Hide both top and bottom tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setTabsVisibility(false, false); // Hide both top and bottom tabs
      return () => {
        // Tabs will be shown again when returning to list screen
      };
    }, [setTabsVisibility])
  );

  // Handle juzz change from header
  const handleJuzzChange = useCallback((newJuzzId: number, newJuzzName: string) => {
    navigation.navigate('juzzDetail', {
      juzzId: newJuzzId,
      juzzName: newJuzzName
    });
  }, [navigation]);

  // Handle settings change from header
  const handleSettingsChange = useCallback((settings: any) => {
    // Apply settings logic here
    console.log('Settings applied:', settings);
  }, []);

  // Handle tafseer press (read button)
  const handleTafseerPress = useCallback((verse: Verse) => {
    setSelectedVerse(verse);
    setShowTafseerModal(true);
  }, []);

  // Toggle bookmark
  const toggleBookmark = useCallback((verse: Verse) => {
    const ayahId = `${juzzId}-${verse.id}`;
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
        surahId: juzzId, // Using juzzId as surahId for juzz verses
        surahName: juzzName,
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
  }, [juzzId, juzzName, isAyahSaved, removeAyah, saveAyah]);

  // Handle share
  const handleShare = useCallback((verse: Verse) => {
    // Implement share functionality
    console.log('Share verse:', verse.id);
  }, []);

  // Handle play
  const handlePlay = useCallback((_verse: Verse) => {
    // Show the audio player when play is pressed
    setShowAudioPlayer(true);
  }, []);

  // Handle floating play button press
  const handleFloatingPlayPress = useCallback(() => {
    setShowAudioPlayer(true);
  }, []);

  // Handle audio player close
  const handleAudioPlayerClose = useCallback(() => {
    setShowAudioPlayer(false);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <SurahHeader
        onBack={() => navigation.goBack()}
        surahName={juzzName}
        surahInfo="Al-Fatiha - Al-Baqarah • 141 Ayahs"
        currentSurahId={juzzId}
        onDropdownPress={() => setShowChangeJuzzModal(true)}
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
        onScroll={({ nativeEvent }) => {
          const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
          const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
          
          if (isCloseToBottom && pagination.nextPage && !loadingMore && !loading) {
            fetchVerses(pagination.nextPage);
          }
        }}
        scrollEventThrottle={400}
      >
        {loading && verses.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={ColorPrimary.primary600} />
            <Body2Medium style={styles.loadingText}>Loading verses...</Body2Medium>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Body2Bold style={styles.errorText}>{error}</Body2Bold>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => fetchVerses(1)}
            >
              <Body2Medium style={styles.retryButtonText}>Retry</Body2Medium>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {verses.map((verse, index) => (
              <VerseItem
                key={verse.id}
                verse={verse}
                index={index}
                juzzId={juzzId}
                juzzName={juzzName}
                bookmarkedVerses={bookmarkedVerses}
                onTafseerPress={handleTafseerPress}
                onToggleBookmark={toggleBookmark}
                onShare={handleShare}
                onPlay={handlePlay}
              />
            ))}
            {loadingMore && (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color={ColorPrimary.primary600} />
                <Body2Medium style={styles.loadingMoreText}>Loading more verses...</Body2Medium>
              </View>
            )}
          </>
        )}
      </ScrollView>
      
      {/* Floating play button - only show when audio player is not visible */}
      {!showAudioPlayer && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleFloatingPlayPress}
          activeOpacity={0.8}
        >
          <CdnSvg style={{marginLeft:scale(2)}} path={DUA_ASSETS.QURAN_PLAY_WHITE_ICON} width={scale(14)} height={scale(16)} fill="#FFFFFF" />
        </TouchableOpacity>
      )}
      
      {/* Juzz Audio Player */}
      {showAudioPlayer && (
        <View style={styles.audioPlayerOverlay}>
          <Pressable 
            style={styles.audioPlayerBackdrop}
            onPress={handleAudioPlayerClose}
          />
          <View style={styles.audioPlayerWrapper}>
            <SurahAudioPlayer
              surahId={juzzId}
              surahName={juzzName}
              verses={verses.length > 0 ? verses : SAMPLE_VERSES}
              onClose={handleAudioPlayerClose}
            />
          </View>
        </View>
      )}

      {/* Change Juzz Modal */}
      <ChangeJuzzModal
        visible={showChangeJuzzModal}
        onClose={() => setShowChangeJuzzModal(false)}
        currentJuzzId={juzzId}
        onJuzzChange={handleJuzzChange}
      />
       
      {/* Tafseer Modal */}
      {showTafseerModal && selectedVerse && (
        <TafseerModal
          visible={showTafseerModal}
          onClose={() => setShowTafseerModal(false)}
          surahId={selectedVerse.surahId}
          surahName={selectedVerse.surahName}
          ayahId={selectedVerse.ayahNumber}
          verse={selectedVerse.arabic}
          words={selectedVerse.words}
          translation={selectedVerse.translation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(50),
  },
  loadingText: {
    marginTop: scale(10),
    color: '#525252',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(50),
  },
  errorText: {
    color: '#E53E3E',
    marginBottom: scale(10),
  },
  retryButton: {
    backgroundColor: ColorPrimary.primary600,
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
    borderRadius: scale(4),
  },
  retryButtonText: {
    color: '#FFFFFF',
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(16),
    gap: scale(8),
  },
  loadingMoreText: {
    color: '#525252',
  },
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
    justifyContent: 'flex-end',
    gap: scale(6),
  },
  bubbleContainer: {
    position: 'relative',
    marginTop: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bubbleNumber: {
    position: 'absolute',
    color: ColorPrimary.primary600,
    fontWeight: '700',
    textAlign: 'center',
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
    transform: [{ translateX: -scale(180) }],
    alignItems: 'center',
  },
});

export default JuzzDetailScreen;