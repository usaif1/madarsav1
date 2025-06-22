import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SavedStackParamList } from '../../navigation/saved.navigator';
import { scale, verticalScale } from '@/theme/responsive';
import { ColorPrimary } from '@/theme/lightColors';
import { Body2Medium, Body2Bold, H5Bold, CaptionMedium } from '@/components/Typography/Typography';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import { CdnSvg } from '@/components/CdnSvg';

// Define the type for a saved category
type SavedCategory = {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  color: string;
};

type SavedListScreenNavigationProp = NativeStackNavigationProp<SavedStackParamList, 'savedList'>;

const SavedListScreen: React.FC = () => {
  const navigation = useNavigation<SavedListScreenNavigationProp>();

  // Sample data for saved categories
  const savedCategories: SavedCategory[] = [
    {
      id: 'surah',
      title: 'Surah',
      description: 'Duas to read in morning',
      count: 3,
      icon: <CdnSvg path={DUA_ASSETS.BOOKMARK_PRIMARY} width={24} height={24} />,
      color: '#F9E9FF',
    },
    {
      id: 'juzz',
      title: 'Juzz',
      description: 'Duas to read in evening',
      count: 1,
      icon: <CdnSvg path={DUA_ASSETS.BOOKMARK_PRIMARY} width={24} height={24} />,
      color: '#E9E5FF',
    },
    {
      id: 'ayahs',
      title: 'Ayyahs',
      description: 'Duas to read daily',
      count: 43,
      icon: <CdnSvg path={DUA_ASSETS.BOOKMARK_PRIMARY} width={24} height={24} />,
      color: '#EBF5FF',
    },
  ];

  // Handle category press
  const handleCategoryPress = (category: SavedCategory) => {
    switch (category.id) {
      case 'surah':
        navigation.navigate('savedSurahs');
        break;
      case 'juzz':
        navigation.navigate('savedJuzz');
        break;
      case 'ayahs':
        navigation.navigate('savedAyahs');
        break;
      default:
        console.log(`Category ${category.id} pressed`);
    }
  };

  // Render a category item
  const renderCategoryItem = ({ item }: { item: SavedCategory }) => (
    <TouchableOpacity 
      style={styles.categoryItem}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        {item.icon}
      </View>
      <View style={styles.categoryDetails}>
        <View style={styles.categoryTitleRow}>
          <Body2Bold>{item.title}</Body2Bold>
          <Body2Medium style={styles.categoryCount}>{item.count} Saved</Body2Medium>
        </View>
        <CaptionMedium style={styles.categoryDescription}>
          {item.description}
        </CaptionMedium>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <H5Bold style={styles.emptyTitle}>No saved items yet</H5Bold>
      <Body2Medium style={styles.emptyText}>
        Bookmark your favorite surahs, juzz, and verses to access them quickly here.
      </Body2Medium>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={savedCategories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
      <HadithImageFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: scale(16),
    flexGrow: 1,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(12),
  },
  categoryDetails: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
  },
  categoryCount: {
    color: '#737373',
  },
  categoryDescription: {
    color: '#737373',
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

export default SavedListScreen;
