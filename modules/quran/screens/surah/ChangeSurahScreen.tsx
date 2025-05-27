import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahStackParamList } from '../../navigation/surah.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body1Medium, Body2Medium, Body1Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import CloseIcon from '@/assets/close.svg';

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

type ChangeSurahScreenRouteProp = RouteProp<SurahStackParamList, 'changeSurah'>;
type ChangeSurahScreenNavigationProp = NativeStackNavigationProp<SurahStackParamList, 'changeSurah'>;

const ChangeSurahScreen: React.FC = () => {
  const route = useRoute<ChangeSurahScreenRouteProp>();
  const navigation = useNavigation<ChangeSurahScreenNavigationProp>();
  const { currentSurahId } = route.params;
  const [selectedSurahId, setSelectedSurahId] = useState(currentSurahId);

  // Handle surah selection
  const handleSurahSelect = (surahId: number) => {
    setSelectedSurahId(surahId);
  };

  // Handle confirm button press
  const handleConfirm = () => {
    // Navigate back to surah detail with the selected surah
    const selectedSurah = SURAHS.find(surah => surah.id === selectedSurahId);
    if (selectedSurah) {
      navigation.navigate('surahDetail', {
        surahId: selectedSurah.id,
        surahName: selectedSurah.name
      });
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
        <Body1Medium>{item.name}</Body1Medium>
      </View>
      <Body2Medium style={styles.ayahCount}>{item.ayahCount}</Body2Medium>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <H5Bold>Change Surah</H5Bold>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <CloseIcon width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Surah list */}
      <FlatList
        data={SURAHS}
        renderItem={renderSurahItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Confirm button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirm}
          activeOpacity={0.8}
        >
          <Body1Bold style={styles.confirmButtonText}>Confirm</Body1Bold>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  surahItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(12),
    paddingHorizontal: scale(8),
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

export default ChangeSurahScreen;
