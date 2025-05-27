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

// Define the type for a saved verse
type SavedVerse = {
  id: number;
  surahId: number;
  surahName: string;
  verseNumber: number;
  arabic: string;
  translation: string;
  dateAdded: string;
};

// Sample data for saved verses
const SAVED_VERSES: SavedVerse[] = [
  {
    id: 1,
    surahId: 1,
    surahName: 'Al-Fatiha',
    verseNumber: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the Name of Allah—the Most Compassionate, Most Merciful.',
    dateAdded: '2025-05-20',
  },
  {
    id: 2,
    surahId: 2,
    surahName: 'Al-Baqarah',
    verseNumber: 255,
    arabic: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ',
    translation: 'Allah! There is no god ˹worthy of worship˺ except Him, the Ever-Living, the Sustainer of all.',
    dateAdded: '2025-05-18',
  },
  {
    id: 3,
    surahId: 3,
    surahName: 'Al-Imran',
    verseNumber: 8,
    arabic: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً ۚ إِنَّكَ أَنتَ الْوَهَّابُ',
    translation: 'Our Lord! Do not let our hearts deviate after You have guided us. Grant us Your mercy. You are indeed the Giver of all bounties.',
    dateAdded: '2025-05-15',
  },
];

type SavedAyahsScreenNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedAyahs'>;

const SavedAyahsScreen: React.FC = () => {
  const navigation = useNavigation<SavedAyahsScreenNavigationProp>();

  // Handle verse press
  const handleVersePress = (verse: SavedVerse) => {
    navigation.navigate('savedAyahDetail', {
      ayahId: verse.id,
      surahName: verse.surahName,
      verseNumber: verse.verseNumber
    });
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle remove from saved
  const handleRemoveFromSaved = (verseId: number) => {
    // Remove from saved logic will be implemented later
    console.log(`Remove verse ${verseId} from saved`);
  };

  // Render a saved verse item
  const renderSavedVerseItem = ({ item }: { item: SavedVerse }) => (
    <TouchableOpacity 
      style={styles.verseItem}
      onPress={() => handleVersePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.verseHeader}>
        <View style={styles.verseInfo}>
          <Body2Bold>{item.surahName}</Body2Bold>
          <CaptionMedium style={styles.verseNumber}>Ayah {item.verseNumber}</CaptionMedium>
        </View>
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => handleRemoveFromSaved(item.id)}
        >
          <BookmarkFillIcon width={20} height={20} fill={ColorPrimary.primary500} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.arabicContainer}>
        <Body2Bold style={styles.arabicText}>{item.arabic}</Body2Bold>
      </View>
      
      <View style={styles.translationContainer}>
        <Body2Medium style={styles.translationText}>{item.translation}</Body2Medium>
      </View>
      
      <CaptionMedium style={styles.dateAdded}>Saved on {item.dateAdded}</CaptionMedium>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <H5Bold style={styles.emptyTitle}>No saved verses yet</H5Bold>
      <Body2Medium style={styles.emptyText}>
        Bookmark your favorite verses to access them quickly here.
      </Body2Medium>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <H5Bold style={styles.headerTitle}>Saved Ayahs</H5Bold>
        <View style={styles.headerRight} />
      </View>
      
      {/* Verse list */}
      <FlatList
        data={SAVED_VERSES}
        renderItem={renderSavedVerseItem}
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
  verseItem: {
    padding: scale(16),
    backgroundColor: '#FAFAFA',
    borderRadius: scale(8),
    marginBottom: scale(16),
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  verseInfo: {
    flex: 1,
  },
  verseNumber: {
    color: '#737373',
    marginTop: scale(4),
  },
  bookmarkButton: {
    padding: scale(4),
  },
  arabicContainer: {
    marginBottom: scale(12),
  },
  arabicText: {
    fontSize: scale(18),
    lineHeight: scale(32),
    textAlign: 'right',
    color: '#171717',
  },
  translationContainer: {
    marginBottom: scale(12),
  },
  translationText: {
    color: '#404040',
    lineHeight: scale(20),
  },
  dateAdded: {
    color: '#737373',
    textAlign: 'right',
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

export default SavedAyahsScreen;
