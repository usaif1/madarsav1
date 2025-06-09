import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, ActivityIndicator, Share, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Components
import { Body1Title2Bold, Body1Title2Medium, Body1Title2Regular, Body2Medium, H5Medium, Divider } from '@/components';
import { Header } from '@/components';
import { scale, verticalScale } from '@/theme/responsive';
import { CdnSvg } from '@/components/CdnSvg';
import { ColorPrimary, ColorSecondary } from '@/theme/lightColors';
import { useDuasBySubCategory, useAllDuas } from '@/modules/dua/hooks/useDuas';
import { useDuaStore } from '../store/duaStore';
import { useThemeStore } from '@/globalStore';
import FastImage from 'react-native-fast-image';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';

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
  referenceVerse: string;
  bookmarked: boolean;
  category?: string;
  title?: string;
  subCategory?: string;
  subCategoryDesc?: string;
  iconLink?: string;
}

const DuaContent = () => {
  const route = useRoute();
  const navigation = useNavigation<NativeStackNavigationProp<any>>();
  const { title, id, category, subCategory, fromSaved } = route.params as { 
    title: string; 
    id: string; 
    category: string; 
    subCategory: string; 
    fromSaved?: boolean 
  };
  const { colors } = useThemeStore();
  
  // Access the dua store for bookmarking functionality
  const { isDuaSaved, toggleSavedDua } = useDuaStore();
  // Fetch all duas to ensure the store is populated
  const { isLoading: isLoadingAllDuas } = useAllDuas();
  
  // Get duas for this subcategory
  const duasInSubCategory = useDuasBySubCategory(category, subCategory);
  
  // If no duas found, use fallback data
  let duasData = duasInSubCategory.length > 0 ? duasInSubCategory : fallbackDuas;
  
  // If coming from SavedDuas flow, filter to only show bookmarked duas
  if (fromSaved) {
    duasData = duasData.filter(dua => isDuaSaved(typeof dua.id === 'string' ? parseInt(dua.id) : dua.id));
  }
  
  // Add bookmarked status to each dua
  const duas = duasData.map(dua => ({
    ...dua,
    bookmarked: isDuaSaved(typeof dua.id === 'string' ? parseInt(dua.id) : Number(dua.id))
  })) as DuaProps[];

  const toggleBookmark = (id: string | number, duaCategory: string) => {
    const numericId = typeof id === 'string' ? parseInt(id) : id;
    toggleSavedDua(numericId, duaCategory, subCategory);
  };
  
  // Share functionality
  const handleShare = async (dua: DuaProps) => {
    try {
      // App store links
      const appStoreLink = 'https://apps.apple.com/app/madarsaapp';
      const playStoreLink = 'https://play.google.com/store/apps/details?id=com.madarsaapp';
      
      // Format the message with app links first, then dua content
      const shareMessage = 
        `Download Madarsa App for more duas and Islamic content:\n` +
        `App Store: ${appStoreLink}\n` +
        `Play Store: ${playStoreLink}\n\n` +
        `--- DUA ---\n\n` +
        `${dua.arabic}\n\n` +
        `${dua.transliteration}\n\n` +
        `${dua.translation}\n\n` +
        `Reference: ${dua.reference}\n\n` +
        `Read more duas on the Madarsa App`;
      
      await Share.share({
        message: shareMessage,
        title: 'Share Dua from Madarsa App',
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
          <CdnSvg 
            path={DUA_ASSETS.BUBBLE}
            width={scale(26)}
            height={scale(26)}
          />
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
        <Body1Title2Bold style={styles.translationTitle}>Translation</Body1Title2Bold>
        <Body1Title2Medium style={styles.translationText}>
          {item.translation}
        </Body1Title2Medium>
      </View>
      
      {/* Footer with reference and actions */}
      <View style={styles.footerContainer}>
        <View style={styles.referenceContainer}>
          <Body1Title2Regular style={styles.referenceText}>{item.reference}</Body1Title2Regular>
          <View style={styles.dot}></View>
          <Body1Title2Regular style={styles.referenceText}>{item.referenceVerse}</Body1Title2Regular>
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => toggleBookmark(item.id, item.category || category)}
          >
            <CdnSvg 
              path={item.bookmarked ? DUA_ASSETS.BOOKMARK_PRIMARY : DUA_ASSETS.BOOKMARK}
              width={scale(24)}
              height={scale(24)}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleShare(item)}
          >
            <CdnSvg 
              path={DUA_ASSETS.SHARE_ALT}
              width={scale(24)}
              height={scale(24)}
            />
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
      <View style={styles.headerContainer}>
            <FastImage 
                source={{ uri: getCdnUrl(DUA_ASSETS.DUA_AYAH) }} 
                style={styles.headerImage}
                resizeMode={FastImage.resizeMode.contain}
            />
        </View>
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
    backgroundColor: '#FAFAFA',
  },
  listContainer: {
  },
  referenceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: scale(6),
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: '#D4D4D4',
    borderRadius: 5,
  },
  duaContainer: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F3F4F6',
    padding: 16,
    paddingHorizontal: 24,
    rowGap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerContainer: {
    width: scale(375),
    height: verticalScale(121),
    alignItems: 'center',
    justifyContent: 'center',
},
headerImage: {
    width: '100%',
    height: '100%',
},
  arabicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  arabicText: {
    flex: 1,
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'right',
    color: '#171717',
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
    left: '55%',
    transform: [{ translateX: -6 }, { translateY: -9 }],
    color: ColorPrimary.primary600,
    fontSize: 12,
  },
  transliterationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purpleLine: {
    width: 3,
    height: '100%',
    backgroundColor: '#8A57DC',
    marginRight: 8,
    borderRadius: 2,
  },
  transliterationText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 20,
    color: '#525252',
  },
  translationContainer: {
  },
  translationTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0A0A0A',
  },
  translationText: {
    fontSize: 12,
    lineHeight: 20,
    color: '#404040',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
