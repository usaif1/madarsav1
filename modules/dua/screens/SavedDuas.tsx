import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Body1Title2Bold, Body2Medium, Divider } from '@/components';
import { Header } from '@/components';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { useDuaStore } from '../store/duaStore';
import { useAllDuas, useDuaCategories } from '../hooks/useDuas';
import { useThemeStore } from '@/globalStore';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';

import { CdnSvg } from '@/components/CdnSvg';

// Icon mapping for categories
const categoryIconMap: Record<string, string> = {
  'Morning Azkar': DUA_ASSETS.PRAISING_ALLAH,
  'Evening Azkar': DUA_ASSETS.FOOD_DRINK,
  'Daily Zikr': DUA_ASSETS.DAILY_ZIKR,
  'Mosque Duas': DUA_ASSETS.WASHROOM,
  'Home': DUA_ASSETS.HOUSE,
  'Ramadan': DUA_ASSETS.GOOD_ETIQUETTE,
  // Default fallback icon
  'default': DUA_ASSETS.DAILY_ZIKR,
};

interface SavedDuaItemProps {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: string;
  bookmarked: boolean;
}

const SavedDuas = () => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useThemeStore();
  const { getSavedCategories, getBookmarkedDuasByCategory } = useDuaStore();
  const { isLoading, error } = useAllDuas();
  const allCategories = useDuaCategories();
  
  // Get all categories that have bookmarked duas
  const savedCategories = getSavedCategories();
  
  // Create data for the saved categories
  const savedDuasData = savedCategories.map(categoryName => {
    // Find the category in all categories
    const matchingCategory = allCategories.find(cat => cat.title === categoryName);
    // Get all bookmarked duas for this category
    const bookmarkedDuas = getBookmarkedDuasByCategory(categoryName);
    
    return {
      id: matchingCategory?.id || categoryName,
      title: categoryName,
      description: `Bookmarked duas from ${categoryName}`,
      count: bookmarkedDuas.length,
      icon: categoryIconMap[categoryName] || categoryIconMap.default,
      bookmarked: true
    };
  });

  const handleDuaPress = (item: SavedDuaItemProps) => {
    navigation.navigate('DuaDetail', {
      title: item.title,
      count: item.count,
      category: item.title,
      fromSaved: true // Flag to indicate we're coming from saved screen
    });
  };

  const renderDuaItem = ({ item }: { item: SavedDuaItemProps }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => handleDuaPress(item)}
      activeOpacity={0.7}
    >
      <CdnSvg 
        path={item.icon}
        width={scale(38)}
        height={scale(38)}
      />
      <View style={styles.textWrapper}>
        <Body1Title2Bold>{item.title}</Body1Title2Bold>
        <Divider height={4} />
        <Body2Medium color="sub-heading">{item.description}</Body2Medium>
      </View>
      
      <Body2Medium color="sub-heading">{item.count} Duas</Body2Medium>
    </TouchableOpacity>
  );

  const renderSeparator = () => <View style={styles.separator} />;

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Header title="Saved Duas" />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary.primary500} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Saved Duas" />
      
      {/* Ayah graphic at top */}
      <View style={styles.ayahContainer}>
        <FastImage 
          source={{ uri: getCdnUrl(DUA_ASSETS.DUA_AYAH) }}
          style={styles.ayahImage}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
      
      {savedDuasData.length > 0 ? (
        <FlatList
          data={savedDuasData}
          renderItem={renderDuaItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          ItemSeparatorComponent={renderSeparator}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved duas yet</Text>
          <Text style={styles.emptySubtext}>Bookmark duas to see them here</Text>
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
  ayahContainer: {
    width: scale(375),
    height: verticalScale(121),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF7',
  },
  ayahImage: {
    width: '100%',
    height: '100%',
  },
  listContainer: {
    paddingBottom: 24,
    paddingHorizontal: 18,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    columnGap: 8,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
  },
  textWrapper: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginLeft: 68, // aligns with text start
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
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});

export default SavedDuas;
