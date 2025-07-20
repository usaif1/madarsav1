import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, Body1Title2Bold, Body1Title2Regular, H5Medium } from '@/components/Typography/Typography';
import { CdnSvg } from '@/components/CdnSvg';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';
import CustomHeader from '@/components/Header/Header';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { useQuranNavigation } from '../../context/QuranNavigationContext';
import { useQuranStore, SavedAyah } from '../../store/quranStore';
import { BubbleIndex } from '../../components/BubbleIndex';

type SavedAyahsScreenNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedAyahs'>;

const SavedAyahsScreen: React.FC = () => {
  const navigation = useNavigation<SavedAyahsScreenNavigationProp>();
  const { setTabsVisibility } = useQuranNavigation();
  const { savedAyahs, removeAyah } = useQuranStore();

  // Hide both tabs when this screen is focused
  useFocusEffect(
    React.useCallback(() => {
      setTabsVisibility(false, false); // Hide both top and bottom tabs
      return () => {
        // Tabs will be shown again when returning to list screen
      };
    }, [setTabsVisibility])
  );

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle remove from saved
  const handleRemoveFromSaved = (ayahId: string) => {
    removeAyah(ayahId);
  };

  // Handle share with proper formatting (no word by word)
  const handleShare = async (ayah: SavedAyah) => {
    try {
      const shareContent = `${ayah.arabic}

Translation: ${ayah.translation}

Transliteration: ${ayah.transliteration}

${ayah.surahName}, Verse ${ayah.ayahNumber}`;

      await Share.share({
        message: shareContent,
        title: `${ayah.surahName} - Verse ${ayah.ayahNumber}`,
      });
    } catch (error) {
      console.error('Error sharing ayah:', error);
    }
  };

  // Render word boxes from transliteration (simplified version for saved ayahs)
  const renderSimplifiedWordBoxes = (transliteration: string, translation: string) => {
    // Split transliteration and translation into words for display
    const transliterationWords = transliteration.split(' ').filter(word => word.trim());
    const translationWords = translation.split(' ').filter(word => word.trim());
    
    // Create simplified word pairs (reversed for RTL)
    const wordPairs = transliterationWords.map((translit, index) => ({
      transliteration: translit,
      translation: translationWords[index] || '',
    })).reverse(); // Reverse for RTL display

    if (wordPairs.length === 0) return null;

    return (
      <View style={styles.wordsContainer}>
        {wordPairs.slice(0, 8).map((wordPair, index) => ( // Limit to 8 words for space
          <View key={index} style={styles.wordBox}>
            <Body2Medium style={styles.wordTransliteration}>{wordPair.transliteration}</Body2Medium>
            <Body2Bold style={styles.wordTranslation}>{wordPair.translation}</Body2Bold>
          </View>
        ))}
        {wordPairs.length > 8 && (
          <View style={styles.moreWordsIndicator}>
            <Body2Medium style={styles.moreWordsText}>...</Body2Medium>
          </View>
        )}
      </View>
    );
  };

  // Render a saved ayah item with consistent UI matching detail screens
  const renderSavedAyahItem = ({ item }: { item: SavedAyah }) => (
    <View style={styles.verseCard}>
      {/* Verse content */}
      <View style={styles.verseContent}>
        {/* Top row with bubble index and word boxes */}
        <View style={styles.topRow}>
          {/* Fixed size bubble index */}
          <BubbleIndex number={item.ayahNumber} />
          
          {/* Word-by-word boxes (simplified from transliteration) */}
          {renderSimplifiedWordBoxes(item.transliteration, item.translation)}
        </View>
        
        {/* Translation section */}
        <View style={styles.translationSection}>
          <Body1Title2Bold style={styles.translationTitle}>Translation</Body1Title2Bold>
          <Body2Medium style={styles.translationText}>{item.translation}</Body2Medium>
        </View>
        
        {/* Bottom row */}
        <View style={styles.bottomRow}>
          {/* Left: Surah name and verse number */}
          <View style={styles.referenceContainer}>
            <Body1Title2Regular style={styles.referenceText}>{item.surahName}</Body1Title2Regular>
            <View style={styles.dot} />
            <Body1Title2Regular style={styles.referenceText}>{item.ayahNumber}</Body1Title2Regular>
          </View>
          
          {/* Right: Action icons (bookmark and share only) */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleRemoveFromSaved(item.id)}
            >
              <CdnSvg 
                path={DUA_ASSETS.BOOKMARK_PRIMARY}
                width={scale(20)}
                height={scale(20)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleShare(item)}
            >
              <CdnSvg 
                path={DUA_ASSETS.SHARE_ALT}
                width={scale(16)}
                height={scale(16)}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Body2Bold style={styles.emptyTitle}>No saved ayahs yet</Body2Bold>
      <Body2Medium style={styles.emptyText}>
        Bookmark your favorite verses to access them quickly here.
      </Body2Medium>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <CustomHeader
        title="Saved Ayahs"
        onBack={handleBackPress}
      />
      
      {/* Ayah list */}
      <FlatList
        data={savedAyahs}
        renderItem={renderSavedAyahItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      
      {/* Footer */}
      <HadithImageFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  listContainer: {
    paddingHorizontal: scale(0),
    paddingVertical: scale(8),
    flexGrow: 1,
  },
  verseCard: {
    backgroundColor: '#FFFFFF',
    marginVertical: scale(4),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  verseContent: {
    padding: scale(16),
    paddingHorizontal: scale(24),
    gap: scale(16),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: scale(6),
  },
  wordsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: scale(10),
  },
  wordBox: {
    width: 72,
    height: 60, // Smaller height since no Arabic text
    alignItems: 'center',
    justifyContent: 'center',
    gap: scale(2),
    padding: scale(6),
    paddingVertical: scale(8),
  },
  wordTransliteration: {
    fontSize: 9,
    lineHeight: 9 * 1.2,
    textAlign: 'center',
    color: '#525252',
    fontWeight: '400',
    marginBottom: scale(1),
  },
  wordTranslation: {
    fontSize: 9,
    lineHeight: 9 * 1.2,
    textAlign: 'center',
    color: '#525252',
    fontWeight: '600',
    paddingHorizontal: scale(2),
  },
  moreWordsIndicator: {
    width: 30,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreWordsText: {
    fontSize: 16,
    color: '#A3A3A3',
    fontWeight: 'bold',
  },
  translationSection: {
    gap: scale(4),
  },
  translationTitle: {
    fontSize: 14,
    lineHeight: 14 * 1.45,
    color: '#0A0A0A',
    fontWeight: '700',
  },
  translationText: {
    fontSize: 12,
    lineHeight: 12 * 1.4,
    color: '#404040',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  referenceText: {
    fontSize: 14,
    lineHeight: 14 * 1.45,
    color: '#6B7280',
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: '#D4D4D4',
    borderRadius: 5,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(32),
    paddingVertical: scale(64),
  },
  emptyTitle: {
    marginBottom: scale(8),
  },
  emptyText: {
    textAlign: 'center',
    color: '#737373',
  },
});

export default SavedAyahsScreen;