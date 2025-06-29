import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Title3Bold } from '@/components/Typography/Typography';
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

  // Handle surah selection
  const handleSurahSelect = (surahId: number) => {
    setSelectedSurahId(surahId);
  };

  // Handle confirm button press
  const handleConfirm = () => {
    const selectedSurah = SURAHS.find(surah => surah.id === selectedSurahId);
    if (selectedSurah) {
      onSelect(selectedSurah.id, selectedSurah.name);
    }
  };

  // Render a surah item
  const renderSurahItem = ({ item }: { item: SurahItem }) => (
    <TouchableOpacity 
      style={[
        styles.surahItem,
        selectedSurahId === item.id && styles.selectedSurahItem
      ]}
      onPress={() => handleSurahSelect(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.surahItemLeft}>
        <Body2Medium style={styles.surahNumber}>{item.id}</Body2Medium>
        <Body2Medium>{item.name}</Body2Medium>
      </View>
      <Body2Medium style={styles.ayahCount}>{item.ayahCount}</Body2Medium>
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
        
        {/* Scrollable surah list */}
        <View style={styles.listContainer}>
          <FlatList
            data={SURAHS}
            renderItem={renderSurahItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={true}
            initialNumToRender={10}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
          />
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
    height: Math.min(verticalScale(600), screenHeight * 0.8),
    maxHeight: '80%',
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
  listContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  listContent: {
    paddingBottom: 32,
  },
  surahItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  selectedSurahItem: {
    backgroundColor: ColorPrimary.primary50,
  },
  surahItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  surahNumber: {
    width: scale(30),
    color: '#737373',
  },
  ayahCount: {
    color: '#737373',
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