// modules/hadith/screens/HadithInfoScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, useWindowDimensions } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Medium, Body2Medium } from '@/components/Typography/Typography';
import RenderHtml from 'react-native-render-html';
import { useNavigation, useRoute } from '@react-navigation/native';
import SearchInput from '../components/SearchInput';
import HadithInfoCard from '../components/HadithInfoCard';
import HadithImageFooter from '../components/HadithImageFooter';
import { useCollection, useBooks } from '../hooks/useHadith';
import { getHadithBookImagePath, DUA_ASSETS } from '@/utils/cdnUtils';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorMessage from '@/components/ErrorMessage';
import { CdnSvg } from '@/components/CdnSvg';

/**
 * Interface for API book data structure
 */
interface Book {
  bookNumber: string;
  book: {
    lang: string;
    name: string;
  }[];
  hadithStartNumber: number;
  hadithEndNumber: number;
  numberOfHadith: number;
}

/**
 * Interface for API collection data structure
 */
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

/**
 * Interface for UI chapter display
 */
interface Chapter {
  id: string;
  title: string;
  range: string;
}

/**
 * Route parameters interface
 */
interface RouteParams {
  id: string;
}

const HadithInfoScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { id } = route.params as RouteParams;
  const [search, setSearch] = useState('');
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const { width } = useWindowDimensions();

  // Fetch collection details and books from API
  const {
    data: collectionData,
    isLoading: collectionLoading,
    error: collectionError
  } = useCollection(id);
  
  const {
    data: booksData,
    isLoading: booksLoading,
    error: booksError
  } = useBooks(id, 1000, 1); // Use limit 1000 to get all books at once

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

  // Update allBooks when new data is fetched
  useEffect(() => {
    if (booksData?.data) {
      setAllBooks(booksData.data);
    }
  }, [booksData]);

  /**
   * Extract author from shortIntro using various patterns
   * @param shortIntro - The short introduction text
   * @returns Extracted author name or 'Unknown Author'
   */
  const extractAuthor = (shortIntro: string): string => {
    if (!shortIntro) return 'Unknown Author';
    
    // Try to extract author using "compiled by" pattern
    const compiledByMatch = shortIntro.match(/compiled by ([^(]+)/i);
    if (compiledByMatch && compiledByMatch[1]) {
      return compiledByMatch[1].trim();
    }
    
    // Fallback: Try to get first sentence words
    const firstSentenceMatch = shortIntro.split('.')[0] || '';
    const words = firstSentenceMatch.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length > 0) {
      // Find the index of the first word with an opening bracket
      const bracketIndex = words.findIndex(word => word.includes('('));
      
      if (bracketIndex > 0) {
        // Use the first word and the word before the bracket
        return `${words[0]} ${words[bracketIndex - 1]}`;
      } else if (words.length > 1 && words[0] === 'Imam') {
        // If first word is just "Imam", include the second word too
        return `${words[0]} ${words[1]}`;
      } else if (words.length > 0) {
        // Just use the first word if no bracket found
        return words[0];
      }
    }
    
    return 'Unknown Author';
  };

  /**
   * Extract translator from text using various patterns
   * @param text - The text to search in
   * @returns Extracted translator name or 'Unknown Translator'
   */
  const extractTranslator = (text: string): string => {
    if (!text) return 'Unknown Translator';
    
    // Check for "translation provided here by" or similar patterns
    const translationByMatch = text.match(/translation provided here by ([^.]+)/i) ||
                               text.match(/translated by ([^.]+)/i) ||
                               text.match(/translation by ([^.]+)/i);
    
    if (translationByMatch && translationByMatch[1]) {
      return translationByMatch[1].trim();
    }
    
    // If no match found, try to get from the last sentence
    const sentences = text.split('.');
    const lastSentence = sentences[sentences.length - 2] || ''; // Use second-to-last to avoid empty string
    
    if (lastSentence.toLowerCase().includes('translation') || lastSentence.toLowerCase().includes('translator')) {
      // Extract name after "by" if present
      const byMatch = lastSentence.match(/by ([^.]+)$/i);
      if (byMatch && byMatch[1]) {
        return byMatch[1].trim();
      }
      return lastSentence.trim();
    }
    
    return 'Unknown Translator';
  };

  /**
   * Extract years from text using pattern matching
   * @param text - The text to search in
   * @returns Extracted years or empty string
   */
  const extractYears = (text: string): string => {
    if (!text) return '';
    
    // Look for patterns like "202-275 AH" or similar year ranges
    const yearsMatch = text.match(/(\d+[-–—]\d+\s*[A-Z]+)/i);
    if (yearsMatch && yearsMatch[1]) {
      return yearsMatch[1];
    }
    
    return '';
  };

  /**
   * Extract highlight text from shortIntro
   * @param text - The text to search in
   * @param totalAvailableHadith - Fallback number for highlight
   * @returns Extracted highlight text
   */
  const extractHighlight = (text: string, totalAvailableHadith: number): string => {
    if (!text) {
      return totalAvailableHadith > 0 ? `Contains ${totalAvailableHadith} hadith` : '';
    }
    
    // Look for patterns like "contains roughly 7500 hadith" or similar
    const highlightMatch = text.match(/contains roughly \d{1,3}(?:,\d{3})*[^.]+\./i) ||
                           text.match(/contains \d{1,3}(?:,\d{3})*[^.]+\./i) ||
                           text.match(/\d{1,3}(?:,\d{3})*\s+hadith[^.]+\./i);
    
    if (highlightMatch && highlightMatch[0]) {
      return highlightMatch[0];
    }
    
    return totalAvailableHadith > 0 ? `Contains ${totalAvailableHadith} hadith` : '';
  };

  /**
   * Handle saved button press
   */
  const handleSavedPress = () => {
    navigation.navigate('savedHadiths');
  };

  // Show loading state
  if (collectionLoading || booksLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingIndicator color={colors.primary.primary500} />
        <Text style={styles.loadingText}>Loading hadith information...</Text>
      </View>
    );
  }

  // Show error state
  if (collectionError || booksError) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ErrorMessage 
          message={(collectionError || booksError)?.toString() || 'Failed to load hadith information'} 
          onRetry={() => navigation.replace('hadithInfo', { id })}
        />
      </View>
    );
  }

  // Show error if no collection data is available
  if (!collectionData) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ErrorMessage 
          message="Hadith collection not found. Please try again."
          onRetry={() => navigation.replace('hadithInfo', { id })}
        />
      </View>
    );
  }

  const collection: CollectionInfo = collectionData;
  
  // Map books to chapters format for UI
  const chapters: Chapter[] = allBooks.map(book => {
    // Get the book name from the first non-empty name in the book array
    const bookName = book.book.find(b => b.name && b.name.trim() !== '')?.name || `Book ${book.bookNumber}`;
    
    // Use hadithStartNumber and hadithEndNumber for the range
    return {
      id: book.bookNumber,
      title: bookName,
      range: `${book.hadithStartNumber}-${book.hadithEndNumber}`
    };
  });

  // Filter chapters by search
  const filteredChapters = chapters.filter(ch =>
    ch.title.toLowerCase().includes(search.toLowerCase())
  );

  // Get collection title and intro
  const englishCollection = collection.collection.find(c => c.lang === 'en');
  const collectionTitle = englishCollection?.title || collection.name;
  const collectionIntro = englishCollection?.shortIntro || '';
  
  // Extract information from shortIntro
  const author = extractAuthor(collectionIntro);
  const firstSentence = collectionIntro.split('.')[0] + (collectionIntro.includes('.') ? '.' : '');

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
        brief={firstSentence || ''}
        onPress={() => {
          // Create a hadith detail object with real API data
          const hadithDetail = {
            id: collection.name,
            title: collectionTitle,
            author: author,
            brief: collectionIntro || '',
            translator: extractTranslator(collectionIntro),
            authorBio: collectionIntro || '',
            years: extractYears(collectionIntro),
            highlight: extractHighlight(collectionIntro, collection.totalAvailableHadith),
            image: getHadithBookImagePath(collectionTitle),
          };
          
          navigation.navigate('hadithDetail', {
            id: collection.name,
            hadithTitle: collectionTitle,
            hadithDetail: hadithDetail
          });
        }}
      />

      {/* Chapters List */}
      <FlatList
        data={filteredChapters}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
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
            activeOpacity={0.7}
            accessibilityLabel={`Chapter ${index + 1}: ${item.title}`}
            accessibilityRole="button"
          >
            <View style={styles.indexContainer}>
              <Text style={styles.chapterIndex}>{index + 1}</Text>
            </View>
            <View style={styles.chapterTitleContainer}>
              <RenderHtml
                contentWidth={width - scale(100)} // Adjust for padding and other elements
                source={{ html: `<p>${item.title}</p>` }}
                tagsStyles={{
                  p: {
                    fontSize: scale(14),
                    color: '#171717',
                    margin: 0,
                    padding: 0,
                  }
                }}
              />
            </View>
            <View style={styles.chapterRangeContainer}>
              <Body2Medium color="sub-heading" style={styles.chapterRange}>
                {item.range}
              </Body2Medium>
            </View>
          </TouchableOpacity>
        )}
        style={styles.chapterList}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Body1Title2Medium>
              {search ? 'No chapters found for your search' : 'No chapters available'}
            </Body1Title2Medium>
            {search && (
              <Text style={styles.emptySubtext}>
                Try adjusting your search terms
              </Text>
            )}
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
      
      {/* Floating Saved Button */}
      <TouchableOpacity 
        style={styles.savedButton} 
        onPress={handleSavedPress}
        activeOpacity={0.8}
        accessibilityLabel="View saved hadiths"
        accessibilityRole="button"
      >
        <CdnSvg 
          path={DUA_ASSETS.BOOKMARK_WHITE}
          width={scale(16)}
          height={scale(16)}
        />
        <Body1Title2Medium color="white" style={styles.savedButtonText}>
          Saved
        </Body1Title2Medium>
      </TouchableOpacity>

      <HadithImageFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: scale(16),
    color: '#8A57DC',
    fontWeight: '500',
    textAlign: 'center',
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
    fontWeight: '900',
  },
  chapterTitleContainer: {
    flex: 1,
  },
  chapterRangeContainer: {
    marginLeft: scale(8),
  },
  chapterRange: {
    fontSize: scale(12),
    textAlign: 'right',
  },
  emptyContainer: {
    padding: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptySubtext: {
    marginTop: scale(8),
    fontSize: scale(14),
    color: '#737373',
    textAlign: 'center',
  },
  savedButton: {
    position: 'absolute',
    bottom: 40,
    right: 16,
    width: scale(89),
    height: verticalScale(40),
    borderRadius: 60,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  savedButtonText: {
    marginLeft: scale(8),
  },
});

export default HadithInfoScreen;