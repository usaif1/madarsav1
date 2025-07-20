import React, { useState, useCallback, useMemo } from 'react';
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

  // Generate surah list (1-114)
  const surahList = useMemo(() => {
    const surahs = [];
    for (let i = 1; i <= 114; i++) {
      surahs.push({
        id: i,
        name: `Surah ${i}`,
        isCurrentSurah: i === selectedSurahId
      });
    }
    return surahs;
  }, [selectedSurahId]);

  // Generate verse list from current verses data
  const verseList = useMemo(() => {
    return allVerses.map((verse, index) => ({
      id: verse.id,
      number: verse.ayahNumber || verse.id,
      verseKey: verse.verseKey,
      isCurrentVerse: verse.id === selectedAyahId
    }));
  }, [allVerses, selectedAyahId]);

  // Handle surah selection
  const handleSurahSelect = useCallback(async (newSurahId: number, newSurahName: string) => {
    if (newSurahId === selectedSurahId) {
      setShowSurahDropdown(false);
      return;
    }

    setIsLoadingNewData(true);
    try {
      // Fetch new translation and tafsir for the new surah, verse 1
      const [translationResponse, tafsirResponse] = await Promise.all([
        quranService.getSingleTranslation(131, { chapterNumber: newSurahId, verseKey: `${newSurahId}:1` }),
        quranService.getSingleTafsir(169, { chapterNumber: newSurahId, verseKey: `${newSurahId}:1` })
      ]);

      // Update state with new data
      setSelectedSurahId(newSurahId);
      setSelectedSurahName(newSurahName);
      setSelectedAyahId(1);
      setCurrentTranslation(translationResponse.translations[0]?.text || '');
      setCurrentTafsir(tafsirResponse.tafsirs[0]?.text || '');
      
      // Note: We don't have the full verse data for the new surah, so we'll show minimal info
      setCurrentVerse(''); // Will need to fetch this
      setCurrentWords([]);
      
    } catch (error) {
      console.error('Error fetching new surah data:', error);
    } finally {
      setIsLoadingNewData(false);
      setShowSurahDropdown(false);
    }
  }, [selectedSurahId]);

  // Handle verse selection from current loaded verses
  const handleVerseSelect = useCallback(async (verseData: VerseData) => {
    if (verseData.id === selectedAyahId) {
      setShowVerseDropdown(false);
      return;
    }

    setIsLoadingNewData(true);
    try {
      // Use the verse data if available, otherwise fetch new data
      if (verseData.translation && verseData.tafsir) {
        setSelectedAyahId(verseData.id);
        setCurrentTranslation(verseData.translation);
        setCurrentTafsir(verseData.tafsir);
        setCurrentVerse(verseData.arabic);
        setCurrentWords(verseData.words);
      } else {
        // Fetch new translation and tafsir for the selected verse
        const [translationResponse, tafsirResponse] = await Promise.all([
          quranService.getSingleTranslation(131, { verseKey: verseData.verseKey }),
          quranService.getSingleTafsir(169, { verseKey: verseData.verseKey })
        ]);

        setSelectedAyahId(verseData.id);
        setCurrentTranslation(translationResponse.translations[0]?.text || '');
        setCurrentTafsir(tafsirResponse.tafsirs[0]?.text || '');
        setCurrentVerse(verseData.arabic);
        setCurrentWords(verseData.words);
      }
    } catch (error) {
      console.error('Error fetching new verse data:', error);
    } finally {
      setIsLoadingNewData(false);
      setShowVerseDropdown(false);
    }
  }, [selectedAyahId]);

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
          (item) => {
            const verseData = allVerses.find(v => v.id === item.id);
            if (verseData) handleVerseSelect(verseData);
          },
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
                {currentTranslation ? (
                  <View style={styles.translationSection}>
                    <Body1Title2Bold style={styles.translationTitle}>Translation</Body1Title2Bold>
                    <Body2Medium style={styles.translationText}>{currentTranslation}</Body2Medium>
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
  arrowText: {
    color: '#A3A3A3',
    fontSize: 12,
  },
});

export default TafseerModal;