import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import Modal from 'react-native-modal';

// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Body1Title2Bold, Body1Title2Regular, H5Medium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { BubbleIndex } from '../../components/BubbleIndex';
import quranService from '../../services/quranService';

interface Word {
  arabic: string;
  transliteration: string;
  translation: string;
}

interface VerseData {
  id: number;
  arabic: string;
  translation: string;
  transliteration: string;
  words: Word[];
  tafsir?: string;
  verseKey: string;
  surahId?: number;
  ayahNumber?: number;
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
  tafsir?: string;
  allVerses?: VerseData[];
  currentVerseIndex?: number;
}

const TafseerModal: React.FC<TafseerModalProps> = ({
  visible,
  onClose,
  surahId,
  surahName,
  ayahId,
  verse,
  words = [],
  translation = "",
  tafsir = "",
  allVerses = [],
  currentVerseIndex = 0
}) => {
  const [showSurahDropdown, setShowSurahDropdown] = useState(false);
  const [showVerseDropdown, setShowVerseDropdown] = useState(false);
  const [selectedSurahId, setSelectedSurahId] = useState(surahId);
  const [selectedSurahName, setSelectedSurahName] = useState(surahName);
  const [selectedAyahId, setSelectedAyahId] = useState(ayahId);
  const [currentTranslation, setCurrentTranslation] = useState(translation);
  const [currentTafsir, setCurrentTafsir] = useState(tafsir);
  const [currentWords, setCurrentWords] = useState(words);
  const [currentVerse, setCurrentVerse] = useState(verse);
  const [isLoadingNewData, setIsLoadingNewData] = useState(false);
  const [chapters, setChapters] = useState<Array<{id: number, name: string, verses_count: number}>>([]);
  const [selectedChapterVerseCount, setSelectedChapterVerseCount] = useState(114); // Default fallback

  // Fetch chapters list on component mount
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const chaptersData = await quranService.getAllChapters();
        const formattedChapters = chaptersData.map(chapter => ({
          id: chapter.id,
          name: chapter.name_simple,
          verses_count: chapter.verses_count
        }));
        setChapters(formattedChapters);
        
        // Set current chapter verse count
        const currentChapter = formattedChapters.find(ch => ch.id === selectedSurahId);
        if (currentChapter) {
          setSelectedChapterVerseCount(currentChapter.verses_count);
        }
      } catch (error) {
        console.error('Error fetching chapters:', error);
      }
    };

    if (visible) {
      fetchChapters();
    }
  }, [visible, selectedSurahId]);

  // Generate surah list from fetched chapters
  const surahList = useMemo(() => {
    return chapters.map(chapter => ({
      id: chapter.id,
      name: chapter.name,
      versesCount: chapter.verses_count,
      isCurrentSurah: chapter.id === selectedSurahId
    }));
  }, [chapters, selectedSurahId]);

  // Generate verse list based on selected chapter or current verses
  const verseList = useMemo(() => {
    // If we're looking at a different surah, generate verse numbers based on verse count
    if (selectedSurahId !== surahId) {
      const verseCount = selectedChapterVerseCount;
      const verses = [];
      for (let i = 1; i <= verseCount; i++) {
        verses.push({
          id: i,
          number: i,
          verseKey: `${selectedSurahId}:${i}`,
          isCurrentVerse: i === selectedAyahId
        });
      }
      return verses;
    }
    
    // For current surah, use loaded verses
    return allVerses.map((verse, index) => ({
      id: verse.id,
      number: verse.ayahNumber || verse.id,
      verseKey: verse.verseKey,
      isCurrentVerse: verse.id === selectedAyahId
    }));
  }, [allVerses, selectedAyahId, selectedSurahId, surahId, selectedChapterVerseCount]);

  // Handle surah selection
  const handleSurahSelect = useCallback(async (newSurahId: number, newSurahName: string) => {
    if (newSurahId === selectedSurahId) {
      setShowSurahDropdown(false);
      return;
    }

    setIsLoadingNewData(true);
    try {
      // Update selected chapter verse count
      const selectedChapter = chapters.find(ch => ch.id === newSurahId);
      if (selectedChapter) {
        setSelectedChapterVerseCount(selectedChapter.verses_count);
      }

      // Fetch new translation and tafsir for the new surah, verse 1
      const ayahKey = `${newSurahId}:1`;
      const [translationResponse, tafsirResponse] = await Promise.all([
        quranService.getTranslationByAyah(131, ayahKey),
        quranService.getTafsirByAyah(169, ayahKey)
      ]);

      // Update state with new data
      setSelectedSurahId(newSurahId);
      setSelectedSurahName(newSurahName);
      setSelectedAyahId(1);
      setCurrentTranslation(translationResponse.translations[0]?.text || '');
      setCurrentTafsir(tafsirResponse.tafsir?.text || '');
      
      // Clear verse and words since we don't have full verse data for new surah
      setCurrentVerse('');
      setCurrentWords([]);
      
    } catch (error) {
      console.error('Error fetching new surah data:', error);
    } finally {
      setIsLoadingNewData(false);
      setShowSurahDropdown(false);
    }
  }, [selectedSurahId, chapters]);

  // Handle verse selection
  const handleVerseSelect = useCallback(async (verseData: any) => {
    if (verseData.number === selectedAyahId) {
      setShowVerseDropdown(false);
      return;
    }

    setIsLoadingNewData(true);
    try {
      // Check if we have the verse data locally (same surah)
      if (selectedSurahId === surahId) {
        const localVerse = allVerses.find(v => v.id === verseData.id);
        if (localVerse && localVerse.translation && localVerse.tafsir) {
          setSelectedAyahId(localVerse.id);
          setCurrentTranslation(localVerse.translation);
          setCurrentTafsir(localVerse.tafsir);
          setCurrentVerse(localVerse.arabic);
          setCurrentWords(localVerse.words);
          setIsLoadingNewData(false);
          setShowVerseDropdown(false);
          return;
        }
      }

      // Fetch new translation and tafsir for the selected verse
      const ayahKey = verseData.verseKey;
      const [translationResponse, tafsirResponse] = await Promise.all([
        quranService.getTranslationByAyah(131, ayahKey),
        quranService.getTafsirByAyah(169, ayahKey)
      ]);

      setSelectedAyahId(verseData.number);
      setCurrentTranslation(translationResponse.translations[0]?.text || '');
      setCurrentTafsir(tafsirResponse.tafsir?.text || '');
      
      // For verses from different surahs, we don't have the Arabic text and words
      setCurrentVerse('');
      setCurrentWords([]);
      
    } catch (error) {
      console.error('Error fetching new verse data:', error);
    } finally {
      setIsLoadingNewData(false);
      setShowVerseDropdown(false);
    }
  }, [selectedAyahId, selectedSurahId, surahId, allVerses]);

  // Generate translation from words if not available
  const generateTranslationFromWords = useCallback((wordsArray: Word[]) => {
    return wordsArray
      .map(word => word.translation)
      .filter(translation => translation && translation.trim())
      .join(' ');
  }, []);

  // Render word boxes with RTL ordering
  const renderWordBoxes = (wordsArray: Word[]) => {
    if (!wordsArray.length) return null;
    
    // Reverse for RTL display
    const reversedWords = [...wordsArray].reverse();
    
    return (
      <View style={styles.wordsContainer}>
        {reversedWords.map((word, index) => (
          <View key={index} style={styles.wordBox}>
            <H5Medium style={styles.wordArabic}>{word.arabic}</H5Medium>
            <Body2Medium style={styles.wordTransliteration}>{word.transliteration}</Body2Medium>
            <Body2Bold style={styles.wordTranslation}>{word.translation}</Body2Bold>
          </View>
        ))}
      </View>
    );
  };

  // Render dropdown list
  const renderDropdown = (
    data: any[],
    onSelect: (item: any) => void,
    keyExtractor: (item: any) => string,
    renderItem: (item: any) => React.ReactNode
  ) => (
    <View style={styles.dropdownContainer}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.dropdownItem,
              item.isCurrentSurah || item.isCurrentVerse ? styles.selectedDropdownItem : null
            ]}
            onPress={() => onSelect(item)}
          >
            {renderItem(item)}
          </TouchableOpacity>
        )}
        style={styles.dropdownList}
        showsVerticalScrollIndicator={true}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </View>
  );

  // Get display translation (from words if original not available)
  const displayTranslation = useMemo(() => {
    if (currentTranslation) return currentTranslation;
    if (currentWords.length > 0) return generateTranslationFromWords(currentWords);
    return '';
  }, [currentTranslation, currentWords, generateTranslationFromWords]);

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
            <TouchableOpacity 
              style={styles.surahButton}
              onPress={() => {
                setShowSurahDropdown(!showSurahDropdown);
                setShowVerseDropdown(false);
              }}
            >
              <Body2Medium style={styles.surahButtonText}>{selectedSurahName}</Body2Medium>
              <CdnSvg 
                path={DUA_ASSETS.SURAH_DOWN_ARROW} 
                width={scale(10)} 
                height={scale(10)} 
              />
            </TouchableOpacity>

            {/* Verse Selection Button */}
            <TouchableOpacity 
              style={styles.verseButton}
              onPress={() => {
                setShowVerseDropdown(!showVerseDropdown);
                setShowSurahDropdown(false);
              }}
            >
              <Body2Medium style={styles.verseButtonText}>Verse {selectedAyahId}</Body2Medium>
              <CdnSvg 
                path={DUA_ASSETS.SURAH_DOWN_ARROW} 
                width={scale(10)} 
                height={scale(10)} 
              />
            </TouchableOpacity>
          </View>

          {/* Close Button */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <CdnSvg path={DUA_ASSETS.QURAN_CLOSE_ICON} width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Dropdown overlays */}
        {showSurahDropdown && renderDropdown(
          surahList,
          (item) => handleSurahSelect(item.id, item.name),
          (item) => item.id.toString(),
          (item) => (
            <Body2Medium style={[
              styles.dropdownText,
              item.isCurrentSurah ? styles.selectedDropdownText : null
            ]}>
              {item.name}
            </Body2Medium>
          )
        )}

        {showVerseDropdown && renderDropdown(
          verseList,
          (item) => handleVerseSelect(item),
          (item) => item.id.toString(),
          (item) => (
            <Body2Medium style={[
              styles.dropdownText,
              item.isCurrentVerse ? styles.selectedDropdownText : null
            ]}>
              Verse {item.number}
            </Body2Medium>
          )
        )}

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Loading state */}
          {isLoadingNewData ? (
            <View style={styles.loadingContainer}>
              <Body2Medium>Loading verse data...</Body2Medium>
            </View>
          ) : (
            <>
              {/* Verse Content */}
              <View style={styles.verseContent}>
                {/* Top row with bubble index and word boxes */}
                <View style={styles.topRow}>
                  {/* Fixed size bubble index */}
                  <BubbleIndex number={selectedAyahId} />
                  
                  {/* Word-by-word boxes (reversed for RTL) */}
                  {renderWordBoxes(currentWords)}
                </View>
                
                {/* Translation section */}
                {displayTranslation ? (
                  <View style={styles.translationSection}>
                    <Body1Title2Bold style={styles.translationTitle}>Translation</Body1Title2Bold>
                    <Body2Medium style={styles.translationText}>{displayTranslation}</Body2Medium>
                  </View>
                ) : null}
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
                      width={scale(10)} 
                      height={scale(10)} 
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.tafseerButton}>
                    <Body2Medium style={styles.tafseerButtonText}>Author name</Body2Medium>
                    <CdnSvg 
                      path={DUA_ASSETS.SURAH_DOWN_ARROW} 
                      width={scale(10)} 
                      height={scale(10)} 
                    />
                  </TouchableOpacity>
                </View>
                
                {/* Tafseer Content */}
                <Body2Medium style={styles.tafseerText}>
                  {currentTafsir || "Tafseer content will be loaded based on the selected verse."}
                </Body2Medium>
              </View>
            </>
          )}
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
    width: '100%',
    height: Math.min(verticalScale(800), screenHeight * 0.9),
    maxHeight: screenHeight * 0.95,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    zIndex: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  surahButton: {
    minWidth: 111,
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
  dropdownContainer: {
    position: 'absolute',
    top: scale(70), // Below header
    left: scale(16),
    right: scale(16),
    backgroundColor: '#FFFFFF',
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    maxHeight: screenHeight * 0.4, // 40% of screen height
    zIndex: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownList: {
    maxHeight: screenHeight * 0.4,
  },
  dropdownItem: {
    paddingVertical: scale(12),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedDropdownItem: {
    backgroundColor: '#F0EAFB',
  },
  dropdownText: {
    color: '#404040',
  },
  selectedDropdownText: {
    color: ColorPrimary.primary500,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: scale(40),
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
  wordsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  wordBox: {
    width: 72,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(2),
    padding: scale(6),
    paddingVertical: scale(8),
  },
  wordArabic: {
    fontSize: 18,
    lineHeight: 18 * 1.2,
    textAlign: 'center',
    color: '#171717',
    marginBottom: scale(2),
  },
  wordTransliteration: {
    fontSize: 9,
    lineHeight: 9 * 1.2,
    textAlign: 'center',
    color: '#525252',
    fontWeight: '400',
    marginBottom: scale(1),
  },
  wordTranslation: {
    fontSize: 9,
    lineHeight: 9 * 1.2,
    textAlign: 'center',
    color: '#525252',
    fontWeight: '600',
    paddingHorizontal: scale(2),
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
  tafseerTitle: {
    fontSize: 14,
    lineHeight: 14 * 1.45,
    color: '#0A0A0A',
    fontWeight: '700',
  },
  tafseerText: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: '#404040',
  },
});

export default TafseerModal;