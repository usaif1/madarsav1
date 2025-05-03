// modules/hadith/screens/HadithInfoScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { Title3Bold, Body1Title2Medium } from '@/components/Typography/Typography';
import { useNavigation, useRoute } from '@react-navigation/native';
import SearchInput from '../components/SearchInput';
import HadithInfoCard from '../components/HadithInfoCard';

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
    // ... more chapters
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
            <Text style={[styles.chapterIndex, { color: colors.primary.primary600 }]}>{index + 1}</Text>
            <View style={styles.chapterInfo}>
              <Text style={styles.chapterTitle}>{item.title}</Text>
              <Text style={styles.chapterRange}>{item.range}</Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.chapterList}
        contentContainerStyle={{ paddingBottom: verticalScale(32) }}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made for <Text style={styles.ummah}>Ummah</Text></Text>
        <Text style={styles.footerSubText}>Crafted with ❤️ by Madrasa Team, India</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: scale(12) },
  searchBarContainer: { 
    marginBottom: verticalScale(8),
    alignItems: 'center',
  },
  chapterList: { flex: 1 },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  chapterIndex: {
    fontWeight: 'bold',
    fontSize: scale(15),
    width: scale(24),
    textAlign: 'center',
  },
  chapterInfo: { flex: 1, flexDirection: 'row', justifyContent: 'space-between' },
  chapterTitle: { fontSize: scale(14) },
  chapterRange: { fontSize: scale(13), color: '#888' },
  footer: {
    alignItems: 'center',
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  footerText: { fontSize: scale(15), fontWeight: '600' },
  ummah: { color: '#7C5CFC', fontWeight: 'bold' },
  footerSubText: { fontSize: scale(12), color: '#888' },
});

export default HadithInfoScreen;