import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
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

  // Handle share
  const handleShare = (ayah: SavedAyah) => {
    // Implement share functionality
    console.log('Share ayah:', ayah.id);
  };

  // Handle play
  const handlePlay = (ayah: SavedAyah) => {
    // Implement play functionality
    console.log('Play ayah:', ayah.id);
  };

  // Render word boxes from Arabic text (simplified version)
  const renderSimplifiedArabic = (arabicText: string, ayahNumber: number) => (
    <View style={styles.topRow}>
      {/* Bubble index */}
      <View style={styles.bubbleContainer}>
        <CdnSvg 
          path={DUA_ASSETS.BUBBLE}
          width={scale(26)}
          height={scale(26)}
        />
        <Body1Title2Bold style={styles.bubbleNumber}>
          {ayahNumber}
        </Body1Title2Bold>
      </View>
      
      {/* Arabic text in a simplified layout */}
      <View style={styles.arabicTextContainer}>
        <H5Medium style={styles.arabicText}>{arabicText}</H5Medium>
      </View>
    </View>
  );

  // Render a saved ayah item with consistent UI
  const renderSavedAyahItem = ({ item }: { item: SavedAyah }) => (
    <View style={styles.verseCard}>
      {/* Verse content */}
      <View style={styles.verseContent}>
        {/* Top row with bubble index and Arabic text */}
        {renderSimplifiedArabic(item.arabic, item.ayahNumber)}
        
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
          
          {/* Right: Action icons */}
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
                width={scale(20)}
                height={scale(20)}
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handlePlay(item)}
            >
              <CdnSvg 
                path={DUA_ASSETS.SURAH_PLAY_ICON}
                width={scale(20)}
                height={scale(20)}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Date saved info */}
        <View style={styles.dateSavedContainer}>
          <Body2Medium style={styles.dateSavedText}>
            Saved on {new Date(item.savedAt).toLocaleDateString()}
          </Body2Medium>
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
    marginVertical: scale(8),
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
  bubbleContainer: {
    position: 'relative',
    width: scale(26),
    height: scale(26),
    marginTop: scale(8),
  },
  bubbleNumber: {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: [{ translateX: -3 }, { translateY: -8 }],
    color: ColorPrimary.primary600,
    fontSize: 12,
  },
  arabicTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
    paddingTop: scale(8),
  },
  arabicText: {
    fontSize: 20,
    lineHeight: 20 * 1.4,
    textAlign: 'right',
    color: '#171717',
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
  dateSavedContainer: {
    alignItems: 'flex-end',
    marginTop: scale(-8),
  },
  dateSavedText: {
    fontSize: 12,
    color: '#737373',
    fontStyle: 'italic',
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
