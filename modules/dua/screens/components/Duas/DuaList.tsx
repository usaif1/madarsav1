import {FlatList, StyleSheet, View, TouchableOpacity, ActivityIndicator} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SvgProps } from 'react-native-svg';
import { FC } from 'react';

// assets
import DailyZikr from '@/assets/duas/daily_zikr.svg';
import FoodAndDrink from '@/assets/duas/food_&_drink.svg';
import GoodEtiquette from '@/assets/duas/good_etiquette.svg';
import PraisingAllah from '@/assets/duas/praising_allah.svg';
import Washroom from '@/assets/duas/washroom.svg';
import House from '@/assets/duas/house.svg';
import BookmarkPrimary from '@/assets/duas/bookmark-primary.svg';
import DuaIcon from '@/assets/duas/daily_zikr.svg';
import MorningIcon from '@/assets/home/fajr.svg';
import NightIcon from '@/assets/calendar/isha.svg';
import BookmarkIcon from '@/assets/duas/bookmark-white.svg';
import ArrowRight from '@/assets/duas/arrow-right.svg';
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
    icon: MorningIcon,
  },
  {
    id: '2',
    title: 'Daily Duas',
    description: 'Duas for daily activities',
    count: 24,
    icon: DuaIcon,
  },
  {
    id: '3',
    title: 'Night Duas',
    description: 'Duas for the night',
    count: 8,
    icon: NightIcon,
    bookmarked: true,
  },
  {
    id: '4',
    title: 'Saved Duas',
    description: 'Your saved duas',
    count: 5,
    icon: BookmarkIcon,
  },
];

// Icon mapping for categories
const categoryIconMap: Record<string, any> = {
  'Daily Zikr': DailyZikr,
  'Praising Allah': PraisingAllah,
  'Food and Drinks': FoodAndDrink,
  'House': House,
  'Washroom': Washroom,
  'Good Etiquettes': GoodEtiquette,
  // Default fallback icon
  'default': DailyZikr,
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
  
  // Create a mapping of category titles to icon components
  const categoryIconMap: Record<string, FC<SvgProps>> = {
    'Morning & Evening': MorningIcon,
    'Daily Duas': DuaIcon,
    'Night Duas': NightIcon,
    'Saved Duas': BookmarkIcon,
    'default': DuaIcon,
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
  icon?: FC<SvgProps>;
  bookmarked?: boolean;
  category?: string;
}

const DuaCard = ({item}: {item: DuaItemProps}) => {
  // Determine which icon to use - either from the item or from our mapping
  const IconComponent = item.icon || categoryIconMap[item.title] || categoryIconMap.default;
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
        <IconComponent width={38} height={38} />
      </View>
      <View style={styles.textWrapper}>
        <Body1Title2Bold numberOfLines={1} ellipsizeMode="tail" style={styles.title}>{item.title}</Body1Title2Bold>
        <Divider height={4} />
        <Body2Medium numberOfLines={2} ellipsizeMode="tail" style={styles.description} color="sub-heading">{item.description}</Body2Medium>
      </View>
      
      <View style={styles.rightContainer}>
        {item.bookmarked && <BookmarkPrimary width={18} height={18} style={styles.bookmark} />}
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
