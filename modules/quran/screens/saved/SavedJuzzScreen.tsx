import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import BackButton from '@/components/BackButton/BackButton';
import BookmarkFillIcon from '@/assets/hadith/bookmarked.svg';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';

// Define the type for a saved juzz item
type SavedJuzz = {
  id: number;
  surahName: string;
  ayahNumber: number;
  title: string;
  progress: number; // 0-100 percentage of completion
};

// Sample data for saved juzz
const SAVED_JUZZ: SavedJuzz[] = [
  { 
    id: 1, 
    surahName: 'Al-Fatiah', 
    ayahNumber: 1, 
    title: 'In the name of Allah, the Entirely', 
    progress: 100 
  },
  { 
    id: 2, 
    surahName: 'Al-Fatiah', 
    ayahNumber: 1, 
    title: 'In the name of Allah, the Entirely', 
    progress: 75 
  },
  { 
    id: 3, 
    surahName: 'Al-Fatiah', 
    ayahNumber: 1, 
    title: 'In the name of Allah, the Entirely', 
    progress: 50 
  },
  { 
    id: 4, 
    surahName: 'Al-Fatiah', 
    ayahNumber: 1, 
    title: 'In the name of Allah, the Entirely', 
    progress: 25 
  },
];

type SavedJuzzScreenNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedJuzz'>;

const SavedJuzzScreen: React.FC = () => {
  const navigation = useNavigation<SavedJuzzScreenNavigationProp>();

  // Handle juzz press
  const handleJuzzPress = (juzz: SavedJuzz) => {
    navigation.navigate('savedJuzzDetail', {
      juzzId: juzz.id,
      juzzName: `Juzz ${juzz.id}`
    });
  };

  // Handle back button press
  const handleBackPress = () => {
    navigation.goBack();
  };

  // Handle bookmark toggle
  const handleBookmarkToggle = (juzzId: number) => {
    // Toggle bookmark logic (will be implemented later)
    console.log(`Toggle bookmark for juzz ${juzzId}`);
  };

  // Render a saved juzz item
  const renderSavedJuzzItem = ({ item }: { item: SavedJuzz }) => (
    <TouchableOpacity 
      style={styles.juzzItem}
      onPress={() => handleJuzzPress(item)}
      activeOpacity={0.7}
    >
      {/* Juzz fraction indicator */}
      <View style={styles.fractionContainer}>
        <Body2Bold style={styles.fractionText}>1/4</Body2Bold>
      </View>
      
      {/* Juzz details */}
      <View style={styles.juzzDetails}>
        <View style={styles.juzzTitleRow}>
          <Body2Bold>{item.title}</Body2Bold>
          <TouchableOpacity onPress={() => handleBookmarkToggle(item.id)}>
            <BookmarkFillIcon width={20} height={20} fill={ColorPrimary.primary500} />
          </TouchableOpacity>
        </View>
        <CaptionMedium style={styles.juzzInfo}>
          {item.surahName} • Ayah {item.ayahNumber}
        </CaptionMedium>
        
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View 
            style={[styles.progressBar, { width: `${item.progress}%` }]} 
          />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <H5Bold style={styles.emptyTitle}>No saved juzz yet</H5Bold>
      <Body2Medium style={styles.emptyText}>
        Bookmark your favorite juzz to access them quickly here.
      </Body2Medium>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <BackButton onPress={handleBackPress} />
        <H5Bold style={styles.headerTitle}>Saved Juzz</H5Bold>
        <View style={styles.headerRight} />
      </View>
      
      {/* Juzz list */}
      <FlatList
        data={SAVED_JUZZ}
        renderItem={renderSavedJuzzItem}
        keyExtractor={(item) => item.id.toString()}
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
  juzzItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  fractionContainer: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: ColorPrimary.primary100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  fractionText: {
    color: ColorPrimary.primary500,
    fontSize: scale(10),
  },
  juzzDetails: {
    flex: 1,
  },
  juzzTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  juzzInfo: {
    color: '#737373',
    marginBottom: scale(6),
  },
  progressBarContainer: {
    height: scale(4),
    backgroundColor: '#F0F0F0',
    borderRadius: scale(2),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: ColorPrimary.primary500,
    borderRadius: scale(2),
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

export default SavedJuzzScreen;
