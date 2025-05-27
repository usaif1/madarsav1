import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { JuzzStackParamList } from '../../navigation/juzz.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import BackButton from '@/components/BackButton/BackButton';
import SettingsIcon from '@/assets/quran/settings.svg';
import PlayIcon from '@/assets/hadith/Play.svg';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';

// Define the type for a verse
type Verse = {
  id: number;
  surahId: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
  transliteration: string;
};

// Sample data for verses
const SAMPLE_VERSES: Verse[] = [
  {
    id: 1,
    surahId: 1,
    surahName: 'Al-Fatiha',
    ayahNumber: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the Name of Allah—the Most Compassionate, Most Merciful.',
    transliteration: 'Bismillahir Rahmanir Raheem',
  },
  {
    id: 2,
    surahId: 1,
    surahName: 'Al-Fatiha',
    ayahNumber: 2,
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: 'All praise is for Allah—Lord of all worlds,',
    transliteration: 'Alhamdu lillahi rabbil alamin',
  },
  {
    id: 3,
    surahId: 1,
    surahName: 'Al-Fatiha',
    ayahNumber: 3,
    arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'the Most Compassionate, Most Merciful,',
    transliteration: 'Ar-Rahman ar-Raheem',
  },
  {
    id: 4,
    surahId: 1,
    surahName: 'Al-Fatiha',
    ayahNumber: 4,
    arabic: 'مَالِكِ يَوْمِ الدِّينِ',
    translation: 'Master of the Day of Judgment.',
    transliteration: 'Maliki yawmid-din',
  },
  {
    id: 5,
    surahId: 1,
    surahName: 'Al-Fatiha',
    ayahNumber: 5,
    arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    translation: 'You ˹alone˺ we worship and You ˹alone˺ we ask for help.',
    transliteration: `Iyyaka na'budu wa iyyaka nasta'in`,
  },
  {
    id: 6,
    surahId: 2,
    surahName: 'Al-Baqarah',
    ayahNumber: 1,
    arabic: 'الم',
    translation: 'Alif, Lam, Meem.',
    transliteration: 'Alif Lam Meem',
  },
  {
    id: 7,
    surahId: 2,
    surahName: 'Al-Baqarah',
    ayahNumber: 2,
    arabic: 'ذَٰلِكَ الْكِتَابُ لَا رَيْبَ ۛ فِيهِ ۛ هُدًى لِّلْمُتَّقِينَ',
    translation: 'This is the Book! There is no doubt about it—a guide for those mindful ˹of Allah˺,',
    transliteration: 'Thalika alkitabu la rayba feehi hudan lilmuttaqeen',
  },
];

type JuzzDetailScreenRouteProp = RouteProp<JuzzStackParamList, 'juzzDetail'>;
type JuzzDetailScreenNavigationProp = NativeStackNavigationProp<JuzzStackParamList, 'juzzDetail'>;

