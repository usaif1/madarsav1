import React, { useState, useRef, useEffect } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body1Title2Medium, Body1Title2Bold, Title3Bold } from '@/components/Typography/Typography';
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
  { id: 1, name: 'Al-Faatiha', ayahCount: 7 },
  { id: 2, name: 'Al-Baqara', ayahCount: 286 },
  { id: 3, name: 'Aal-i-Imraan', ayahCount: 200 },
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

  // Reset selected surah when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedSurahId(currentSurahId);
      const initialIndex = SURAHS.findIndex(s => s.id === currentSurahId);
      setTimeout(() => {
        surahRef.current?.scrollToIndex({
          index: initialIndex,
          animated: false,
          viewPosition: 0.5, // Center the item
        });
      }, 100);
    }
  }, [visible, currentSurahId]);

  // Handle confirm button press
  const handleConfirm = () => {
    const selectedSurah = SURAHS.find(surah => surah.id === selectedSurahId);
    if (selectedSurah) {
      onSelect(selectedSurah.id, selectedSurah.name);
    }
  };

  // Handle item press
  const handleItemPress = (item: SurahItem) => {
    setSelectedSurahId(item.id);
    const index = SURAHS.findIndex(s => s.id === item.id);
    surahRef.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  };

  // Render a surah item
  const renderSurahItem = ({ item }: { item: SurahItem }) => {
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
              {item.id}. {item.name}
            </Body1Title2Bold>
          ) : (
            <Body1Title2Medium style={styles.surahName}>
              {item.id}. {item.name}
            </Body1Title2Medium>
          )}
          
          {isSelected ? (
            <Body1Title2Bold style={styles.selectedAyahCount}>
              {item.ayahCount}
            </Body1Title2Bold>
          ) : (
            <Body1Title2Medium style={styles.ayahCount}>
              {item.ayahCount}
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
          <FlatList
            ref={surahRef}
            data={SURAHS}
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
    height: Math.min(verticalScale(300), screenHeight * 0.7),
    maxHeight: '40%',
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
    maxHeight: scale(200),
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