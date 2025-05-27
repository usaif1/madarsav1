import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import BackButton from '@/components/BackButton/BackButton';
import BookmarkFillIcon from '@/assets/hadith/bookmarked.svg';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';

// Define the type for a saved surah
type SavedSurah = {
  id: number;
  name: string;
  arabicName: string;
  type: 'meccan' | 'medinan';
  ayahCount: number;
  progress: number; // 0-100 percentage of completion
};

// Sample data for saved surahs
const SAVED_SURAHS: SavedSurah[] = [
  { id: 1, name: 'Al-Fatiah', arabicName: 'الفاتحة', type: 'meccan', ayahCount: 7, progress: 100 },
  { id: 3, name: 'Al \'Imran', arabicName: 'آل عمران', type: 'medinan', ayahCount: 200, progress: 45 },
];

type SavedSurahsScreenNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedSurahs'>;

const SavedSurahsScreen: React.FC = () => {
  const navigation = useNavigation<SavedSurahsScreenNavigationProp>();

  // Handle surah press
  const handleSurahPress = (surah: SavedSurah) => {
    navigation.navigate('savedSurahDetail', {
      surahId: surah.id,
      surahName: surah.name
    });
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (surahId: number) => {
    // Toggle bookmark logic (will be implemented later)
    console.log(`Toggle bookmark for surah ${surahId}`);
  };

  // Render a saved surah item
  const renderSavedSurahItem = ({ item }: { item: SavedSurah }) => (
    <TouchableOpacity 
      style={styles.surahItem}
      onPress={() => handleSurahPress(item)}
      activeOpacity={0.7}
    >
      {/* Surah number */}
      <View style={styles.numberContainer}>
        <Body2Bold style={styles.numberText}>{item.id}</Body2Bold>
      </View>
      
      {/* Surah details */}
      <View style={styles.surahDetails}>
        <View style={styles.surahNameRow}>
          <Body2Bold>{item.name}</Body2Bold>
          <TouchableOpacity onPress={() => handleBookmarkToggle(item.id)}>
            <BookmarkFillIcon width={20} height={20} fill={ColorPrimary.primary500} />
          </TouchableOpacity>
        </View>
        <CaptionMedium style={styles.surahInfo}>
          {item.type === 'meccan' ? 'Meccan' : 'Medinan'} • {item.ayahCount} Ayyahs
        </CaptionMedium>
        
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[styles.progressBar, { width: `${item.progress}%` }]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <H5Bold style={styles.emptyTitle}>No saved surahs yet</H5Bold>
      <Body2Medium style={styles.emptyText}>
        Bookmark your favorite surahs to access them quickly here.
      </Body2Medium>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <H5Bold style={styles.headerTitle}>Saved Surahs</H5Bold>
        <View style={styles.headerRight} />
      </View>
      
      {/* Surah list */}
      <FlatList
        data={SAVED_SURAHS}
        renderItem={renderSavedSurahItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      
      {/* Footer */}
      <HadithImageFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: scale(24), // Same width as back button for balanced layout
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    flexGrow: 1,
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
  surahInfo: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(32),
    paddingVertical: scale(64),
  },
  emptyTitle: {
    marginBottom: scale(8),
  },
  emptyText: {
    textAlign: 'center',
    color: '#737373',
  },
});

export default SavedSurahsScreen;
