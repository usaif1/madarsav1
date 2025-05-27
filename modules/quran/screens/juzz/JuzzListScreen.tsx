import React, { useState } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JuzzStackParamList } from '../../navigation/juzz.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import SearchInput from '@/modules/hadith/components/SearchInput';
import BookmarkIcon from '@/assets/hadith/bookmark.svg';
import SettingsIcon from '@/assets/quran/settings.svg';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';

// Define the type for a Juzz item
type JuzzItem = {
  id: number;
  name: string;
  surahRange: string;
  ayahCount: number;
  progress?: number; // 0-100 percentage of completion
  bookmarked?: boolean;
};

// Sample data for Juzz
const JUZZ_LIST: JuzzItem[] = [
  { id: 1, name: 'Juzz 1', surahRange: 'Al-Fatihah - Al-Baqarah', ayahCount: 141, progress: 75, bookmarked: true },
  { id: 2, name: 'Juzz 2', surahRange: 'Al-Baqarah', ayahCount: 111, progress: 50, bookmarked: false },
  { id: 3, name: 'Juzz 3', surahRange: 'Al-Baqarah - Al-Imran', ayahCount: 127, progress: 25, bookmarked: false },
  { id: 4, name: 'Juzz 4', surahRange: 'Al-Imran - An-Nisa', ayahCount: 137, progress: 10, bookmarked: true },
  { id: 5, name: 'Juzz 5', surahRange: 'An-Nisa', ayahCount: 124, progress: 0, bookmarked: false },
  { id: 6, name: 'Juzz 6', surahRange: 'An-Nisa - Al-Ma\'idah', ayahCount: 111, progress: 0, bookmarked: false },
  { id: 7, name: 'Juzz 7', surahRange: 'Al-Ma\'idah - Al-An\'am', ayahCount: 121, progress: 0, bookmarked: false },
  { id: 8, name: 'Juzz 8', surahRange: 'Al-An\'am - Al-A\'raf', ayahCount: 111, progress: 0, bookmarked: false },
  { id: 9, name: 'Juzz 9', surahRange: 'Al-A\'raf - Al-Anfal', ayahCount: 127, progress: 0, bookmarked: false },
  { id: 10, name: 'Juzz 10', surahRange: 'Al-Anfal - At-Tawbah', ayahCount: 109, progress: 0, bookmarked: false },
  { id: 11, name: 'Juzz 11', surahRange: 'At-Tawbah - Hud', ayahCount: 123, progress: 0, bookmarked: false },
  { id: 12, name: 'Juzz 12', surahRange: 'Hud - Yusuf', ayahCount: 111, progress: 0, bookmarked: false },
  { id: 13, name: 'Juzz 13', surahRange: 'Yusuf - Ibrahim', ayahCount: 115, progress: 0, bookmarked: false },
  { id: 14, name: 'Juzz 14', surahRange: 'Ibrahim - Al-Hijr', ayahCount: 107, progress: 0, bookmarked: false },
  { id: 15, name: 'Juzz 15', surahRange: 'Al-Hijr - An-Nahl', ayahCount: 128, progress: 0, bookmarked: false },
];

type JuzzListScreenNavigationProp = NativeStackNavigationProp<JuzzStackParamList, 'juzzList'>;

const JuzzListScreen: React.FC = () => {
  const navigation = useNavigation<JuzzListScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJuzz, setFilteredJuzz] = useState(JUZZ_LIST);

  // Handle search input change
  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredJuzz(JUZZ_LIST);
    } else {
      const filtered = JUZZ_LIST.filter(
        juzz => 
          juzz.name.toLowerCase().includes(text.toLowerCase()) ||
          juzz.surahRange.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJuzz(filtered);
    }
  };

  // Handle juzz press
  const handleJuzzPress = (juzz: JuzzItem) => {
    navigation.navigate('juzzDetail', {
      juzzId: juzz.id,
      juzzName: juzz.name
    });
  };

  // Handle settings press
  const handleSettingsPress = () => {
    // Navigate to settings screen (will be implemented later)
    console.log('Settings pressed');
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (juzzId: number) => {
    // Toggle bookmark logic (will be implemented later)
    console.log(`Toggle bookmark for juzz ${juzzId}`);
  };

  // Render a juzz item
  const renderJuzzItem = ({ item }: { item: JuzzItem }) => (
    <TouchableOpacity 
      style={styles.juzzItem}
      onPress={() => handleJuzzPress(item)}
      activeOpacity={0.7}
    >
      {/* Juzz number */}
      <View style={styles.juzzNumberContainer}>
        <Body2Bold style={styles.juzzNumber}>{item.id}</Body2Bold>
      </View>
      
      {/* Juzz details */}
      <View style={styles.juzzDetails}>
        <View style={styles.juzzTitleRow}>
          <Body2Bold>{item.name}</Body2Bold>
          <TouchableOpacity onPress={() => handleBookmarkToggle(item.id)}>
            <BookmarkIcon 
              width={20} 
              height={20} 
              fill={item.bookmarked ? ColorPrimary.primary500 : 'none'} 
              stroke={item.bookmarked ? 'none' : '#737373'}
            />
          </TouchableOpacity>
        </View>
        
        <CaptionMedium style={styles.juzzSubtitle}>
          {item.surahRange} • {item.ayahCount} Ayahs
        </CaptionMedium>
        
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[styles.progressBar, { width: `${item.progress || 0}%` }]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search and settings */}
      <View style={styles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Salam, juzz khojein"
          style={styles.searchInput}
        />
        <TouchableOpacity 
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <SettingsIcon width={20} height={20} />
        </TouchableOpacity>
      </View>
      
      {/* Juzz list */}
      <FlatList
        data={filteredJuzz}
        renderItem={renderJuzzItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      
      {/* Footer image */}
      <HadithImageFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  searchInput: {
    flex: 1,
    marginRight: scale(12),
  },
  settingsButton: {
    padding: scale(8),
    borderRadius: scale(20),
    backgroundColor: '#F5F5F5',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(16),
  },
  juzzItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  juzzNumberContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: ColorPrimary.primary100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  juzzNumber: {
    color: ColorPrimary.primary500,
  },
  juzzDetails: {
    flex: 1,
  },
  juzzTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  juzzSubtitle: {
    color: '#737373',
    marginBottom: scale(6),
  },
  progressBarContainer: {
    height: scale(4),
    backgroundColor: '#F0F0F0',
    borderRadius: scale(2),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: ColorPrimary.primary500,
    borderRadius: scale(2),
  },
});

export default JuzzListScreen;
