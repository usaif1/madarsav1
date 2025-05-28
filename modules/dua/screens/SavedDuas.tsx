import React, { useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import { Body1Title2Bold, Body2Medium, Divider } from '@/components';
import { Header } from '@/components';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';

// Icons for categories
import DailyZikr from '@/assets/duas/daily_zikr.svg';
import MorningAzkar from '@/assets/duas/praising_allah.svg';
import EveningAzkar from '@/assets/duas/food_&_drink.svg';
import MosqueDuas from '@/assets/duas/washroom.svg';
import HomeDuas from '@/assets/duas/house.svg';
import RamadanDuas from '@/assets/duas/good_etiquette.svg';
import { useDuaStore } from '../store/duaStore';
import { useAllDuas, useDuaCategories } from '../hooks/useDuas';
import { useThemeStore } from '@/globalStore';

// Icon mapping for categories
const categoryIconMap: Record<string, any> = {
  'Morning Azkar': MorningAzkar,
  'Evening Azkar': EveningAzkar,
  'Daily Zikr': DailyZikr,
  'Mosque Duas': MosqueDuas,
  'Home': HomeDuas,
  'Ramadan': RamadanDuas,
  // Default fallback icon
  'default': DailyZikr,
};

interface SavedDuaItemProps {
  id: string;
  title: string;
  description: string;
  count: number;
  icon: React.ComponentType<any>;
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

  const renderDuaItem = ({ item }: { item: SavedDuaItemProps }) => {
    const IconComponent = item.icon;
    
    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => handleDuaPress(item)}
        activeOpacity={0.7}
      >
        <IconComponent width={38} height={38} />
        <View style={styles.textWrapper}>
          <Body1Title2Bold>{item.title}</Body1Title2Bold>
          <Divider height={4} />
          <Body2Medium color="sub-heading">{item.description}</Body2Medium>
        </View>
        
        <Body2Medium color="sub-heading">{item.count} Duas</Body2Medium>
      </TouchableOpacity>
    );
  };

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
          source={require('@/assets/duas/dua-ayah.png')} 
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
