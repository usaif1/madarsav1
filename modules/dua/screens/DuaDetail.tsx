import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import { Body1Title2Bold, Body2Medium, Divider } from '@/components';
import BookmarkPrimary from '@/assets/duas/bookmark-primary.svg';
import { scale, verticalScale } from '@/theme/responsive';
import { Header } from '@/components';
import { useDuaSubCategories, useAllDuas } from '@/modules/dua/hooks/useDuas';
import { useThemeStore } from '@/globalStore';
import { useDuaStore } from '../store/duaStore';

// Fallback data for duas within a category
const fallbackDuasInCategory = [
  {
    id: '1',
    title: 'Everyday Duas',
    bookmarked: false,
    count: 2,
    subCategory: 'Everyday Duas',
  },
  {
    id: '2',
    title: 'Strengthen your Imaan',
    bookmarked: false,
    count: 4,
    subCategory: 'Strengthen your Imaan',
  },
  {
    id: '3',
    title: 'To be a pious Muslim',
    bookmarked: true,
    count: 5,
    subCategory: 'To be a pious Muslim',
  },
  {
    id: '4',
    title: 'To make us practising Muslims',
    bookmarked: false,
    count: 2,
    subCategory: 'To make us practising Muslims',
  },
  {
    id: '5',
    title: 'After Waking Up',
    bookmarked: false,
    count: 3,
    subCategory: 'After Waking Up',
  },
  {
    id: '6',
    title: 'Before Eating',
    bookmarked: false,
    count: 8,
    subCategory: 'Before Eating',
  },
];

interface DuaItemProps {
  id: string;
  title: string;
  bookmarked?: boolean;
  count: number;
  subCategory?: string;
}

const DuaDetail = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { title, count, category, fromSaved } = route.params as { title: string; count: number; category: string; fromSaved?: boolean };
  const { colors } = useThemeStore();
  const { isDuaSaved, isSubCategoryBookmarked, getBookmarkedSubCategoriesByCategory, getBookmarkedDuasByCategory } = useDuaStore();
  
  // Fetch all duas to ensure the store is populated
  const { isLoading: isLoadingAllDuas } = useAllDuas();
  
  // Get subcategories for the selected category
  const subCategories = useDuaSubCategories(category || title);
  
  // Use API data if available, otherwise fallback to hardcoded data
  const duasInCategory = subCategories.length > 0 
    ? subCategories.map(subCat => ({
        id: subCat.id,
        title: subCat.title,
        count: subCat.count,
        bookmarked: false, // Will be updated below
        subCategory: subCat.title // Add subCategory for reference
      }))
    : fallbackDuasInCategory;
  
  // Update bookmarked status based on store data
  const duasWithBookmarks = duasInCategory.map(dua => {
    const duaId = typeof dua.id === 'string' ? parseInt(dua.id) : dua.id;
    const isBookmarked = !isNaN(duaId) ? isDuaSaved(duaId) : false;
    const isSubCatBookmarked = dua.subCategory ? isSubCategoryBookmarked(dua.subCategory) : false;
    
    // If coming from SavedDuas, calculate the count of saved duas in this subcategory
    let displayCount = dua.count;
    if (fromSaved && dua.subCategory) {
      const bookmarkedDuas = getBookmarkedDuasByCategory(category).filter(
        (savedDua: any) => savedDua.subCategory === dua.subCategory
      );
      displayCount = bookmarkedDuas.length;
    }
    
    return {
      ...dua,
      bookmarked: isBookmarked || isSubCatBookmarked,
      count: displayCount
    };
  });
  
  // If coming from SavedDuas page, filter to show only subcategories with bookmarked duas
  const displayedDuas = fromSaved
    ? duasWithBookmarks.filter(dua => {
        if (dua.subCategory) {
          return isSubCategoryBookmarked(dua.subCategory);
        }
        return dua.bookmarked;
      })
    : duasWithBookmarks;

  const handleDuaPress = (item: DuaItemProps) => {
    navigation.navigate('DuaContent', {
      title: item.title,
      count: item.count,
      id: item.id,
      category: category || title,
      subCategory: item.title,
      fromSaved: fromSaved // Pass the fromSaved flag to DuaContent
    });
  };

  const renderDuaItem = ({ item }: { item: DuaItemProps }) => (
    <TouchableOpacity 
      style={styles.duaItem}
      onPress={() => handleDuaPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.textContainer}>
        <Body1Title2Bold style={styles.title}>{item.title}</Body1Title2Bold>
      </View>
      <View style={styles.rightContainer}>
        {item.bookmarked && (
          <BookmarkPrimary width={16} height={16} style={styles.bookmarkIcon} />
        )}
        <Body2Medium style={styles.countText} color="sub-heading">{item.count} {fromSaved ? 'Saved' : ''} Duas</Body2Medium>
      </View>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  if (isLoadingAllDuas) {
    return (
      <View style={styles.container}>
        <Header title={title} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary.primary500} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={title} />
      <FlatList
        data={displayedDuas}
        renderItem={renderDuaItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={renderSeparator}
        ListEmptyComponent={fromSaved ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bookmarked duas in this category</Text>
          </View>
        ) : null}
      />
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
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#8A57DC',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  duaItem: {
    width: '100%',
    height: verticalScale(52),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    shadowColor: '#E5E5E5',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: '#FFFFFF',
  },
  textContainer: {
    height: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minWidth: scale(80),
  },
  bookmarkIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  countText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'center',
  },
});

export default DuaDetail;
