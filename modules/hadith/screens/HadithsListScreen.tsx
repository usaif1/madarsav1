// modules/hadith/screens/HadithsListScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { useNavigation } from '@react-navigation/native';
import HadithCard from '../components/HadithCard';
import HadithListItem from '../components/HadithListItem';
import { Body1Title2Bold } from '@/components/Typography/Typography';
import HadithImageFooter from '../components/HadithImageFooter';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { useCollections } from '../hooks/useHadith';
import { Collection } from '../services/hadithService';

// Define the Hadith type for better type safety
export interface Hadith {
  id: string | number; // Allow both string and number IDs
  title: string;
  author: string;
  image: string;
  brief: string;
}

// Fallback hadith collections data in case API fails
const fallbackHadiths: Hadith[] = [
  {
    id: 1,
    title: 'Sahih al-Bukhari',
    author: 'Imam Bukharii',
    image: 'https://example.com/bukhari.jpg',
    brief: 'Narrated in: 202-275 AH, Contains roughly 7500 Hadith (with repetitions) in 57 books.'
  },
  {
    id: 2,
    title: 'Sahih Muslim',
    author: 'Imam Muslim',
    image: 'https://example.com/muslim.jpg',
    brief: 'Narrated in: 93-179 AH, Contains roughly 1,720 narrations (including repetitions).'
  },
  {
    id: 3,
    title: 'Sunan Abi Dawud',
    author: 'Imam Abu Dawud',
    image: 'https://example.com/abudawud.jpg',
    brief: 'Collection of 5,274 hadith, covering various aspects of life including law, rituals, and ethics.'
  },
  {
    id: 4,
    title: 'Jami at-Tirmidhi',
    author: 'Imam Tirmidhi',
    image: 'https://example.com/tirmidhi.jpg',
    brief: 'Contains 3,956 hadith and emphasizes legal opinions, categorizing hadith as authentic, good, or weak.'
  },
  {
    id: 5,
    title: 'Sunan an-Nasa\'i',
    author: 'Imam Nasa\'i',
    image: 'https://example.com/nasai.jpg',
    brief: 'Known for its high standards of authenticity, contains approximately 5,700 hadith.'
  },
  {
    id: 6,
    title: 'Sunan Ibn Majah',
    author: 'Ibn Majah',
    image: 'https://example.com/ibnmajah.jpg',
    brief: 'Contains 4,341 hadith, including many unique narrations not found in other collections.'
  },
  {
    id: 7,
    title: 'Muwatta Malik',
    author: 'Imam Malik ibn Anas',
    image: 'https://example.com/muwatta.jpg',
    brief: 'Narrated in: 93-179 AH, Contains roughly 1,720 narrations (including repetitions).'
  },
  {
    id: 8,
    title: 'Musnad Ahmad',
    author: 'Imam Ahmad',
    image: 'https://example.com/ahmad.jpg',
    brief: 'Largest collection with over 30,000 hadith, arranged according to narrators rather than topics.'
  },
  {
    id: 9,
    title: 'Sunan ad-Darimi',
    author: 'Imam Darimi',
    image: 'https://example.com/darimi.jpg',
    brief: 'Contains approximately 3,500 hadith, arranged by subject and legal topics.'
  },
  {
    id: 10,
    title: 'Al-Nawawi\'s 40 Hadith',
    author: 'Imam Nawawi',
    image: 'https://example.com/nawawi.jpg',
    brief: 'Collection of 42 foundational hadith covering the core principles of Islam and faith.'
  },
  {
    id: 11,
    title: 'Riyadh as-Saliheen',
    author: 'Imam Nawawi',
    image: 'https://example.com/riyadh.jpg',
    brief: 'Collection of approximately 1,900 hadith organized into 372 chapters on various aspects of Islamic ethics.'
  },
  {
    id: 12,
    title: 'Bulugh al-Maram',
    author: 'Ibn Hajar',
    image: 'https://example.com/bulugh.jpg',
    brief: 'Collection of 1,358 hadith focusing on Islamic jurisprudence and legal rulings.'
  },
  {
    id: 13,
    title: 'Al-Adab Al-Mufrad',
    author: 'Imam Bukhari',
    image: 'https://example.com/adab.jpg',
    brief: 'Collection of 1,322 hadith focusing on Islamic ethics, manners, and character development.'
  },
  {
    id: 14,
    title: 'Mishkat al-Masabih',
    author: 'Al-Tabrizi',
    image: 'https://example.com/mishkat.jpg',
    brief: 'Expanded version of Masabih al-Sunnah, containing approximately 6,000 hadith from various sources.'
  },
  {
    id: 15,
    title: 'Shuab al-Iman',
    author: 'Al-Bayhaqi',
    image: 'https://example.com/shuab.jpg',
    brief: 'Comprehensive work detailing the 77 branches of faith through hadith and scholarly commentary.'
  }
];

