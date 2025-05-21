// modules/hadith/screens/HadithInfoScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { Title3Bold, Body1Title2Medium, Body2Medium } from '@/components/Typography/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import SearchInput from '../components/SearchInput';
import HadithInfoCard from '../components/HadithInfoCard';
import HadithImageFooter from '../components/HadithImageFooter';
import SavedFooter from '../components/SavedFooter';
import { useCollection, useBooks } from '../hooks/useHadith';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorMessage from '@/components/ErrorMessage';

// Fallback data in case API fails
const fallbackHadithInfo = {
  id: 'bukhari',
  title: 'Sahih al-Bukhari',
  author: 'Imam Bukhari',
  brief: 'Sahih al-Bukhari is a collection of hadith compiled by Abu Abdullah Muhammad Ibn Isma\'il al-Bukhari...',
  chapters: [
    { id: '1', title: 'Revelation', range: '1-7' },
    { id: '2', title: 'Belief', range: '8-58' },
    { id: '3', title: 'Knowledge', range: '59-134' },
    { id: '4', title: 'Ablutions (Wudu\')', range: '135-248' },
    { id: '5', title: 'Bathing (Ghusl)', range: '249-293' },
    { id: '6', title: 'Menstrual Periods', range: '294-330' },
    { id: '7', title: 'Rubbing hands and feet with dust (Tayammum)', range: '331-348' },
    { id: '8', title: 'Prayer (Salat)', range: '349-512' },
    { id: '9', title: 'Times of the Prayers', range: '513-590' },
    { id: '10', title: 'Call to Prayers (Adhaan)', range: '591-856' },
    { id: '11', title: 'Friday Prayer', range: '857-941' },
    { id: '12', title: 'Fear Prayer', range: '942-957' },
    { id: '14', title: 'The Two Festivals (Eids)', range: '958-964' },
    // Add more chapters as needed
  ],
};

// Define interfaces for API data - match the actual API response structure
interface Book {
  bookNumber: string;
  book: {
    lang: string;
    name: string;
  }[];
}

interface CollectionInfo {
  name: string;
  hasBooks: boolean;
  hasChapters: boolean;
  collection: {
    lang: string;
    title: string;
    shortIntro: string;
  }[];
  totalHadith: number;
  totalAvailableHadith: number;
}

const HadithInfoScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [search, setSearch] = useState('');

  // Fetch collection details and books
  const { 
    data: collectionData, 
    isLoading: collectionLoading, 
    error: collectionError 
  } = useCollection(id);
  
  const { 
    data: booksData, 
    isLoading: booksLoading, 
    error: booksError 
  } = useBooks(id);

  // Log API responses for debugging
  useEffect(() => {
    if (collectionData) {
      console.log('Collection API Response:', collectionData);
    }
    if (collectionError) {
      console.error('Collection API Error:', collectionError);
    }
    if (booksData) {
      console.log('Books API Response:', booksData);
    }
    if (booksError) {
      console.error('Books API Error:', booksError);
    }
  }, [collectionData, collectionError, booksData, booksError]);

  // Prepare data for UI
  const collection: CollectionInfo = collectionData || {
    name: fallbackHadithInfo.id,
    hasBooks: true,
    hasChapters: true,
    collection: [{ 
      title: fallbackHadithInfo.title, 
      shortIntro: fallbackHadithInfo.brief, 
      lang: 'en' 
    }],
    totalHadith: 0,
    totalAvailableHadith: 0
  };

  const books: Book[] = booksData?.data || [];
  
  // Map books to chapters format for UI
  const chapters = books.map(book => {
    // Get the book name from the first non-empty name in the book array
    const bookName = book.book.find(b => b.name && b.name.trim() !== '')?.name || `Book ${book.bookNumber}`;
    
    // Since the API doesn't provide hadith range directly, we'll use book numbers as placeholders
    // In a real implementation, you might want to fetch this data separately
    return {
      id: book.bookNumber,
      title: bookName,
      range: `${book.bookNumber}` // Using book number as a placeholder for range
    };
  });

  // Filter chapters by search
  const filteredChapters = chapters.filter(ch =>
    ch.title.toLowerCase().includes(search.toLowerCase())
  );

  // Get collection title and author
  const collectionTitle = collection.collection.find(c => c.lang === 'en')?.title || collection.name;
  const collectionIntro = collection.collection.find(c => c.lang === 'en')?.shortIntro || '';
  const authorMatch = collectionIntro.match(/([^,]+)/);
  const author = authorMatch ? authorMatch[0] : 'Unknown Author';

  // Show loading state
  if (collectionLoading || booksLoading) {
    return <LoadingIndicator color={colors.primary.primary500} />;
  }

  // Show error state
  if (collectionError || booksError) {
    return (
      <ErrorMessage 
        message={(collectionError || booksError)?.toString() || 'Failed to load hadith information'} 
        onRetry={() => navigation.replace('hadithInfo', { id })}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      {/* Search Bar */}
      <View style={styles.searchBarContainer}>
        <SearchInput 
          value={search} 
          onChangeText={setSearch}
          placeholder="Salaam, hadith khojein"
        />
      </View>

      {/* Hadith Info Card */}
      <HadithInfoCard
        title={collectionTitle}
        author={author}
        brief={collectionIntro || fallbackHadithInfo.brief}
        onPress={() => {
          navigation.navigate('hadithDetail', { id: collection.name, hadithTitle: collectionTitle });
        }}
      />

      {/* Chapters List */}
      <FlatList
        data={filteredChapters}
        keyExtractor={item => item.id}
        renderItem={({ item, index, separators }) => (
          <TouchableOpacity
            style={[
              styles.chapterRow, 
              index === filteredChapters.length - 1 && styles.lastChapterRow
            ]}
            onPress={() => {
              navigation.navigate('hadithChapters', { 
                hadithId: collection.name, 
                chapterId: item.id, 
                chapterTitle: item.title 
              });
            }}
          >
            <View style={styles.indexContainer}>
              <Text style={styles.chapterIndex}>{index + 1}</Text>
            </View>
            <View style={styles.chapterInfo}>
              <Body1Title2Medium style={styles.chapterTitle}>{item.title}</Body1Title2Medium>
              <Body2Medium color="sub-heading" style={styles.chapterRange}>{item.range}</Body2Medium>
            </View>
          </TouchableOpacity>
        )}
        style={styles.chapterList}
        contentContainerStyle={styles.listContentContainer}
        ListFooterComponent={
          <>
            <HadithImageFooter />
            <SavedFooter />
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Body1Title2Medium>No chapters found</Body1Title2Medium>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  searchBarContainer: { 
    marginVertical: verticalScale(10),
    alignItems: 'center',
  },
  chapterList: { 
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 0,
  },
  chapterRow: {
    flexDirection: 'row',
    width: scale(300),
    alignItems: 'center',
    height: verticalScale(56),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  lastChapterRow: {
    borderBottomWidth: 0,
  },
  indexContainer: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(24),
    backgroundColor: '#F9F6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(8),
  },
  chapterIndex: {
    fontSize: scale(11.2),
    color: '#8A57DC',
    textAlign: 'center',
  },
  chapterInfo: { 
    flexDirection: 'row', 
    alignItems: 'center',
  },
  chapterTitle: { 
    fontSize: scale(14),
    width: scale(256),
    color: '#171717',
  },
  chapterRange: { 
    fontSize: scale(12),
    textAlign: 'right',
    width: scale(56),
  },
  emptyContainer: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HadithInfoScreen;