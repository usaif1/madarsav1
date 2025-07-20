import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, Text } from 'react-native';
import { useRoute, useNavigation, RouteProp, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahStackParamList } from '../../navigation/surah.navigator';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Body1Title2Bold, Body1Title2Regular, H5Medium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import SurahHeader from '../../components/SurahHeader/SurahHeader';
import SurahAudioPlayer from '../../components/SurahAudioPlayer/SurahAudioPlayer';
import TafseerModal from '../../components/TafseerModal/TafseerModal';
import { useQuranNavigation } from '../../context/QuranNavigationContext';
import { useQuranStore } from '../../store/quranStore';
import FastImage from 'react-native-fast-image';
import quranService from '../../services/quranService';
import { Verse, Word } from '../../types/quranFoundationTypes';
import useQuranAuth from '../../hooks/useQuranAuth';

// Helper type for UI display
type DisplayVerse = {
  id: number;
  arabic: string;
  translation: string;
  transliteration: string;
  words: DisplayWord[];
};

// Helper type for UI display
type DisplayWord = {
  arabic: string;
  transliteration: string;
  translation: string;
};

// Helper function to convert API Word to DisplayWord (memoized)
const convertToDisplayWord = (word: Word): DisplayWord => {
  return {
    arabic: word.text_uthmani || word.text,
    transliteration: word.transliteration?.text || '',
    translation: word.translation?.text || '',
  };
};

// Helper function to convert API Verse to DisplayVerse (memoized)
const convertToDisplayVerse = (verse: Verse): DisplayVerse => {
  const translation = verse.translations && verse.translations.length > 0
    ? verse.translations[0].text
    : '';
  
  const words = verse.words
    ? verse.words.map(convertToDisplayWord)
    : [];
  
  return {
    id: verse.verse_number,
    arabic: verse.text_uthmani,
    translation,
    transliteration: words.map(w => w.transliteration).join(' '),
    words,
  };
};

// Define route types for both stacks
type SurahRouteProp = RouteProp<SurahStackParamList, 'surahDetail'>;
type SavedSurahRouteProp = RouteProp<SavedStackParamList, 'savedSurahDetail'>;

// Define navigation types for both stacks
type SurahNavigationProp = NativeStackNavigationProp<SurahStackParamList, 'surahDetail'>;

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

