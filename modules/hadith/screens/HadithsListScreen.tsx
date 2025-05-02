// modules/hadith/screens/HadithsListScreen.tsx

import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { useNavigation } from '@react-navigation/native';
import { Title3Bold, Body1Title2Medium } from '@/components/Typography/Typography';
import FastImage from 'react-native-fast-image';

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

const HadithCard = ({ hadith, onPress }: { hadith: any, onPress: () => void }) => {
  const { colors } = useThemeStore();
  return (
    <TouchableOpacity style={[styles.card, { borderColor: colors.primary.primary100 }]} onPress={onPress}>
      <FastImage source={{ uri: hadith.image }} style={styles.image} />
      <Title3Bold style={styles.title}>{hadith.title}</Title3Bold>
      <Body1Title2Medium color="sub-heading" style={styles.author}>{hadith.author}</Body1Title2Medium>
      <Body1Title2Medium style={styles.brief} numberOfLines={2}>{hadith.brief}</Body1Title2Medium>
    </TouchableOpacity>
  );
};

const HadithsListScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors } = useThemeStore();

  // Split for grid and list
  const gridHadiths = hadiths.slice(0, 10);
  const listHadiths = hadiths.slice(10);

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
      keyExtractor={item => item.id}
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
    padding: scale(16),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
  },
  card: {
    flex: 1,
    marginHorizontal: scale(4),
    borderRadius: scale(12),
    borderWidth: 1,
    backgroundColor: 'white',
    padding: scale(12),
    alignItems: 'center',
    minHeight: verticalScale(180),
  },
  image: {
    width: scale(80),
    height: scale(110),
    borderRadius: scale(8),
    marginBottom: scale(8),
  },
  title: {
    fontSize: scale(15),
    marginBottom: scale(2),
    textAlign: 'center',
  },
  author: {
    fontSize: scale(12),
    marginBottom: scale(2),
    textAlign: 'center',
  },
  brief: {
    fontSize: scale(11),
    color: '#888',
    textAlign: 'center',
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