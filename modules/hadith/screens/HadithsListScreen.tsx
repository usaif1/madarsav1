// modules/hadith/screens/HadithsListScreen.tsx

import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { useNavigation } from '@react-navigation/native';
import HadithCard from '../components/HadithCard';
import HadithListItem from '../components/HadithListItem';
import { Body1Title2Bold } from '@/components/Typography/Typography';
import HadithImageFooter from '../components/HadithImageFooter';
import MoreHadithsLeftIllustration from '@/assets/hadith/MoreHadithsLeftIllustration.svg';
import MoreHadithsRightIllustration from '@/assets/hadith/MoreHadithsRightIllustration.svg';

// Define the Hadith type for better type safety
export interface Hadith {
  id: number;
  title: string;
  author: string;
  image: string;
  brief: string;
}

// Hadith collections data
const hadiths: Hadith[] = [
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

const HadithsListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useThemeStore();

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
            onPress={() => navigation.navigate('hadithInfo', { id: gridHadiths[i].id })}
          />
          {gridHadiths[i + 1] && (
            <HadithCard
              hadith={gridHadiths[i + 1]}
              onPress={() => navigation.navigate('hadithInfo', { id: gridHadiths[i + 1].id })}
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
          onPress={() => navigation.navigate('hadithInfo', { id: item.id })}
        />
      )}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
      ListFooterComponent={<HadithImageFooter />}
      ListFooterComponentStyle={styles.footerComponentStyle}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <FlatList
        ListHeaderComponent={
          <>
            {renderGrid()}
            {listHadiths.length > 0 && (
              <View style={styles.moreHadithContainer}>
                <View style={styles.leftIllustration}>
                  <MoreHadithsLeftIllustration />
                </View>
                <Body1Title2Bold style={styles.moreText}>More Hadith</Body1Title2Bold>
                <View style={styles.rightIllustration}>
                  <MoreHadithsRightIllustration />
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
  },
  rightIllustration: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
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