// modules/hadith/screens/HadithInfoScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { Title3Bold, Body1Title2Medium, Body2Medium } from '@/components/Typography/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import SearchInput from '../components/SearchInput';
import HadithInfoCard from '../components/HadithInfoCard';
import HadithImageFooter from '../components/HadithImageFooter';

// Dummy data for demo
const hadithInfo = {
  id: 'bukhari',
  title: 'Sahih al-Bukhari',
  author: 'Imam Bukhari',
//   image: 'https://your-image-url.com/bukhari.jpg',
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

const HadithInfoScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  // Filter chapters by search
  const filteredChapters = hadithInfo.chapters.filter(ch =>
    ch.title.toLowerCase().includes(search.toLowerCase())
  );

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
        title={hadithInfo.title}
        author={hadithInfo.author}
        brief={hadithInfo.brief}
        onPress={() => navigation.navigate('hadithDetail', { id: hadithInfo.id })}
      />

      {/* Chapters List */}
      <FlatList
        data={filteredChapters}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.chapterRow}
            onPress={() => navigation.navigate('hadithChapters', { chapterId: item.id })}
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
        ListFooterComponent={<HadithImageFooter />}
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
    marginBottom: verticalScale(8),
    alignItems: 'center',
  },
  chapterList: { 
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: verticalScale(16),
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
});

export default HadithInfoScreen;