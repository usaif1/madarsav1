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
  { id: 11, name: 'Hud', ayahCount: 123 },
  { id: 12, name: 'Yusuf', ayahCount: 111 },
  { id: 13, name: 'Ar-Ra\'d', ayahCount: 43 },
  { id: 14, name: 'Ibrahim', ayahCount: 52 },
  { id: 15, name: 'Al-Hijr', ayahCount: 99 },
  { id: 16, name: 'An-Nahl', ayahCount: 128 },
  { id: 17, name: 'Al-Isra', ayahCount: 111 },
  { id: 18, name: 'Al-Kahf', ayahCount: 110 },
  { id: 19, name: 'Maryam', ayahCount: 98 },
  { id: 20, name: 'Taha', ayahCount: 135 },
  { id: 21, name: 'Al-Anbya', ayahCount: 112 },
  { id: 22, name: 'Al-Hajj', ayahCount: 78 },
  { id: 23, name: 'Al-Mu\'minun', ayahCount: 118 },
  { id: 24, name: 'An-Nur', ayahCount: 64 },
  { id: 25, name: 'Al-Furqan', ayahCount: 77 },
  { id: 26, name: 'Ash-Shu\'ara', ayahCount: 227 },
  { id: 27, name: 'An-Naml', ayahCount: 93 },
  { id: 28, name: 'Al-Qasas', ayahCount: 88 },
  { id: 29, name: 'Al-\'Ankabut', ayahCount: 69 },
  { id: 30, name: 'Ar-Rum', ayahCount: 60 },
  { id: 31, name: 'Luqman', ayahCount: 34 },
  { id: 32, name: 'As-Sajdah', ayahCount: 30 },
  { id: 33, name: 'Al-Ahzab', ayahCount: 73 },
  { id: 34, name: 'Saba', ayahCount: 54 },
  { id: 35, name: 'Fatir', ayahCount: 45 },
  { id: 36, name: 'Ya-Sin', ayahCount: 83 },
  { id: 37, name: 'As-Saffat', ayahCount: 182 },
  { id: 38, name: 'Sad', ayahCount: 88 },
  { id: 39, name: 'Az-Zumar', ayahCount: 75 },
  { id: 40, name: 'Ghafir', ayahCount: 85 },
  { id: 41, name: 'Fussilat', ayahCount: 54 },
  { id: 42, name: 'Ash-Shuraa', ayahCount: 53 },
  { id: 43, name: 'Az-Zukhruf', ayahCount: 89 },
  { id: 44, name: 'Ad-Dukhan', ayahCount: 59 },
  { id: 45, name: 'Al-Jathiyah', ayahCount: 37 },
  { id: 46, name: 'Al-Ahqaf', ayahCount: 35 },
  { id: 47, name: 'Muhammad', ayahCount: 38 },
  { id: 48, name: 'Al-Fath', ayahCount: 29 },
  { id: 49, name: 'Al-Hujurat', ayahCount: 18 },
  { id: 50, name: 'Qaf', ayahCount: 45 },
  { id: 51, name: 'Adh-Dhariyat', ayahCount: 60 },
  { id: 52, name: 'At-Tur', ayahCount: 49 },
  { id: 53, name: 'An-Najm', ayahCount: 62 },
  { id: 54, name: 'Al-Qamar', ayahCount: 55 },
  { id: 55, name: 'Ar-Rahman', ayahCount: 78 },
  { id: 56, name: 'Al-Waqi\'ah', ayahCount: 96 },
  { id: 57, name: 'Al-Hadid', ayahCount: 29 },
  { id: 58, name: 'Al-Mujadila', ayahCount: 22 },
  { id: 59, name: 'Al-Hashr', ayahCount: 24 },
  { id: 60, name: 'Al-Mumtahanah', ayahCount: 13 },
  { id: 61, name: 'As-Saff', ayahCount: 14 },
  { id: 62, name: 'Al-Jumu\'ah', ayahCount: 11 },
  { id: 63, name: 'Al-Munafiqun', ayahCount: 11 },
  { id: 64, name: 'At-Taghabun', ayahCount: 18 },
  { id: 65, name: 'At-Talaq', ayahCount: 12 },
  { id: 66, name: 'At-Tahrim', ayahCount: 12 },
  { id: 67, name: 'Al-Mulk', ayahCount: 30 },
  { id: 68, name: 'Al-Qalam', ayahCount: 52 },
  { id: 69, name: 'Al-Haqqah', ayahCount: 52 },
  { id: 70, name: 'Al-Ma\'arij', ayahCount: 44 },
  { id: 71, name: 'Nuh', ayahCount: 28 },
  { id: 72, name: 'Al-Jinn', ayahCount: 28 },
  { id: 73, name: 'Al-Muzzammil', ayahCount: 20 },
  { id: 74, name: 'Al-Muddaththir', ayahCount: 56 },
  { id: 75, name: 'Al-Qiyamah', ayahCount: 40 },
  { id: 76, name: 'Al-Insan', ayahCount: 31 },
  { id: 77, name: 'Al-Mursalat', ayahCount: 50 },
  { id: 78, name: 'An-Naba', ayahCount: 40 },
  { id: 79, name: 'An-Nazi\'at', ayahCount: 46 },
  { id: 80, name: 'Abasa', ayahCount: 42 },
  { id: 81, name: 'At-Takwir', ayahCount: 29 },
  { id: 82, name: 'Al-Infitar', ayahCount: 19 },
  { id: 83, name: 'Al-Mutaffifin', ayahCount: 36 },
  { id: 84, name: 'Al-Inshiqaq', ayahCount: 25 },
  { id: 85, name: 'Al-Buruj', ayahCount: 22 },
  { id: 86, name: 'At-Tariq', ayahCount: 17 },
  { id: 87, name: 'Al-A\'la', ayahCount: 19 },
  { id: 88, name: 'Al-Ghashiyah', ayahCount: 26 },
  { id: 89, name: 'Al-Fajr', ayahCount: 30 },
  { id: 90, name: 'Al-Balad', ayahCount: 20 },
  { id: 91, name: 'Ash-Shams', ayahCount: 15 },
  { id: 92, name: 'Al-Layl', ayahCount: 21 },
  { id: 93, name: 'Ad-Duhaa', ayahCount: 11 },
  { id: 94, name: 'Ash-Sharh', ayahCount: 8 },
  { id: 95, name: 'At-Tin', ayahCount: 8 },
  { id: 96, name: 'Al-\'Alaq', ayahCount: 19 },
  { id: 97, name: 'Al-Qadr', ayahCount: 5 },
  { id: 98, name: 'Al-Bayyinah', ayahCount: 8 },
  { id: 99, name: 'Az-Zalzalah', ayahCount: 8 },
  { id: 100, name: 'Al-\'Adiyat', ayahCount: 11 },
  { id: 101, name: 'Al-Qari\'ah', ayahCount: 11 },
  { id: 102, name: 'At-Takathur', ayahCount: 8 },
  { id: 103, name: 'Al-\'Asr', ayahCount: 3 },
  { id: 104, name: 'Al-Humazah', ayahCount: 9 },
  { id: 105, name: 'Al-Fil', ayahCount: 5 },
  { id: 106, name: 'Quraysh', ayahCount: 4 },
  { id: 107, name: 'Al-Ma\'un', ayahCount: 7 },
  { id: 108, name: 'Al-Kawthar', ayahCount: 3 },
  { id: 109, name: 'Al-Kafirun', ayahCount: 6 },
  { id: 110, name: 'An-Nasr', ayahCount: 3 },
  { id: 111, name: 'Al-Masad', ayahCount: 5 },
  { id: 112, name: 'Al-Ikhlas', ayahCount: 4 },
  { id: 113, name: 'Al-Falaq', ayahCount: 5 },
  { id: 114, name: 'An-Nas', ayahCount: 6 },
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
    height: Math.min(verticalScale(500), screenHeight * 0.7),
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