const JuzzDetailScreen: React.FC = () => {
  const route = useRoute<JuzzDetailScreenRouteProp>();
  const navigation = useNavigation<JuzzDetailScreenNavigationProp>();
  const { juzzId, juzzName } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle tafseer press
  const handleTafseerPress = (verse: Verse) => {
    navigation.navigate('tafseer', {
      juzzId,
      ayahId: verse.id,
      verse: verse.arabic,
    });
  };

  // Handle change juzz press
  const handleChangeJuzzPress = () => {
    navigation.navigate('changeJuzz', {
      currentJuzzId: juzzId,
    });
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Add audio playback logic here
  };

  // Group verses by surah
  const groupedVerses: Record<string, Verse[]> = {};
  SAMPLE_VERSES.forEach(verse => {
    if (!groupedVerses[verse.surahName]) {
      groupedVerses[verse.surahName] = [];
    }
    groupedVerses[verse.surahName].push(verse);
  });

  // Render a verse item
  const renderVerse = (verse: Verse) => (
    <View key={verse.id} style={styles.verseContainer}>
      {/* Verse number and controls */}
      <View style={styles.verseHeader}>
        <TouchableOpacity style={styles.verseNumberContainer}>
          <Body2Medium style={styles.verseNumber}>{verse.ayahNumber}</Body2Medium>
        </TouchableOpacity>
        <View style={styles.verseControls}>
          <TouchableOpacity onPress={() => handleTafseerPress(verse)}>
            <Body2Medium style={styles.tafseerButton}>Tafseer</Body2Medium>
          </TouchableOpacity>
          <TouchableOpacity>
            <Body2Medium style={styles.shareButton}>Share</Body2Medium>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Arabic text */}
      <View style={styles.arabicContainer}>
        <Body2Bold style={styles.arabicText}>{verse.arabic}</Body2Bold>
      </View>
      
      {/* Translation */}
      <View style={styles.translationContainer}>
        <Body2Medium style={styles.translationText}>{verse.translation}</Body2Medium>
      </View>
      
      {/* Transliteration */}
      <View style={styles.transliterationContainer}>
        <Body2Medium style={styles.transliterationText}>{verse.transliteration}</Body2Medium>
      </View>
    </View>
  );

  // Render a surah section
  const renderSurahSection = (surahName: string, verses: Verse[]) => (
    <View key={surahName} style={styles.surahSection}>
      <View style={styles.surahHeader}>
        <Body2Bold style={styles.surahTitle}>{surahName}</Body2Bold>
        <CaptionMedium style={styles.surahInfo}>
          {verses.length} Ayahs
        </CaptionMedium>
      </View>
      {verses.map(verse => renderVerse(verse))}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <BackButton onPress={() => navigation.goBack()} />
          <H5Bold>{juzzName}</H5Bold>
        </View>
        <TouchableOpacity>
          <SettingsIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
      
      {/* Juzz info */}
      <View style={styles.juzzInfoContainer}>
        <View style={styles.juzzInfo}>
          <Body2Bold>{juzzName}</Body2Bold>
          <Body2Medium style={styles.juzzSubtitle}>Al-Fatiha - Al-Baqarah • 141 Ayahs</Body2Medium>
        </View>
        <TouchableOpacity 
          style={styles.changeJuzzButton}
          onPress={handleChangeJuzzPress}
        >
          <Body2Medium style={styles.changeJuzzText}>Change Juzz</Body2Medium>
        </TouchableOpacity>
      </View>
      
      {/* Verses */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {Object.keys(groupedVerses).map(surahName => 
          renderSurahSection(surahName, groupedVerses[surahName])
        )}
        
        {/* Footer image */}
        <HadithImageFooter />
      </ScrollView>
      
      {/* Floating play button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={togglePlayPause}
        activeOpacity={0.8}
      >
        <PlayIcon width={24} height={24} fill="#FFFFFF" />
      </TouchableOpacity>
      
      {/* Audio player (visible when playing) */}
      {isPlaying && (
        <View style={styles.audioPlayer}>
          <View style={styles.audioPlayerContent}>
            <Body2Bold style={styles.audioTitle}>{juzzName}</Body2Bold>
            <Body2Medium style={styles.audioTime}>0:20 / 3:12</Body2Medium>
            <View style={styles.audioControls}>
              <TouchableOpacity>
                <Body2Medium>Previous</Body2Medium>
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause}>
                <Body2Medium>Pause</Body2Medium>
              </TouchableOpacity>
              <TouchableOpacity>
                <Body2Medium>Next</Body2Medium>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(12),
  },
  juzzInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  juzzInfo: {
    flex: 1,
  },
  juzzSubtitle: {
    color: '#737373',
    marginTop: scale(4),
  },
  changeJuzzButton: {
    paddingHorizontal: scale(12),
    paddingVertical: scale(6),
    borderRadius: scale(4),
    backgroundColor: '#F5F5F5',
  },
  changeJuzzText: {
    color: '#404040',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(80), // Extra padding for the floating button
  },
  surahSection: {
    marginTop: scale(16),
  },
  surahHeader: {
    marginBottom: scale(12),
    paddingBottom: scale(8),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  surahTitle: {
    fontSize: scale(16),
    marginBottom: scale(4),
  },
  surahInfo: {
    color: '#737373',
  },
  verseContainer: {
    marginVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: scale(12),
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(8),
  },
  verseNumberContainer: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(14),
    backgroundColor: ColorPrimary.primary100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseNumber: {
    color: ColorPrimary.primary500,
  },
  verseControls: {
    flexDirection: 'row',
    gap: scale(12),
  },
  tafseerButton: {
    color: ColorPrimary.primary500,
  },
  shareButton: {
    color: '#737373',
  },
  arabicContainer: {
    alignItems: 'flex-end',
    marginBottom: scale(8),
  },
  arabicText: {
    fontSize: scale(18),
    lineHeight: scale(32),
    textAlign: 'right',
    color: '#171717',
  },
  translationContainer: {
    marginBottom: scale(8),
  },
  translationText: {
    color: '#404040',
    lineHeight: scale(20),
  },
  transliterationContainer: {
    marginBottom: scale(8),
  },
  transliterationText: {
    color: '#737373',
    fontStyle: 'italic',
    lineHeight: scale(20),
  },
  floatingButton: {
    position: 'absolute',
    bottom: scale(20),
    right: scale(20),
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: ColorPrimary.primary500,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  audioPlayer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: scale(60),
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: scale(16),
    paddingVertical: scale(8),
  },
  audioPlayerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioTitle: {
    flex: 1,
  },
  audioTime: {
    color: '#737373',
    marginRight: scale(12),
  },
  audioControls: {
    flexDirection: 'row',
    gap: scale(16),
  },
});

export default JuzzDetailScreen;
