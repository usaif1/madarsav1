// modules/hadith/screens/HadithsListScreen.tsx

import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { useNavigation } from '@react-navigation/native';
import HadithCard from '../components/HadithCard';

// Dummy data for now
const hadiths = [
  {
    id: 1,
    title: 'The Importance of Intention',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith1.jpg',
    brief: 'Actions are judged by intentions, and every person will have what they intended.'
  },
  {
    id: 2,
    title: 'Kindness to Neighbors',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith2.jpg',
    brief: 'He is not a true believer who eats his fill while his neighbor is hungry.'
  },
  {
    id: 3,
    title: 'Seeking Knowledge',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith3.jpg',
    brief: 'Seeking knowledge is an obligation upon every Muslim.'
  },
  {
    id: 4,
    title: 'Mercy and Compassion',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith4.jpg',
    brief: 'Those who show mercy will be shown mercy by the Most Merciful.'
  },
  {
    id: 5,
    title: 'Patience in Hardship',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith5.jpg',
    brief: 'No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, even if it were the prick he receives from a thorn, but that Allah expiates some of his sins for that.'
  },
  {
    id: 6,
    title: 'Honesty and Trust',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith6.jpg',
    brief: 'Honesty leads to righteousness, and righteousness leads to Paradise.'
  },
  {
    id: 7,
    title: 'Respect for Parents',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith7.jpg',
    brief: 'Paradise lies at the feet of your mother.'
  },
  {
    id: 8,
    title: 'Charity and Generosity',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith8.jpg',
    brief: 'Charity does not decrease wealth.'
  },
  {
    id: 9,
    title: 'Forgiveness',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith9.jpg',
    brief: 'Whoever forgives, Allah will elevate his status.'
  },
  {
    id: 10,
    title: 'Good Character',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith10.jpg',
    brief: 'The best among you are those with the best character.'
  },
  {
    id: 11,
    title: 'Moderation in Worship',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith11.jpg',
    brief: `Do good deeds properly, sincerely and moderately, and rejoice, for no one's good deeds will put them into Paradise.`
  },
  {
    id: 12,
    title: 'Unity and Brotherhood',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith12.jpg',
    brief: 'A believer to another believer is like a building whose different parts support each other.'
  },
  {
    id: 13,
    title: 'Cleanliness',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith13.jpg',
    brief: 'Cleanliness is half of faith.'
  },
  {
    id: 14,
    title: 'Helping Others',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith14.jpg',
    brief: 'Whoever helps his brother in his time of need, Allah will help him in his time of need.'
  },
  {
    id: 15,
    title: 'Gratitude',
    author: 'Prophet Muhammad (PBUH)',
    image: 'https://example.com/hadith15.jpg',
    brief: 'He who does not thank people does not thank Allah.'
  }
];

const HadithsListScreen: React.FC = () => {
  const navigation = useNavigation();
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
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <HadithCard
          hadith={item}
          onPress={() => navigation.navigate('hadithInfo', { id: item.id })}
        />
      )}
      scrollEnabled={false}
      contentContainerStyle={styles.listContainer}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: 'white' }]}>
      <FlatList
        ListHeaderComponent={
          <>
            {renderGrid()}
            {listHadiths.length > 0 && (
              <Text style={styles.moreText}>More Hadith</Text>
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
  },
  moreText: {
    fontSize: scale(13),
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: verticalScale(8),
    color: '#7C5CFC',
  },
});

export default HadithsListScreen;