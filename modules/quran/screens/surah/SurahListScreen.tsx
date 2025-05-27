import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahStackParamList } from '../../navigation/surah.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, CaptionMedium } from '@/components/Typography/Typography';
import SearchInput from '@/modules/hadith/components/SearchInput';
import BookmarkIcon from '@/assets/hadith/bookmark.svg';

// Define the type for a Surah item
type SurahItem = {
  id: number;
  name: string;
  arabicName: string;
  translation: string;
  type: 'meccan' | 'medinan';
  ayahCount: number;
};

// Sample data for Surahs
const SURAHS: SurahItem[] = [
  { id: 1, name: 'Al-Fatiah', arabicName: 'الفاتحة', translation: 'The Opening', type: 'meccan', ayahCount: 7 },
  { id: 2, name: 'Al-Baqarah', arabicName: 'البقرة', translation: 'The Cow', type: 'medinan', ayahCount: 286 },
  { id: 3, name: 'Al Imran', arabicName: 'آل عمران', translation: 'Family of Imran', type: 'medinan', ayahCount: 200 },
  { id: 4, name: 'An-Nisa', arabicName: 'النساء', translation: 'The Women', type: 'medinan', ayahCount: 176 },
  { id: 5, name: 'Al-Ma\'idah', arabicName: 'المائدة', translation: 'The Table Spread', type: 'medinan', ayahCount: 120 },
  { id: 6, name: 'Al-An\'am', arabicName: 'الأنعام', translation: 'The Cattle', type: 'meccan', ayahCount: 165 },
  { id: 7, name: 'Al-A\'raf', arabicName: 'الأعراف', translation: 'The Heights', type: 'meccan', ayahCount: 206 },
  { id: 8, name: 'Al-Anfal', arabicName: 'الأنفال', translation: 'The Spoils of War', type: 'medinan', ayahCount: 75 },
  { id: 9, name: 'At-Tawbah', arabicName: 'التوبة', translation: 'The Repentance', type: 'medinan', ayahCount: 129 },
  { id: 10, name: 'Yunus', arabicName: 'يونس', translation: 'Jonah', type: 'meccan', ayahCount: 109 },
];

type SurahListScreenNavigationProp = NativeStackNavigationProp<SurahStackParamList, 'surahList'>;

const SurahListScreen: React.FC = () => {
  const navigation = useNavigation<SurahListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSurahs, setFilteredSurahs] = useState(SURAHS);

  // Handle search input change
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredSurahs(SURAHS);
    } else {
      const filtered = SURAHS.filter(
        surah => 
          surah.name.toLowerCase().includes(text.toLowerCase()) ||
          surah.translation.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSurahs(filtered);
    }
  };

  // Navigate to surah detail screen
  const handleSurahPress = (surah: SurahItem) => {
    navigation.navigate('surahDetail', {
      surahId: surah.id,
      surahName: surah.name
    });
  };

  // Render a surah item
  const renderSurahItem = ({ item, index }: { item: SurahItem; index: number }) => (
    <TouchableOpacity 
      style={styles.surahItem}
      onPress={() => handleSurahPress(item)}
      activeOpacity={0.7}
    >
      {/* Surah number */}
      <View style={styles.numberContainer}>
        <Body2Bold style={styles.numberText}>{index + 1}</Body2Bold>
      </View>
      
      {/* Surah details */}
      <View style={styles.surahDetails}>
        <View style={styles.surahNameRow}>
          <Body2Bold>{item.name}</Body2Bold>
          <Body2Bold style={styles.arabicName}>{item.arabicName}</Body2Bold>
        </View>
        <View style={styles.surahInfoRow}>
          <CaptionMedium style={styles.surahInfo}>
            {item.type === 'meccan' ? 'Meccan' : 'Medinan'} • {item.ayahCount} Ayyahs
          </CaptionMedium>
          <BookmarkIcon width={16} height={16} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search input */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Salam, surah khojein"
          style={styles.searchInput}
        />
      </View>
      
      {/* Surah list */}
      <FlatList
        data={filteredSurahs}
        renderItem={renderSurahItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
  },
  searchInput: {
    width: '100%',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(20),
  },
  surahItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  numberContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: ColorPrimary.primary100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  numberText: {
    color: ColorPrimary.primary500,
  },
  surahDetails: {
    flex: 1,
  },
  surahNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  arabicName: {
    textAlign: 'right',
  },
  surahInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  surahInfo: {
    color: '#737373',
  },
});

export default SurahListScreen;
