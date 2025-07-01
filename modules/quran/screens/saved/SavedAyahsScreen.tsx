import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, CaptionMedium } from '@/components/Typography/Typography';
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

  // Handle verse press
  const handleVersePress = (ayah: SavedAyah) => {
    navigation.navigate('savedAyahDetail', {
      ayahId: parseInt(ayah.id.split('-')[1]), // Extract ayah number from id
      surahName: ayah.surahName,
      verseNumber: ayah.ayahNumber
    });
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle remove from saved
  const handleRemoveFromSaved = (ayahId: string) => {
    removeAyah(ayahId);
  };

  // Render a saved ayah item
  const renderSavedAyahItem = ({ item }: { item: SavedAyah }) => (
    <TouchableOpacity 
      style={styles.verseItem}
      onPress={() => handleVersePress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.verseHeader}>
        <View style={styles.verseInfo}>
          <Body2Bold>{item.surahName}</Body2Bold>
          <CaptionMedium style={styles.verseNumber}>Ayah {item.ayahNumber}</CaptionMedium>
        </View>
        <TouchableOpacity 
          style={styles.bookmarkButton}
          onPress={() => handleRemoveFromSaved(item.id)}
        >
          <CdnSvg path={DUA_ASSETS.BOOKMARK_PRIMARY} width={20} height={20} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.arabicContainer}>
        <Body2Bold style={styles.arabicText}>{item.arabic}</Body2Bold>
      </View>
      
      <View style={styles.translationContainer}>
        <Body2Medium style={styles.translationText}>{item.translation}</Body2Medium>
      </View>
      
      <CaptionMedium style={styles.dateAdded}>
        Saved on {new Date(item.savedAt).toLocaleDateString()}
      </CaptionMedium>
    </TouchableOpacity>
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
  listContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(12),
    flexGrow: 1,
  },
  verseItem: {
    padding: scale(16),
    backgroundColor: '#FAFAFA',
    borderRadius: scale(8),
    marginBottom: scale(16),
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(12),
  },
  verseInfo: {
    flex: 1,
  },
  verseNumber: {
    color: '#737373',
    marginTop: scale(4),
  },
  bookmarkButton: {
    padding: scale(4),
  },
  arabicContainer: {
    marginBottom: scale(12),
  },
  arabicText: {
    fontSize: scale(18),
    lineHeight: scale(32),
    textAlign: 'right',
    color: '#171717',
  },
  translationContainer: {
    marginBottom: scale(12),
  },
  translationText: {
    color: '#404040',
    lineHeight: scale(20),
  },
  dateAdded: {
    color: '#737373',
    textAlign: 'right',
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
