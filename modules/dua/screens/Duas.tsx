// dependencies
import {StatusBar, StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';

// components
import {DuaSearchbar} from './components/Duas';
import {Body1Title2Bold, Body2Medium, Divider} from '@/components';
import { CdnSvg } from '@/components/CdnSvg';
import { useAllDuas, useDuaCategories, useDuaSubCategories } from '../hooks/useDuas';
import { useThemeStore } from '@/globalStore';
import { useDuaStore } from '../store/duaStore';
import HadithImageFooter from '@/modules/hadith/components/HadithImageFooter';

// Icon mapping for categories
const categoryIconMap: Record<string, string> = {
  'Morning Azkar': DUA_ASSETS.FAJR,
  'Evening Azkar': DUA_ASSETS.ISHA,
  'Daily Zikr': DUA_ASSETS.DAILY_ZIKR,
  'Mosque Duas': DUA_ASSETS.PRAISING_ALLAH,
  'Home': DUA_ASSETS.HOUSE,
  'Ramadan': DUA_ASSETS.GOOD_ETIQUETTE,
  'Food and Drinks': DUA_ASSETS.FOOD_DRINK,
  'Washroom': DUA_ASSETS.WASHROOM,
  // Default fallback icon
  'default': DUA_ASSETS.DAILY_ZIKR,
};

interface DuaSubCategoryItemProps {
  id: string;
  title: string;
  count: number;
  bookmarked?: boolean;
  category: string;
}

const CategorySection = ({ category, searchQuery }: { category: any, searchQuery: string }) => {
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { isDuaSaved, isSubCategoryBookmarked } = useDuaStore();
  
  // Get subcategories for this category
  const subCategories = useDuaSubCategories(category.title);
  
  // Filter subcategories based on search query if provided
  let filteredSubCategories = subCategories;
  if (searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim();
    filteredSubCategories = subCategories.filter(subCat => 
      subCat.title.toLowerCase().includes(query) || 
      subCat.description.toLowerCase().includes(query)
    );
  }
  
  // Convert to the format needed for rendering
  const subcategoriesData: DuaSubCategoryItemProps[] = filteredSubCategories.map(subCat => ({
    id: subCat.id,
    title: subCat.title,
    count: subCat.count,
    bookmarked: isSubCategoryBookmarked(subCat.title),
    category: category.title
  }));

  const handleSubCategoryPress = (item: DuaSubCategoryItemProps) => {
    navigation.navigate('DuaContent', {
      title: item.title,
      count: item.count,
      id: item.id,
      category: item.category,
      subCategory: item.title,
    });
  };
  
  // Don't render if no subcategories match the search
  if (searchQuery.trim() !== '' && filteredSubCategories.length === 0) {
    return null;
  }

  return (
    <View>
      {/* Category Header */}
      {/* Header Image */}
      {category?.id >0 && category?.id < 3 && (<View style={styles.footerContainer}>
          <FastImage 
            source={{ uri: getCdnUrl(DUA_ASSETS.DUA_AYAH) }}
            style={styles.footerImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>)}
      <View style={styles.sectionHeader}>
        <Body1Title2Bold color="primary">{category.title}</Body1Title2Bold>
        <CdnSvg
          path={DUA_ASSETS.MANDALA_DUA}
          width={scale(100)}
          height={scale(100)}
          style={styles.leftMandala}
        />
        <CdnSvg
          path={DUA_ASSETS.MANDALA_DUA}
          width={scale(100)}
          height={scale(100)}
          style={styles.rightMandala}
        />
      </View>
      
      {/* Subcategories List */}
      <View style={styles.subcategoriesContainer}>
        {subcategoriesData.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.subcategoryCard} 
            onPress={() => handleSubCategoryPress(item)}
          >
            <View style={styles.iconContainer}>
              <CdnSvg 
                path={categoryIconMap[item.category] || categoryIconMap.default} 
                width={38} 
                height={38} 
              />
            </View>
            <View style={styles.textWrapper}>
              <Body1Title2Bold numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
                {item.title}
              </Body1Title2Bold>
              <Divider height={4} />
              <Body2Medium numberOfLines={2} ellipsizeMode="tail" style={styles.description} color="sub-heading">
                Duas for {item.title}
              </Body2Medium>
            </View>
            
            <View style={styles.rightContainer}>
              {item.bookmarked && (
                <CdnSvg 
                  path={DUA_ASSETS.BOOKMARK_PRIMARY} 
                  width={18} 
                  height={18} 
                  style={styles.bookmark} 
                />
              )}
              <Body2Medium style={styles.count} color="sub-heading">
                {item.count} Duas
              </Body2Medium>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Separator between categories */}
      <Divider height={20} />
    </View>
  );
};

const Duas = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { colors } = useThemeStore();
  
  // Fetch all duas and categories
  const { isLoading } = useAllDuas();
  const categories = useDuaCategories();

  const handleSavedPress = () => {
    navigation.navigate('SavedDuas');
  };
  
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle={'light-content'} />
        <View style={styles.searchContainer}>
          <DuaSearchbar onSearchChange={handleSearchChange} />
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary.primary500} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'light-content'} />
      <View style={styles.searchContainer}>
        <DuaSearchbar onSearchChange={handleSearchChange} />
      </View>
      <Divider height={10} />
      
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        
        
        {/* Render each category as a section */}
        {categories.map((category, index) => (
          <CategorySection 
            key={category.id} 
            category={category} 
            searchQuery={searchQuery}
          />
        ))}
        
        {/* Bottom Footer Image */}
        <HadithImageFooter />
      </ScrollView>

      {/* Floating Saved Button */}
      <TouchableOpacity 
        style={styles.savedButton} 
        onPress={handleSavedPress}
        activeOpacity={0.8}
        accessibilityLabel="View saved duas"
        accessibilityRole="button"
      >
        <CdnSvg 
          path={DUA_ASSETS.BOOKMARK_WHITE}
          width={scale(16)}
          height={scale(16)}
        />
        <Body1Title2Bold color="white" style={{marginLeft: 8}}>Saved</Body1Title2Bold>
      </TouchableOpacity>
    </View>
  );
};

export default Duas;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    paddingTop: 10,
  },
  searchContainer: {
    paddingHorizontal: 18,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#F9F6FF',
    paddingVertical: 5,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  leftMandala: {
    position: 'absolute',
    left: 0,
    zIndex: 99,
    top: 0,
    transform: [{translateY: -56}],
  },
  rightMandala: {
    position: 'absolute',
    right: 0,
    zIndex: 99,
    top: 0,
    transform: [{scaleX: -1}, {translateY: -56}],
  },
  subcategoriesContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
  },
  subcategoryCard: {
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
  textWrapper: {
    flex: 1,
    marginRight: 8,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    minWidth: 70,
  },
  bookmark: {
    marginRight: 0,
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
  footerContainer: {
    width: scale(375),
    height: verticalScale(121),
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerImage: {
    width: '100%',
    height: '100%',
  },
  savedButton: {
    position: 'absolute',
    bottom: 40,
    right: 16,
    width: scale(89),
    height: verticalScale(40),
    borderRadius: 60,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#171717',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});