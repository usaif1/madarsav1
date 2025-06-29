import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SurahStackParamList } from '../../navigation/surah.navigator';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold } from '@/components/Typography/Typography';
import BackButton from '@/components/BackButton/BackButton';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import SurahHeader from '../../components/SurahHeader/SurahHeader';

// Define the type for a verse
type Verse = {  
  id: number;
  arabic: string;
  translation: string;
  transliteration: string;
};

// Sample data for verses
const SAMPLE_VERSES: Verse[] = [
  {
    id: 1,
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'In the Name of Allah—the Most Compassionate, Most Merciful.',
    transliteration: 'Bismillahir Rahmanir Raheem',
  },
  {
    id: 2,
    arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    translation: 'All praise is for Allah—Lord of all worlds,',
    transliteration: 'Alhamdu lillahi rabbil alamin',
  },
  {
    id: 3,
    arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
    translation: 'the Most Compassionate, Most Merciful,',
    transliteration: 'Ar-Rahman ar-Raheem',
  },
  {
    id: 4,
    arabic: 'مَالِكِ يَوْمِ الدِّينِ',
    translation: 'Master of the Day of Judgment.',
    transliteration: 'Maliki yawmid-din',
  },
  {
    id: 5,
    arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
    translation: 'You ˹alone˺ we worship and You ˹alone˺ we ask for help.',
    transliteration: `Iyyaka na'budu wa iyyaka nasta'in`,
  },
];

// Define route types for both stacks
type SurahRouteProp = RouteProp<SurahStackParamList, 'surahDetail'>;
type SavedSurahRouteProp = RouteProp<SavedStackParamList, 'savedSurahDetail'>;

// Define navigation types for both stacks
type SurahNavigationProp = NativeStackNavigationProp<SurahStackParamList, 'surahDetail'>;
type SavedSurahNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedSurahDetail'>;

const SurahDetailScreen: React.FC = () => {
  const route = useRoute<SurahRouteProp | SavedSurahRouteProp>();
  const navigation = useNavigation();
  const { surahId, surahName } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Determine which stack we're in
  const isSavedStack = route.name === 'savedSurahDetail';

  // Handle surah change from header
  const handleSurahChange = (newSurahId: number, newSurahName: string) => {
    if (!isSavedStack) {
      // Navigate to the new surah
      (navigation as unknown as SurahNavigationProp).navigate('surahDetail', {
        surahId: newSurahId,
        surahName: newSurahName
      });
    }
  };

  // Handle settings change from header
  const handleSettingsChange = (settings: any) => {
    // Apply settings logic here
    console.log('Settings applied:', settings);
  };

  // Handle tafseer press
  const handleTafseerPress = (verse: Verse) => {
    if (isSavedStack) {
      // If in saved stack, we need to cast the navigation
      (navigation as unknown as SavedSurahNavigationProp).navigate('savedAyahDetail', {
        ayahId: verse.id,
        surahName,
        verseNumber: verse.id
      });
    } else {
      // If in regular surah stack
      (navigation as unknown as SurahNavigationProp).navigate('tafseer', {
        surahId,
        ayahId: verse.id,
        verse: verse.arabic,
      });
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Add audio playback logic here
  };

  // Render a verse item
  const renderVerse = (verse: Verse) => (
    <View key={verse.id} style={styles.verseContainer}>
      {/* Verse number and controls */}
      <View style={styles.verseHeader}>
        <TouchableOpacity style={styles.verseNumberContainer}>
          <Body2Medium style={styles.verseNumber}>{verse.id}</Body2Medium>
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

  return (
    <View style={styles.container}>
      {/* Header */}
      <SurahHeader
        onBack={() => navigation.goBack()}
        surahName={surahName}
        surahInfo="Meccan • 7 Ayyahs"
        currentSurahId={surahId}
        onSurahChange={handleSurahChange}
        onSettingsChange={handleSettingsChange}
      />
      
      {/* Verses */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {SAMPLE_VERSES.map(verse => renderVerse(verse))}
      </ScrollView>
      
      {/* Floating play button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={togglePlayPause}
        activeOpacity={0.8}
      >
        <CdnSvg path={DUA_ASSETS.QURAN_PLAY_WHITE_ICON} width={36} height={36} fill="#FFFFFF" />
      </TouchableOpacity>
      
      {/* Audio player (visible when playing) */}
      {isPlaying && (
        <View style={styles.audioPlayer}>
          <View style={styles.audioPlayerContent}>
            <Body2Bold style={styles.audioTitle}>Al-Fatiha</Body2Bold>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: scale(16),
    paddingBottom: scale(80), // Extra padding for the floating button
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

export default SurahDetailScreen;