// Memoize the verse item component to prevent unnecessary rerenders
const VerseItem = memo(({
  verse,
  index,
  surahName,
  surahId,
  bookmarkedVerses,
  onTafseerPress,
  onToggleBookmark,
  onShare,
  onPlay
}: {
  verse: DisplayVerse;
  index: number;
  surahName: string;
  surahId: number;
  bookmarkedVerses: Set<number>;
  onTafseerPress: (verse: DisplayVerse) => void;
  onToggleBookmark: (verse: DisplayVerse) => void;
  onShare: (verse: DisplayVerse) => void;
  onPlay: (verse: DisplayVerse) => void;
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
          <BubbleIndex number={verse.id} />
          
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
            <Body1Title2Regular style={styles.referenceText}>{surahName}</Body1Title2Regular>
            <View style={styles.dot} />
            <Body1Title2Regular style={styles.referenceText}>{verse.id}</Body1Title2Regular>
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

const SurahDetailScreen: React.FC = () => {
  const route = useRoute<SurahRouteProp | SavedSurahRouteProp>();
  const navigation = useNavigation();
  const { surahId, surahName } = route.params;
  const [bookmarkedVerses, setBookmarkedVerses] = useState<Set<number>>(new Set());
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);
  const [showTafseerModal, setShowTafseerModal] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<DisplayVerse | null>(null);
  const { setTabsVisibility } = useQuranNavigation();
  const { saveAyah, removeAyah, isAyahSaved } = useQuranStore();
  const { isAuthenticated, isInitialized } = useQuranAuth();
  
  // State for verses data
  const [verses, setVerses] = useState<DisplayVerse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [surahInfo, setSurahInfo] = useState<string>('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const PAGE_SIZE = 10;

  // Memoize route params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => ({ surahId, surahName }), [surahId, surahName]);

  // Fetch chapter info - FIXED: Remove bookmarkedVerses dependency
  const fetchChapterInfo = useCallback(async () => {
    console.log(`🔄 Fetching chapter info for surah ${surahId}`);
    try {
      const chapter = await quranService.getChapterById(surahId);
      const revelationType = chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan';
      setSurahInfo(`${revelationType} • ${chapter.verses_count} Ayyahs`);
      console.log(`✅ Chapter info fetched: ${revelationType}, ${chapter.verses_count} verses`);
    } catch (err) {
      console.error('❌ Error fetching chapter info:', err);
    }
  }, [surahId]); // FIXED: Removed bookmarkedVerses dependency

  // Fetch verses from API with pagination - FIXED: Remove bookmarkedVerses dependency
  const fetchVerses = useCallback(async (page: number = 1, append: boolean = false) => {
    console.log(`🔄 Starting to fetch verses for surah ${surahId}, page ${page}`);
    if (page === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);
    
    try {
      console.log('📡 Calling quranService.getVersesForChapter()');
      const startTime = Date.now();
      
      // Fetch verses for the current page
      const versesData = await quranService.getVersesForChapter(
        surahId,
        page,
        PAGE_SIZE,
        'en',
      );
      
      const endTime = Date.now();
      console.log(`✅ Received ${versesData.length} verses in ${endTime - startTime}ms`);
      
      // Convert API verses to display format
      console.log('🔄 Converting verses to display format');
      const displayVerses = versesData.map(convertToDisplayVerse);
      
      // Update pagination state
      setCurrentPage(page);
      setHasMorePages(versesData.length === PAGE_SIZE);
      
      // Append or replace verses
      if (append) {
        setVerses(prev => [...prev, ...displayVerses]);
      } else {
        setVerses(displayVerses);
      }
      
      console.log('✅ Verse data processed and ready for display');
    } catch (err) {
      console.error('❌ Error fetching verses:', err);
      if (err instanceof Error) {
        console.error(`❌ Error message: ${err.message}`);
        console.error(`❌ Error stack: ${err.stack}`);
      }
      setError('Failed to load verses. Please try again.');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      console.log('🏁 Verse fetching process completed');
    }
  }, [surahId, PAGE_SIZE]); // FIXED: Removed bookmarkedVerses and isAyahSaved dependencies

  // Load saved verses separately - FIXED: Separate effect for bookmarks
  useEffect(() => {
    if (verses.length > 0) {
      const savedVerses = new Set<number>();
      verses.forEach(verse => {
        const ayahId = `${surahId}-${verse.id}`;
        if (isAyahSaved(ayahId)) {
          savedVerses.add(verse.id);
        }
      });
      setBookmarkedVerses(savedVerses);
    }
  }, [verses, surahId, isAyahSaved]);

  // Function to handle retry
  const handleRetry = useCallback(() => {
    if (isInitialized && isAuthenticated) {
      console.log('🔄 Retrying to fetch verses');
      setIsLoading(true);
      setError(null);
      fetchVerses(1, false);
    } else {
      console.log('⚠️ Cannot retry - not authenticated');
      setError('Authentication failed. Please try again.');
    }
  }, [isInitialized, isAuthenticated, fetchVerses]);

  // Function to load more verses
  const loadMoreVerses = useCallback(async () => {
    if (isLoadingMore || !hasMorePages) return;
    
    console.log(`🔄 Loading more verses, page ${currentPage + 1}`);
    await fetchVerses(currentPage + 1, true);
  }, [currentPage, fetchVerses, hasMorePages, isLoadingMore]);
  
  // Handle end reached (for infinite scrolling)
  const handleEndReached = useCallback(() => {
    if (!isLoading && !isLoadingMore && hasMorePages) {
      console.log('📜 Reached end of list, loading more verses');
      loadMoreVerses();
    }
  }, [hasMorePages, isLoading, isLoadingMore, loadMoreVerses]);

  // FIXED: Fetch verses when component mounts or auth state changes - simplified dependencies
  useEffect(() => {
    console.log(`🔐 Auth state changed - initialized: ${isInitialized}, authenticated: ${isAuthenticated}`);
    
    if (isInitialized && isAuthenticated) {
      console.log('✅ Authentication ready, fetching verses');
      fetchVerses(1, false);
      fetchChapterInfo();
    } else if (isInitialized && !isAuthenticated) {
      console.log('⚠️ Authentication initialized but not authenticated');
      setError('Authentication failed. Please try again.');
      setIsLoading(false);
    } else {
      console.log('⏳ Waiting for authentication to initialize');
    }
  }, [isInitialized, isAuthenticated, memoizedParams.surahId]); // FIXED: Use memoized params

  // Determine which stack we're in
  const isSavedStack = route.name === 'savedSurahDetail';

  // Hide both top and bottom tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setTabsVisibility(false, false);
      return () => {
        // Tabs will be shown again when returning to list screen
      };
    }, [setTabsVisibility])
  );

  // Handle surah change from header
  const handleSurahChange = useCallback((newSurahId: number, newSurahName: string) => {
    if (!isSavedStack) {
      (navigation as unknown as SurahNavigationProp).navigate('surahDetail', {
        surahId: newSurahId,
        surahName: newSurahName
      });
    }
  }, [isSavedStack, navigation]);

  // Handle settings change from header
  const handleSettingsChange = useCallback((settings: any) => {
    console.log('Settings applied:', settings);
  }, []);

  // Handle tafseer press (read button)
  const handleTafseerPress = useCallback((verse: DisplayVerse) => {
    setSelectedVerse(verse);
    setShowTafseerModal(true);
  }, []);

  // Toggle bookmark - FIXED: Memoize with proper dependencies
  const toggleBookmark = useCallback((verse: DisplayVerse) => {
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
  }, [surahId, surahName, isAyahSaved, removeAyah, saveAyah]);

  // Handle share
  const handleShare = useCallback((verse: DisplayVerse) => {
    console.log('Share verse:', verse.id);
  }, []);

  // Handle play
  const handlePlay = useCallback((_verse: DisplayVerse) => {
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

  // Render loading state
  const renderLoading = () => (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color={ColorPrimary.primary500} />
      <Body2Medium style={{marginTop: scale(10)}}>Loading verses...</Body2Medium>
    </View>
  );
  
  // Render loading more indicator
  const renderLoadingMore = () => {
    if (!isLoadingMore) return null;
    
    return (
      <View style={styles.loadingMoreContainer}>
        <ActivityIndicator size="small" color={ColorPrimary.primary500} />
        <Body2Medium style={{marginLeft: scale(10)}}>Loading more verses...</Body2Medium>
      </View>
    );
  };

  // Render error state
  const renderError = () => (
    <View style={styles.centerContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={handleRetry}
      >
        <Body2Bold style={styles.retryButtonText}>Retry</Body2Bold>
      </TouchableOpacity>
    </View>
  );

  return (
        <View style={styles.container}>
          {/* Header */}
          <SurahHeader
            onBack={() => navigation.goBack()}
            surahName={surahName}
            surahInfo={surahInfo}
            currentSurahId={surahId}
            onSurahChange={handleSurahChange}
            onSettingsChange={handleSettingsChange}
          />
          
          {/* Content based on state */}
          {isLoading ? (
            renderLoading()
          ) : error ? (
            renderError()
          ) : (
            /* Verses */
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.scrollContent,
                { paddingBottom: showAudioPlayer ? scale(120) : scale(80) }
              ]}
              showsVerticalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
                const paddingToBottom = 20;
                const isCloseToBottom = layoutMeasurement.height + contentOffset.y >=
                  contentSize.height - paddingToBottom;
                
                if (isCloseToBottom) {
                  handleEndReached();
                }
              }}
              scrollEventThrottle={400}
            >
              {verses.map((verse, index) => (
                <VerseItem
                  key={verse.id}
                  verse={verse}
                  index={index}
                  surahName={surahName}
                  surahId={surahId}
                  bookmarkedVerses={bookmarkedVerses}
                  onTafseerPress={handleTafseerPress}
                  onToggleBookmark={toggleBookmark}
                  onShare={handleShare}
                  onPlay={handlePlay}
                />
              ))}
              {renderLoadingMore()}
            </ScrollView>
          )}
          
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
                  verses={verses}
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
  },
  loadingMoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
    height: scale(60),
  },
  errorText: {
    fontSize: scale(16),
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: scale(16),
  },
  retryButton: {
    backgroundColor: ColorPrimary.primary500,
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: scale(8),
  },
  retryButtonText: {
    color: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: scale(80),
  },
  graphicContainer: {
    width: '100%',
    height: verticalScale(80),
    marginTop: -10,
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
});

export default SurahDetailScreen;