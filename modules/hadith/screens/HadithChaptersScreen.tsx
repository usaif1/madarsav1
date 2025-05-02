// modules/hadith/screens/HadithChaptersScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { Title3Bold, Body1Title2Medium } from '@/components/Typography/Typography';

// Dummy data for demo
const chaptersData = [
  {
    id: '1',
    title: 'How the Divine Revelation started being revealed to Allah\'s Messenger',
    hadiths: [
      {
        id: '1',
        arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ ...',
        translation: 'The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended...',
        narrator: 'Narrated \'Umar bin Al-Khattab',
        reference: 'Sahih al-Bukhari 1:1',
      },
    ],
  },
  {
    id: '2',
    title: '',
    hadiths: [
      {
        id: '2',
        arabic: 'سَأَلَ الْحَارِثُ بْنُ هِشَامٍ ...',
        translation: 'The mother of the faithful believers ...',
        narrator: 'Narrated \'Aisha',
        reference: 'Sahih al-Bukhari 1:2',
      },
    ],
  },
  // ...more chapters
];

const ChapterSection = ({ chapter, index }: { chapter: any, index: number }) => {
  const { colors } = useThemeStore();
  return (
    <View style={styles.chapterSection}>
      {/* Chapter Header */}
      <View style={styles.chapterHeader}>
        <Text style={styles.chapterHeaderText}>
          ({index + 1}) Chapter: {chapter.title}
        </Text>
      </View>
      {/* Hadiths in this chapter */}
      {chapter.hadiths.map((hadith: any) => (
        <View style={styles.hadithCard} key={hadith.id}>
          <Text style={styles.hadithArabic}>{hadith.arabic}</Text>
          <Text style={styles.hadithNarrator}><Text style={{ fontWeight: 'bold' }}>{hadith.narrator}:</Text></Text>
          <Text style={styles.hadithTranslation}>{hadith.translation}</Text>
          <Text style={styles.hadithReference}>{hadith.reference}</Text>
          {/* You can add share/bookmark buttons here if needed */}
        </View>
      ))}
    </View>
  );
};

const HadithChaptersScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const [visibleChapters, setVisibleChapters] = useState(2); // Start with 2, load more as you scroll

  // Infinite scroll handler
  const handleEndReached = () => {
    if (visibleChapters < chaptersData.length) {
      setVisibleChapters(prev => Math.min(prev + 2, chaptersData.length));
    }
  };

  return (
    <FlatList
      data={chaptersData.slice(0, visibleChapters)}
      keyExtractor={item => item.id}
      renderItem={({ item, index }) => <ChapterSection chapter={item} index={index} />}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: scale(12),
    paddingBottom: verticalScale(32),
    backgroundColor: '#FFF',
  },
  chapterSection: {
    marginBottom: verticalScale(24),
  },
  chapterHeader: {
    backgroundColor: '#FFF7E0',
    borderRadius: scale(8),
    padding: scale(10),
    marginBottom: verticalScale(8),
    borderWidth: 1,
    borderColor: '#F5E6B8',
  },
  chapterHeaderText: {
    color: '#B89C2B',
    fontWeight: 'bold',
    fontSize: scale(14),
  },
  hadithCard: {
    backgroundColor: '#FFF',
    borderRadius: scale(8),
    padding: scale(12),
    marginBottom: verticalScale(10),
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  hadithArabic: {
    fontSize: scale(18),
    textAlign: 'right',
    marginBottom: scale(8),
    fontWeight: '500',
    color: '#222',
    lineHeight: scale(28),
  },
  hadithNarrator: {
    fontSize: scale(13),
    color: '#444',
    marginBottom: scale(2),
  },
  hadithTranslation: {
    fontSize: scale(14),
    color: '#444',
    marginBottom: scale(4),
  },
  hadithReference: {
    fontSize: scale(12),
    color: '#888',
    textAlign: 'left',
  },
});

export default HadithChaptersScreen;