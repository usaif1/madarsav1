import {FlatList, StyleSheet, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgProps } from 'react-native-svg';
import { FC } from 'react';

// CDN assets
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import {Body1Title2Bold, Body2Medium, Divider} from '@/components';
import { useDuaCategories, useAllDuas } from '@/modules/dua/hooks/useDuas';
import { useThemeStore } from '@/globalStore';
import { useDuaStore } from '@/modules/dua/store/duaStore';

// Fallback data for duas
const fallbackDuasData: DuaItemProps[] = [
  {
    id: '1',
    title: 'Morning & Evening',
    description: 'Duas for morning and evening',
    count: 12,
    icon: DUA_ASSETS.FAJR,
  },
  {
    id: '2',
    title: 'Daily Duas',
    description: 'Duas for daily activities',
    count: 24,
    icon: DUA_ASSETS.DAILY_ZIKR,
  },
  {
    id: '3',
    title: 'Night Duas',
    description: 'Duas for the night',
    count: 8,
    icon: DUA_ASSETS.ISHA,
    bookmarked: true,
  },
  {
    id: '4',
    title: 'Saved Duas',
    description: 'Your saved duas',
    count: 5,
    icon: DUA_ASSETS.BOOKMARK_WHITE,
  },
];

// Icon mapping for categories
const categoryIconMap: Record<string, string> = {
  'Daily Zikr': DUA_ASSETS.DAILY_ZIKR,
  'Praising Allah': DUA_ASSETS.PRAISING_ALLAH,
  'Food and Drinks': DUA_ASSETS.FOOD_DRINK,
  'House': DUA_ASSETS.HOUSE,
  'Washroom': DUA_ASSETS.WASHROOM,
  'Good Etiquettes': DUA_ASSETS.GOOD_ETIQUETTE,
  // Default fallback icon
  'default': DUA_ASSETS.DAILY_ZIKR,
};

interface DuaListProps {
  searchQuery?: string;
}

const DuaList: React.FC<DuaListProps> = ({ searchQuery = '' }) => {
  // Fetch dua categories from API
  const { isLoading, error } = useAllDuas();
  const categories = useDuaCategories();
  const { colors } = useThemeStore();
  const { isCategoryBookmarked } = useDuaStore();
  
  // Create a mapping of category titles to icon paths
  const categoryIconMap: Record<string, string> = {
    'Morning & Evening': DUA_ASSETS.FAJR,
    'Daily Duas': DUA_ASSETS.DAILY_ZIKR,
    'Night Duas': DUA_ASSETS.ISHA,
    'Saved Duas': DUA_ASSETS.BOOKMARK_WHITE,
    'default': DUA_ASSETS.DAILY_ZIKR,
  };

  // Use API data if available, otherwise fallback to hardcoded data
  let duasData: DuaItemProps[] = categories.length > 0 
    ? categories.map(cat => ({
        ...cat,
        bookmarked: isCategoryBookmarked(cat.title), // Check if category has bookmarked duas
        icon: categoryIconMap[cat.title] || categoryIconMap.default, // Map string icon to component
      })) 
    : fallbackDuasData;
    
  // Filter duas based on search query if provided
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    duasData = duasData.filter(dua => 
      dua.title.toLowerCase().includes(query) || 
      dua.description.toLowerCase().includes(query)
    );
  }
  
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={colors.primary.primary500} />
      </View>
    );
  }
  
  if (error) {
    console.error('Error loading duas:', error);
  }
  
  return (
    <FlatList
      data={duasData}
      keyExtractor={item => item.id}
      renderItem={({item}) => <DuaCard item={item} />}
      contentContainerStyle={{paddingBottom: 24, paddingHorizontal: 18}}
      ItemSeparatorComponent={Separator}
    />
  );
};

export default DuaList;

interface DuaItemProps {
  id: string;
  title: string;
  description: string;
  count: number;
  icon?: string;
  bookmarked?: boolean;
  category?: string;
}

const DuaCard = ({item}: {item: DuaItemProps}) => {
  // Determine which icon to use - either from the item or from our mapping
  const iconPath = item.icon || categoryIconMap[item.title] || categoryIconMap.default;
  const navigation = useNavigation<NativeStackNavigationProp<any>>();

  const handlePress = () => {
    navigation.navigate('DuaDetail', {
      title: item.title,
      count: item.count,
      category: item.category || item.title // Pass category for API filtering
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <CdnSvg path={iconPath} width={38} height={38} />
      </View>
      <View style={styles.textWrapper}>
        <Body1Title2Bold numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{item.title}</Body1Title2Bold>
        <Divider height={4} />
        <Body2Medium numberOfLines={2} ellipsizeMode="tail" style={styles.description} color="sub-heading">{item.description}</Body2Medium>
      </View>
      
      <View style={styles.rightContainer}>
        {item.bookmarked && <CdnSvg path={DUA_ASSETS.BOOKMARK_PRIMARY} width={18} height={18} style={styles.bookmark} />}
        <Body2Medium style={styles.count} color="sub-heading">{item.count} Duas</Body2Medium>
      </View>
    </TouchableOpacity>
  );
};

const Separator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  iconContainer: {
    width: 40,
    marginRight: 12,
    alignItems: 'center',
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EDE9FE', // light purple background
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    marginRight: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8, // Primitives/space-2
    minWidth: 70, // Ensure minimum width for the right container
  },
  bookmark: {
    marginRight: 0, // Gap is handled by container
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    flexWrap: 'wrap',
  },
  count: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
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
    minHeight: 200,
  },
});
