import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator, Share } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import { Body1Title2Bold, Body1Title2Medium, Body1Title2Regular, Body2Medium, H5Medium, Divider } from '@/components';
import { Header } from '@/components';
import { scale, verticalScale } from '@/theme/responsive';
import Bookmark from '@/assets/hadith/bookmark.svg';
import BookmarkFilled from '@/assets/duas/bookmark-primary.svg';
import ShareAlt from '@/assets/hadith/share_alt.svg';
import Bubble from '@/assets/tasbih/bubble.svg';
import { ColorPrimary, ColorSecondary } from '@/theme/lightColors';
import { useDuasBySubCategory, useAllDuas } from '@/modules/dua/hooks/useDuas';
import { useDuaStore } from '../store/duaStore';
import { useThemeStore } from '@/globalStore';

// Fallback data for duas
const fallbackDuas = [
  {
    id: '1',
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
    transliteration: "Allaahumma innee as'aluka ilman naafi'an, wa rizqan tayyiban, wa amalan mutaqabbalan",
    translation: "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
    reference: "Ibn Majah • 925",
    bookmarked: false
  },
  {
    id: '2',
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ وَأَعُوذُ بِكَ مِنَ النَّارِ",
    transliteration: "Allaahummaa innee as'alukal-jannata wa a'oothu bika minan-naar",
    translation: "O Allah, I ask You for Paradise and seek Your protection from the Fire.",
    reference: "Abu Dawud • 792",
    bookmarked: true
  },
  {
    id: '3',
    arabic: "سُبْحَانَ اللَّهِ ، وَالْحَمْدُ للَّهِ ، وَاللَّهُ أَكْبَرُ",
    transliteration: "Subhaanallaahi, Walhamdu lillaahi, Wallaahu Akbar",
    translation: "Glory is to Allah, praise is to Allah, Allah is the Most Great!",
    reference: "Muslim 4 • 2091",
    bookmarked: false
  },
  {
    id: '4',
    arabic: "لاَ إِلَهَ إِلاَّ أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    transliteration: "Laa ilaaha illaa Anta subhaanaka innee kuntu minadh-dhaalimeen",
    translation: "There is none worthy of worship but You, glory is to You. Surely, I was among the wrongdoers.",
    reference: "Surah Al-Anbiya • 87",
    bookmarked: false
  }
];

interface DuaProps {
  id: string | number;
  arabic: string;
  transliteration: string;
  translation: string;
  reference: string;
  bookmarked: boolean;
}

const DuaContent = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { title, category, subCategory } = route.params as { title: string; id: string; category: string; subCategory: string };
  const { colors } = useThemeStore();
  
  // Access the dua store for bookmarking functionality
  const { toggleSavedDua, isDuaSaved } = useDuaStore();
  
  // Fetch all duas to ensure the store is populated
  const { isLoading: isLoadingAllDuas } = useAllDuas();
  
  // Get duas for the specific subcategory
  const duasFromAPI = useDuasBySubCategory(category, subCategory);
  
  // Use API data if available, otherwise fallback to hardcoded data
  const duas = duasFromAPI.length > 0 ? duasFromAPI : fallbackDuas;

  const toggleBookmark = (id: string | number) => {
    if (typeof id === 'number') {
      toggleSavedDua(id);
    }
  };
  
  // Share functionality
  const handleShare = async (dua: DuaProps) => {
    try {
      await Share.share({
        message: `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\nReference: ${dua.reference}`,
        title: 'Share Dua',
      });
    } catch (error) {
      console.error('Error sharing dua:', error);
    }
  };

  const renderDuaItem = ({ item, index }: { item: DuaProps; index: number }) => (
    <View style={styles.duaContainer}>
      {/* Arabic text with bubble number */}
      <View style={styles.arabicRow}>
        <H5Medium color='heading' style={styles.arabicText}>
          {item.arabic}
        </H5Medium>
        <View style={styles.bubbleWrap}>
          <Bubble width={scale(26)} height={scale(26)} />
          <Body1Title2Bold style={styles.bubbleNum}>
            {index + 1}
          </Body1Title2Bold>
        </View>
      </View>
      
      {/* Transliteration with purple line */}
      <View style={styles.transliterationContainer}>
        <View style={styles.purpleLine} />
        <Body2Medium style={styles.transliterationText}>
          {item.transliteration}
        </Body2Medium>
      </View>
      
      {/* Translation section */}
      <View style={styles.translationContainer}>
        <Body1Title2Medium style={styles.translationTitle}>Translation</Body1Title2Medium>
        <Body1Title2Regular style={styles.translationText}>
          {item.translation}
        </Body1Title2Regular>
      </View>
      
      {/* Footer with reference and actions */}
      <View style={styles.footerContainer}>
        <Body1Title2Regular style={styles.referenceText}>{item.reference}</Body1Title2Regular>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleBookmark(item.id)}
          >
            {item.bookmarked ? <BookmarkFilled /> : <Bookmark />}
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleShare(item)}
          >
            <ShareAlt />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderSeparator = () => <Divider height={16} />;

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
        data={duas}
        renderItem={renderDuaItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={renderSeparator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  listContainer: {
    padding: 16,
  },
  duaContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  arabicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  arabicText: {
    flex: 1,
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'right',
  },
  bubbleWrap: {
    position: 'relative',
    width: scale(26),
    height: scale(26),
    marginLeft: 12,
  },
  bubbleNum: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -6 }, { translateY: -9 }],
    color: ColorPrimary.primary600,
    fontSize: 12,
  },
  transliterationContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  purpleLine: {
    width: 3,
    height: '100%',
    backgroundColor: ColorPrimary.primary500,
    marginRight: 8,
    borderRadius: 2,
  },
  transliterationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  translationContainer: {
    marginBottom: 16,
  },
  translationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  translationText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4B5563',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  referenceText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DuaContent;