// Map API collection to our Hadith interface
const mapCollectionToHadith = (collection: Collection): Hadith => {
  // Find English collection data, fall back to first item or empty
  const collectionData = collection.collection.find(c => c.lang === 'en') ||
                         collection.collection[0] ||
                         { lang: 'en', title: collection.name, shortIntro: '' };
  
  // Extract author from shortIntro using "compiled by" pattern
  let author = 'Unknown Author';
  const shortIntro = collectionData.shortIntro || '';
  
  // Try to extract author using "compiled by" pattern
  const compiledByMatch = shortIntro.match(/compiled by ([^(]+)/i);
  if (compiledByMatch && compiledByMatch[1]) {
    author = compiledByMatch[1].trim();
  } else {
    // Fallback: Try to get first word and last word before opening bracket
    const firstSentenceMatch = shortIntro.split('.')[0] || '';
    const words = firstSentenceMatch.split(/\s+/).filter(word => word.length > 0);
    
    if (words.length > 0) {
      // Find the index of the first word with an opening bracket
      const bracketIndex = words.findIndex(word => word.includes('('));
      
      if (bracketIndex > 0) {
        // Use the first word and the word before the bracket
        author = `${words[0]} ${words[bracketIndex - 1]}`;
      } else if (words.length > 0) {
        // Just use the first word if no bracket found
        author = words[0];
      }
    }
  }
  
  // Extract brief from shortIntro
  let brief = `Contains ${collection.totalAvailableHadith} hadith${collection.hasBooks ? ' in multiple books' : ''}.`;
  
  // Try to extract brief using various patterns
  const briefPatterns = [
    /It contains over \d+ hadith[^.]+\./i,  // "It contains over X hadith..."
    /Contains roughly \d+[^.]+\./i,         // "Contains roughly X..."
    /Contains \d+[^.]+\./i                  // "Contains X..."
  ];

  // Try each pattern in order
  for (const pattern of briefPatterns) {
    const match = shortIntro.match(pattern);
    if (match) {
      brief = match[0];
      break;  // Stop after first match
    }
  }
  
  // Create hadith object with proper data mapping
  return {
    id: collection.name,
    title: collectionData.title || collection.name,
    author: author,
    // Use a mapping for known collection images or generate a placeholder
    image: getHadithImage(collection.name),
    brief: brief
  };
};

// Helper function to get appropriate image for each collection
const getHadithImage = (collectionName: string): string => {
  // Map of collection names to image URLs
  const imageMap: Record<string, string> = {
    'bukhari': 'https://example.com/bukhari.jpg',
    'muslim': 'https://example.com/muslim.jpg',
    'abudawud': 'https://example.com/abudawud.jpg',
    'tirmidhi': 'https://example.com/tirmidhi.jpg',
    'nasai': 'https://example.com/nasai.jpg',
    'ibnmajah': 'https://example.com/ibnmajah.jpg',
    'malik': 'https://example.com/muwatta.jpg',
    'ahmad': 'https://example.com/ahmad.jpg',
    // Add more mappings as needed
  };
  
  // Return the mapped image or a generic placeholder
  return imageMap[collectionName.toLowerCase()] || 
         `https://example.com/generic-hadith.jpg`;
};

const HadithsListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();
  const [hadiths, setHadiths] = useState<Hadith[]>([]);
  
  // Fetch collections from API
  const { data: collectionsData, isLoading, error } = useCollections();
  
  useEffect(() => {
    if (collectionsData?.data) {
      const mappedHadiths = collectionsData.data.map(mapCollectionToHadith);
      setHadiths(mappedHadiths);
    }
  }, [collectionsData]);
  
  // If API fails, use fallback data
  useEffect(() => {
    if (error) {
      console.error('Error fetching collections:', error);
      setHadiths(fallbackHadiths);
    }
  }, [error]);

  // Split for grid and list
  const gridHadiths = hadiths.slice(0, 6);
  const listHadiths = hadiths.slice(6);

  // Render grid (2 per row)
  const renderGrid = () => {
    const rows = [];
    for (let i = 0; i < gridHadiths.length; i += 2) {
      rows.push(
        <View style={styles.row} key={i}>
          <HadithCard
            hadith={gridHadiths[i]}
            onPress={() => navigation.navigate('hadithInfo', { id: gridHadiths[i].id, hadithTitle: gridHadiths[i].title })}
          />
          {gridHadiths[i + 1] && (
            <HadithCard
              hadith={gridHadiths[i + 1]}
              onPress={() => navigation.navigate('hadithInfo', { id: gridHadiths[i + 1].id, hadithTitle: gridHadiths[i + 1].title })}
            />
          )}
        </View>
      );
    }
    return rows;
  };

  // Render list (below grid)
  const renderList = () => (
    <FlatList
      data={listHadiths}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <HadithListItem
          hadith={item}
          onPress={() => navigation.navigate('hadithInfo', { id: item.id, hadithTitle: item.title })}
        />
      )}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
      ListFooterComponent={<HadithImageFooter />}
      ListFooterComponentStyle={styles.footerComponentStyle}
    />
  );

  // Loading state
  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent, { backgroundColor: 'white' }]}>
        <ActivityIndicator size="large" color="#8A57DC" />
        <Text style={styles.loadingText}>Loading Hadith Collections...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <FlatList
        ListHeaderComponent={
          <>
            {renderGrid()}
            {listHadiths.length > 0 && (
              <View style={styles.moreHadithContainer}>
                <View style={styles.leftIllustration}>
                  <CdnSvg path={DUA_ASSETS.HADITH_MORE_LEFT} width={24} height={24} />
                </View>
                <Body1Title2Bold style={styles.moreText}>More Hadith</Body1Title2Bold>
                <View style={styles.rightIllustration}>
                  <CdnSvg path={DUA_ASSETS.HADITH_MORE_RIGHT} width={24} height={24} />
                </View>
              </View>
            )}
          </>
        }
        data={[]} // No data, just using header for grid and list
        renderItem={null}
        ListFooterComponent={renderList()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: scale(16),
    color: '#8A57DC',
    fontWeight: '500',
  },
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  listContainer: {
    paddingTop: verticalScale(8),
    paddingBottom: 0,
  },
  moreHadithContainer: {
    height: verticalScale(30),
    backgroundColor: '#F9F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(4),
    flexDirection: 'row',
    position: 'relative',
    overflow: 'hidden',
  },
  leftIllustration: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    opacity: 0.1,
  },
  rightIllustration: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    opacity: 0.1,
  },
  moreText: {
    fontSize: scale(14),
    color: '#7C5CFC', // primary500
  },
  footerComponentStyle: {
    marginTop: 0,
  },
  footerContainer: {
    width: scale(375),
    height: verticalScale(221),
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerImage: {
    width: '100%',
    height: '100%',
  },
});

export default HadithsListScreen;