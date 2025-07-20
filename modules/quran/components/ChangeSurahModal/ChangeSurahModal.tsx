import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body1Title2Medium, Body1Title2Bold, Title3Bold } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import quranService from '../../services/quranService';
import { Chapter } from '../../types/quranFoundationTypes';


// Get screen dimensions for calculations
const { height: screenHeight } = Dimensions.get('window');

const ITEM_HEIGHT = 40;

interface ChangeSurahModalProps {
  visible: boolean;
  currentSurahId: number;
  onSelect: (surahId: number, surahName: string) => void;
  onClose: () => void;
}

const ChangeSurahModal: React.FC<ChangeSurahModalProps> = ({
  visible,
  currentSurahId,
  onSelect,
  onClose,
}) => {
  const [selectedSurahId, setSelectedSurahId] = useState(currentSurahId);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const surahRef = useRef<FlatList>(null);

  // Fetch chapters data
  useEffect(() => {
    const fetchChapters = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const chaptersData = await quranService.getAllChapters();
        setChapters(chaptersData);
      } catch (error) {
        console.error('Failed to fetch chapters:', error);
        setError('Failed to load chapters. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChapters();
  }, []);

  // Reset selected surah when modal opens
  useEffect(() => {
    if (visible && chapters.length > 0) {
      setSelectedSurahId(currentSurahId);
      const initialIndex = chapters.findIndex(s => s.id === currentSurahId);
      if (initialIndex >= 0) {
        setTimeout(() => {
          surahRef.current?.scrollToIndex({
            index: initialIndex,
            animated: false,
            viewPosition: 0.5, // Center the item
          });
        }, 100);
      }
    }
  }, [visible, currentSurahId, chapters]);

  // Handle confirm button press
  const handleConfirm = () => {
    const selectedChapter = chapters.find(chapter => chapter.id === selectedSurahId);
    if (selectedChapter) {
      onSelect(selectedChapter.id, selectedChapter.name_simple);
    }
  };

  // Handle item press
  const handleItemPress = (item: Chapter) => {
    setSelectedSurahId(item.id);
    const index = chapters.findIndex(s => s.id === item.id);
    surahRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  // Render a surah item
  const renderSurahItem = ({ item }: { item: Chapter }) => {
    const isSelected = selectedSurahId === item.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.surahItem,
          isSelected && styles.selectedSurahItem
        ]}
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        <View style={styles.surahItemContent}>
          {isSelected ? (
            <Body1Title2Bold style={styles.selectedSurahName}>
              {item.id}. {item.name_simple}
            </Body1Title2Bold>
          ) : (
            <Body1Title2Medium style={styles.surahName}>
              {item.id}. {item.name_simple}
            </Body1Title2Medium>
          )}
          
          {isSelected ? (
            <Body1Title2Bold style={styles.selectedAyahCount}>
              {item.verses_count}
            </Body1Title2Bold>
          ) : (
            <Body1Title2Medium style={styles.ayahCount}>
              {item.verses_count}
            </Body1Title2Medium>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
        {/* Fixed header */}
        <View style={styles.header}>
          <Title3Bold style={styles.title}>Change Surah</Title3Bold>
          <TouchableOpacity onPress={onClose} hitSlop={16}>
            <CdnSvg path={DUA_ASSETS.CLOSE_ICON} width={scale(16)} height={scale(16)} />
          </TouchableOpacity>
        </View>
        
        {/* Column headings */}
        <View style={styles.columnHeadings}>
          <Body1Title2Bold style={styles.columnTitle}>Surah</Body1Title2Bold>
          <Body1Title2Bold style={styles.columnTitle}>Ayah</Body1Title2Bold>
        </View>
        
        {/* Surah list */}
        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={ColorPrimary.primary500} />
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Body1Title2Medium style={styles.errorText}>{error}</Body1Title2Medium>
            </View>
          ) : (
            <FlatList
              ref={surahRef}
              data={chapters}
              renderItem={renderSurahItem}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              getItemLayout={(_, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                  surahRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                    viewPosition: 0.5,
                  });
                }, 100);
              }}
            />
          )}
        </View>
        
        {/* Confirm button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Body1Title2Bold style={styles.confirmButtonText}>Confirm</Body1Title2Bold>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(16),
  },
  errorText: {
    color: '#FF6B6B',
    textAlign: 'center',
  },
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    paddingBottom: 0,
    paddingHorizontal: 0,
    width: '100%',
    height: Math.min(verticalScale(500), screenHeight * 0.7),
    maxHeight: screenHeight * 0.4,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
  },
  columnHeadings: {
    backgroundColor: '#F9F6FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: 18,
    height: 40,
  },
  columnTitle: {
    color: '#171717',
    fontWeight: '700',
    fontSize: scale(14),
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 18,
    overflow: 'hidden',
  },
  listContent: {
    paddingVertical: scale(8),
  },
  surahItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    paddingHorizontal: scale(10),
    paddingVertical: scale(10),
    borderRadius: 8,
  },
  selectedSurahItem: {
    backgroundColor: '#F5F5F5',
  },
  surahItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahName: {
    color: '#171717',
    fontSize: scale(14),
  },
  selectedSurahName: {
    color: '#171717',
    fontSize: scale(14),
  },
  ayahCount: {
    color: '#737373',
    fontSize: scale(14),
  },
  selectedAyahCount: {
    color: '#737373',
    fontSize: scale(14),
  },
  buttonContainer: {
    padding: scale(16),
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  confirmButton: {
    backgroundColor: ColorPrimary.primary500,
    paddingVertical: scale(12),
    borderRadius: scale(8),
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: scale(14),
  },
});

export default ChangeSurahModal; 