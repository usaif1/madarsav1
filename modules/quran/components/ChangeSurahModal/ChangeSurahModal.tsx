import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Title3Bold, Body1Title2Bold } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';

// Define the type for a Surah item
type SurahItem = {
  id: number;
  name: string;
  ayahCount: number;
};

// Sample data for Surahs
const SURAHS: SurahItem[] = [
  { id: 1, name: 'Al-Fatiha', ayahCount: 7 },
  { id: 2, name: 'Al-Baqara', ayahCount: 286 },
  { id: 3, name: 'Al-Imran', ayahCount: 200 },
  { id: 4, name: 'An-Nisa', ayahCount: 176 },
  { id: 5, name: 'Al-Ma\'idah', ayahCount: 120 },
  { id: 6, name: 'Al-An\'am', ayahCount: 165 },
  { id: 7, name: 'Al-A\'raf', ayahCount: 206 },
  { id: 8, name: 'Al-Anfal', ayahCount: 75 },
  { id: 9, name: 'At-Tawbah', ayahCount: 129 },
  { id: 10, name: 'Yunus', ayahCount: 109 },
];

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
  const surahRef = useRef<FlatList>(null);

  const initialSurahIndex = SURAHS.findIndex(s => s.id === currentSurahId);

  // Scroll to initial surah when modal opens
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        surahRef.current?.scrollToOffset({
          offset: Math.max(0, initialSurahIndex - 2) * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, [visible, initialSurahIndex]);

  // Helper: get index from scroll offset
  const indexFromOffset = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    return Math.round(e.nativeEvent.contentOffset.y / ITEM_HEIGHT) + 2;
  };

  // Update selected surah when user scrolls
  const onSurahScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.min(Math.max(0, indexFromOffset(e)), SURAHS.length - 1);
    setSelectedSurahId(SURAHS[idx].id);
  };

  // Handle confirm button press
  const handleConfirm = () => {
    const selectedSurah = SURAHS.find(surah => surah.id === selectedSurahId);
    if (selectedSurah) {
      onSelect(selectedSurah.id, selectedSurah.name);
    }
  };

  // Render a surah item for the carousel
  const renderSurahItem = ({ item }: { item: SurahItem }) => (
    <TouchableOpacity
      style={[
        styles.surahItem,
        selectedSurahId === item.id && styles.selectedSurahItem
      ]}
      onPress={() => {
        setSelectedSurahId(item.id);
        const idx = SURAHS.findIndex(s => s.id === item.id);
        surahRef.current?.scrollToOffset({
          offset: Math.max(0, idx - 2) * ITEM_HEIGHT,
          animated: true,
        });
      }}
    >
      <Body2Medium style={[styles.surahName, selectedSurahId === item.id && styles.selectedSurahName]}>
        {item.name}
      </Body2Medium>
      <Body2Medium style={[styles.ayahCount, selectedSurahId === item.id && styles.selectedAyahCount]}>
        {item.ayahCount}
      </Body2Medium>
    </TouchableOpacity>
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
        
        {/* Surah carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={surahRef}
            data={SURAHS}
            renderItem={renderSurahItem}
            keyExtractor={(item) => item.id.toString()}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={onSurahScrollEnd}
            getItemLayout={(_, i) => ({
              length: ITEM_HEIGHT,
              offset: ITEM_HEIGHT * i,
              index: i,
            })}
            contentContainerStyle={styles.carouselContent}
          />
          {/* Highlight box for selected item */}
          <View style={styles.highlightBox} pointerEvents="none" />
        </View>
        
        {/* Confirm button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.confirmButton}
            onPress={handleConfirm}
            activeOpacity={0.8}
          >
            <Body2Bold style={styles.confirmButtonText}>Confirm</Body2Bold>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 8,
    paddingBottom: 0,
    paddingHorizontal: 0,
    height: Math.min(verticalScale(400), screenHeight * 0.6),
    maxHeight: '60%',
    overflow: 'hidden',
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
    width: 375,
    height: 40,
    backgroundColor: '#F9F6FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: 18,
    gap: scale(6),
  },
  columnTitle: {
    color: '#171717',
    fontWeight: '700',
  },
  carouselContainer: {
    width: 375,
    height: 165,
    paddingHorizontal: 18,
    paddingVertical: scale(8),
    position: 'relative',
    overflow: 'hidden',
  },
  carouselContent: {
    paddingVertical: ITEM_HEIGHT * 2, // Add padding for proper centering
  },
  surahItem: {
    width: 339,
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(10),
    paddingHorizontal: 0,
    borderRadius: 8,
  },
  selectedSurahItem: {
    backgroundColor: '#F5F5F5',
  },
  surahName: {
    color: '#171717',
  },
  selectedSurahName: {
    color: '#171717',
    fontWeight: '600',
  },
  ayahCount: {
    color: '#737373',
  },
  selectedAyahCount: {
    color: '#737373',
    fontWeight: '600',
  },
  highlightBox: {
    position: 'absolute',
    top: (165 / 2) - (ITEM_HEIGHT / 2),
    left: 18,
    right: 18,
    height: ITEM_HEIGHT,
    backgroundColor: 'transparent',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    zIndex: -1,
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
  },
});

export default ChangeSurahModal; 