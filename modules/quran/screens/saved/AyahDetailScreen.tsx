import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import BackButton from '@/components/BackButton/BackButton';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';

type AyahDetailScreenRouteProp = RouteProp<SavedStackParamList, 'savedAyahDetail'>;
type AyahDetailScreenNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedAyahDetail'>;

// Mock verse data - in a real app, this would be fetched based on the ayahId
const mockVerse = {
  id: 1,
  surahId: 1,
  surahName: 'Al-Fatiha',
  verseNumber: 1,
  arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  translation: 'In the Name of Allah—the Most Compassionate, Most Merciful.',
  transliteration: 'Bismillāhir-raḥmānir-raḥīm',
  tafseer: {
    english: 'This verse is the opening of the Quran, teaching us to begin all actions with the name of Allah, acknowledging His mercy and compassion.',
    arabic: 'هذه الآية هي افتتاحية القرآن، تعلمنا أن نبدأ كل الأعمال باسم الله، معترفين برحمته وشفقته.'
  },
  audio: 'https://example.com/audio/1_1.mp3',
};

const AyahDetailScreen: React.FC = () => {
  const route = useRoute<AyahDetailScreenRouteProp>();
  const navigation = useNavigation<AyahDetailScreenNavigationProp>();
  const { ayahId, surahName, verseNumber } = route.params;
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [selectedTafseer, setSelectedTafseer] = useState<'english' | 'arabic'>('english');

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle play/pause audio
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // Audio playback logic would be implemented here
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = () => {
    setIsSaved(!isSaved);
    // Save/unsave logic would be implemented here
  };

  // Handle share
  const handleShare = async () => {
    try {
      await Share.share({
        message: `${mockVerse.arabic}\n\n${mockVerse.translation}\n\n${surahName} (${verseNumber})`,
      });
    } catch (error) {
      console.error('Error sharing verse:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <H5Bold style={styles.headerTitle}>{surahName}</H5Bold>
        <View style={styles.headerRight} />
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Verse info */}
        <View style={styles.verseInfoContainer}>
          <H5Bold style={styles.verseNumber}>Ayah {verseNumber}</H5Bold>
          <View style={styles.verseActions}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleBookmarkToggle}
            >
              <CdnSvg 
                path={isSaved ? DUA_ASSETS.QURAN_BOOKMARK_FILL_ICON : DUA_ASSETS.QURAN_BOOKMARK_ICON}
                width={20}
                height={20}
                fill={isSaved ? ColorPrimary.primary500 : '#CCCCCC'}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <CdnSvg path={DUA_ASSETS.QURAN_SHARE_ICON} width={20} height={20} fill="#404040" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Arabic text */}
        <View style={styles.arabicContainer}>
          <Body2Bold style={styles.arabicText}>{mockVerse.arabic}</Body2Bold>
        </View>
        
        {/* Transliteration */}
        <View style={styles.transliterationContainer}>
          <Body2Medium style={styles.transliterationText}>{mockVerse.transliteration}</Body2Medium>
        </View>
        
        {/* Translation */}
        <View style={styles.translationContainer}>
          <Body2Medium style={styles.translationText}>{mockVerse.translation}</Body2Medium>
        </View>
        
        {/* Tafseer section */}
        <View style={styles.tafseerContainer}>
          <H5Bold style={styles.tafseerTitle}>Tafseer</H5Bold>
          
          {/* Tafseer language selector */}
          <View style={styles.tafseerTabs}>
            <TouchableOpacity
              style={[
                styles.tafseerTab,
                selectedTafseer === 'english' && styles.tafseerTabActive
              ]}
              onPress={() => setSelectedTafseer('english')}
            >
              <Body2Medium 
                style={[
                  styles.tafseerTabText,
                  selectedTafseer === 'english' && styles.tafseerTabTextActive
                ]}
              >
                English
              </Body2Medium>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tafseerTab,
                selectedTafseer === 'arabic' && styles.tafseerTabActive
              ]}
              onPress={() => setSelectedTafseer('arabic')}
            >
              <Body2Medium 
                style={[
                  styles.tafseerTabText,
                  selectedTafseer === 'arabic' && styles.tafseerTabTextActive
                ]}
              >
                Arabic
              </Body2Medium>
            </TouchableOpacity>
          </View>
          
          {/* Tafseer content */}
          <View style={styles.tafseerContent}>
            <Body2Medium style={styles.tafseerText}>
              {selectedTafseer === 'english' ? mockVerse.tafseer.english : mockVerse.tafseer.arabic}
            </Body2Medium>
          </View>
        </View>
      </ScrollView>
      
      {/* Floating play button */}
      <TouchableOpacity 
        style={styles.playButton}
        onPress={handlePlayPause}
      >
        <CdnSvg path={DUA_ASSETS.QURAN_PLAY_ICON} width={24} height={24} fill="#FFFFFF" />
      </TouchableOpacity>
      
      {/* Footer */}
      <HadithImageFooter />
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: scale(24), // Same width as back button for balanced layout
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: scale(16),
    paddingBottom: scale(80), // Extra padding for the floating button
  },
  verseInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(16),
  },
  verseNumber: {
    color: ColorPrimary.primary500,
  },
  verseActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: scale(8),
    marginLeft: scale(8),
  },
  arabicContainer: {
    marginBottom: scale(16),
  },
  arabicText: {
    fontSize: scale(24),
    lineHeight: scale(40),
    textAlign: 'right',
    color: '#171717',
  },
  transliterationContainer: {
    marginBottom: scale(16),
  },
  transliterationText: {
    color: '#404040',
    lineHeight: scale(24),
    fontStyle: 'italic',
  },
  translationContainer: {
    marginBottom: scale(24),
    paddingBottom: scale(24),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  translationText: {
    color: '#404040',
    lineHeight: scale(24),
  },
  tafseerContainer: {
    marginBottom: scale(24),
  },
  tafseerTitle: {
    marginBottom: scale(12),
  },
  tafseerTabs: {
    flexDirection: 'row',
    marginBottom: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  tafseerTab: {
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    marginRight: scale(8),
  },
  tafseerTabActive: {
    borderBottomWidth: 2,
    borderBottomColor: ColorPrimary.primary500,
  },
  tafseerTabText: {
    color: '#737373',
  },
  tafseerTabTextActive: {
    color: ColorPrimary.primary500,
  },
  tafseerContent: {
    backgroundColor: '#FAFAFA',
    padding: scale(16),
    borderRadius: scale(8),
  },
  tafseerText: {
    color: '#404040',
    lineHeight: scale(24),
  },
  playButton: {
    position: 'absolute',
    right: scale(16),
    bottom: scale(80), // Position above the footer
    width: scale(56),
    height: scale(56),
    borderRadius: scale(28),
    backgroundColor: ColorPrimary.primary500,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default AyahDetailScreen;
