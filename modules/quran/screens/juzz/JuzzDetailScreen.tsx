import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Pressable, ActivityIndicator, Share } from 'react-native';
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
import { BubbleIndex } from '../../components/BubbleIndex';
import { useSurahAudio } from '../../hooks/useSurahAudio';

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
  tafsir?: string;
  audioUrl?: string;
  verseKey: string;
};

type JuzzDetailScreenRouteProp = RouteProp<JuzzStackParamList, 'juzzDetail'>;
type JuzzDetailScreenNavigationProp = NativeStackNavigationProp<JuzzStackParamList, 'juzzDetail'>;

// Memoized verse component to prevent unnecessary re-renders
const VerseItem = memo(({
  verse,
  index,
  juzzId,
  juzzName,
  bookmarkedVerses,
  showTransliteration,
  onTafseerPress,
  onToggleBookmark,
  onShare,
  onPlay,
  isCurrentlyPlaying,
  isLoading: verseIsLoading
}: {
  verse: Verse;
  index: number;
  juzzId: number;
  juzzName: string;
  bookmarkedVerses: Set<number>;
  showTransliteration: boolean;
  onTafseerPress: (verse: Verse) => void;
  onToggleBookmark: (verse: Verse) => void;
  onShare: (verse: Verse) => void;
  onPlay: (verse: Verse) => void;
  isCurrentlyPlaying: boolean;
  isLoading: boolean;
}) => {
  // Memoize word boxes with RTL ordering and transliteration toggle
  const wordBoxes = useMemo(() => {
    // Reverse the words array for RTL display (Arabic reads right to left)
    const reversedWords = [...verse.words].reverse();
    
    return (
      <View style={styles.wordsContainer}>
        {reversedWords.map((word, wordIndex) => (
          <View key={`${verse.id}-word-${wordIndex}`} style={styles.wordBox}>
            <H5Medium style={styles.wordArabic}>{word.arabic}</H5Medium>
            {showTransliteration && (
              <Body2Medium style={styles.wordTransliteration}>{word.transliteration}</Body2Medium>
            )}
            <Body2Bold style={styles.wordTranslation}>{word.translation}</Body2Bold>
          </View>
        ))}
      </View>
    );
  }, [verse.words, verse.id, showTransliteration]);

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

  // Memoize play icon based on current state
  const playIcon = useMemo(() => {
    if (verseIsLoading) {
      return <ActivityIndicator size="small" color={ColorPrimary.primary500} />;
    }
    
    return isCurrentlyPlaying ? (
      <CdnSvg
        path={DUA_ASSETS.NAMES_PAUSE}
        width={scale(16)}
        height={scale(16)}
      />
    ) : (
      <CdnSvg
        path={DUA_ASSETS.SURAH_PLAY_ICON}
        width={scale(16)}
        height={scale(16)}
      />
    );
  }, [isCurrentlyPlaying, verseIsLoading]);

  return (
    <View style={[
      styles.verseCard,
      isCurrentlyPlaying && styles.currentlyPlayingCard
    ]}>
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
          {/* Fixed size bubble index */}
          <BubbleIndex 
            number={verse.ayahNumber} 
            isHighlighted={isCurrentlyPlaying}
          />
          
          {/* Word-by-word boxes (reversed for RTL) */}
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
              style={[
                styles.actionButton,
                isCurrentlyPlaying && styles.playingActionButton
              ]}
              onPress={() => onPlay(verse)}
              disabled={verseIsLoading}
            >
              {playIcon}
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
  const { saveAyah, removeAyah, isAyahSaved, settings } = useQuranStore();
  
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

  // Initialize audio hook for the screen
  const audioHook = useSurahAudio(verses, settings.selectedReciterId);

  // Memoize route params to prevent unnecessary re-renders
  const memoizedParams = useMemo(() => ({ juzzId, juzzName }), [juzzId, juzzName]);

  // Get transliteration setting from store
  const showTransliteration = settings.transliterationEnabled;

  // Convert API verse to our Verse format with complete data
  const convertApiVerseToVerse = useCallback((apiVerse: ApiVerse): Verse => {
    // Extract surah ID and name from verse_key (format: "1:1" where 1 is surah ID and 1 is verse number)
    const [surahId, ayahNumber] = apiVerse.verse_key.split(':').map(Number);
    
    // Get translation text
    const wordTranslation = apiVerse.words?.map(word => word.translation?.text || '').filter(t => t.trim()).join(' ');
    const finalTranslation = apiVerse.translation || wordTranslation;
    const translation = apiVerse.translations && apiVerse.translations.length > 0
      ? apiVerse.translations[0].text
      : finalTranslation;
    
    // Get tafsir text
    const tafsir = apiVerse.tafsirs && apiVerse.tafsirs.length > 0
      ? apiVerse.tafsirs[0].text
      : '';
    
    // Create words array from API words if available
    const words: Word[] = apiVerse.words?.map(word => ({
      arabic: word.text_uthmani || word.text,
      transliteration: word.transliteration?.text || '',
      translation: word.translation?.text || ''
    })) || [];
    
    return {
      id: apiVerse.id,
      surahId,
      surahName: `Surah ${surahId}`, // We could fetch the actual surah name if needed
      ayahNumber,
      arabic: apiVerse.text_uthmani,
      translation,
      transliteration: words.map(w => w.transliteration).join(' '),
      words,
      tafsir,
      audioUrl: apiVerse.audio_url,
      verseKey: apiVerse.verse_key || `${surahId}:${ayahNumber}`,
    };
  }, []);
  
  // Fetch verses for the juz with complete data
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
        'en' // language
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

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      audioHook.cleanup();
    };
  }, [audioHook.cleanup]);

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
    // Cleanup current audio before navigation
    audioHook.cleanup();
    
    navigation.navigate('juzzDetail', {
      juzzId: newJuzzId,
      juzzName: newJuzzName
    });
  }, [navigation, audioHook.cleanup]);

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

  // Handle share with improved formatting (no word by word)
  const handleShare = useCallback(async (verse: Verse) => {
    try {
      // Create translation from individual words if not available (left to right for English)
      const wordTranslation = verse.words.map(word => word.translation).filter(t => t.trim()).join(' ');
      const finalTranslation = verse.translation || wordTranslation;
      
      const shareContent = `${verse.arabic}

Translation: ${finalTranslation}

Transliteration: ${verse.transliteration}

${verse.surahName}, Verse ${verse.ayahNumber}${verse.audioUrl ? `\n\nAudio: ${verse.audioUrl}` : ''}`;

      await Share.share({
        message: shareContent,
        title: `${verse.surahName} - Verse ${verse.ayahNumber}`,
      });
    } catch (error) {
      console.error('Error sharing verse:', error);
    }
  }, []);

  // Handle play verse audio
  const handlePlay = useCallback(async (verse: Verse) => {
    try {
      if (audioHook.currentVerseId === verse.id) {
        // If same verse is selected, toggle play/pause
        if (audioHook.isPlaying) {
          audioHook.pauseAudio();
        } else {
          await audioHook.resumeAudio();
        }
      } else {
        // Play new verse
        await audioHook.playAudio(verse.id);
        // Show audio player when playing
        if (!showAudioPlayer) {
          setShowAudioPlayer(true);
        }
      }
    } catch (error) {
      console.error('Error playing verse audio:', error);
    }
  }, [audioHook, showAudioPlayer]);

  // Handle floating play button press
  const handleFloatingPlayPress = useCallback(() => {
    setShowAudioPlayer(true);
  }, []);

  // Handle audio player close
  const handleAudioPlayerClose = useCallback(() => {
    setShowAudioPlayer(false);
    // Don't stop audio, just hide the player
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
      
      {/* Content based on state */}
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
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            
            if (isCloseToBottom && pagination.nextPage && !loadingMore && !loading) {
              fetchVerses(pagination.nextPage);
            }
          }}
          scrollEventThrottle={400}
        >
          {verses.map((verse, index) => (
            <VerseItem
              key={verse.id}
              verse={verse}
              index={index}
              juzzId={juzzId}
              juzzName={juzzName}
              bookmarkedVerses={bookmarkedVerses}
              showTransliteration={showTransliteration}
              onTafseerPress={handleTafseerPress}
              onToggleBookmark={toggleBookmark}
              onShare={handleShare}
              onPlay={handlePlay}
              isCurrentlyPlaying={audioHook.currentVerseId === verse.id && audioHook.isPlaying}
              isLoading={audioHook.currentVerseId === verse.id && audioHook.isLoading}
            />
          ))}
          {loadingMore && (
            <View style={styles.loadingMoreContainer}>
              <ActivityIndicator size="small" color={ColorPrimary.primary600} />
              <Body2Medium style={styles.loadingMoreText}>Loading more verses...</Body2Medium>
            </View>
          )}
        </ScrollView>
      )}
      
      {/* Floating play button - only show when audio is playing but player is hidden */}
      {!showAudioPlayer && (audioHook.isPlaying || audioHook.currentVerseId) && (
        <TouchableOpacity 
          style={styles.floatingButton}
          onPress={handleFloatingPlayPress}
          activeOpacity={0.8}
        >
          <CdnSvg 
            style={{marginLeft: scale(2)}} 
            path={audioHook.isPlaying ? DUA_ASSETS.NAMES_PAUSE_WHITE : DUA_ASSETS.QURAN_PLAY_WHITE_ICON} 
            width={scale(14)} 
            height={scale(16)} 
            fill="#FFFFFF" 
          />
        </TouchableOpacity>
      )}
      
      {/* Juzz Audio Player */}
      {showAudioPlayer && (audioHook.isPlaying || audioHook.currentVerseId) && (
        <View style={styles.audioPlayerOverlay}>
          <Pressable 
            style={styles.audioPlayerBackdrop}
            onPress={handleAudioPlayerClose}
          />
          <View style={styles.audioPlayerWrapper}>
            <SurahAudioPlayer
              surahId={juzzId}
              surahName={juzzName}
              verses={verses}
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
       
      {/* Tafseer Modal with verse data */}
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
          tafsir={selectedVerse.tafsir}
          allVerses={verses} // Pass all verses for dropdown
          currentVerseIndex={verses.findIndex(v => v.id === selectedVerse.id)}
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
  currentlyPlayingCard: {
    backgroundColor: '#F9F6FF',
    borderLeftWidth: 4,
    borderLeftColor: ColorPrimary.primary500,
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
  wordsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  wordBox: {
    width: 72,
    height: 80, // Increased height for better spacing
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(2),
    padding: scale(6), // Increased padding
    paddingVertical: scale(8), // Extra vertical padding
  },
  wordArabic: {
    fontSize: 18, // Slightly smaller to fit better
    lineHeight: 18 * 1.2, // Tighter line height
    textAlign: 'center',
    color: '#171717',
    marginBottom: scale(2), // Small margin to separate from transliteration
  },
  wordTransliteration: {
    fontSize: 9, // Slightly smaller
    lineHeight: 9 * 1.2, // Tighter line height
    textAlign: 'center',
    color: '#525252',
    fontWeight: '400',
    marginBottom: scale(1), // Small margin to separate from translation
  },
  wordTranslation: {
    fontSize: 9, // Slightly smaller
    lineHeight: 9 * 1.2, // Tighter line height
    textAlign: 'center',
    color: '#525252',
    fontWeight: '600',
    paddingHorizontal: scale(2), // Side padding to prevent overflow
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
  playingActionButton: {
    backgroundColor: ColorPrimary.primary100,
    borderRadius: scale(20),
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

export default JuzzDetailScreen;