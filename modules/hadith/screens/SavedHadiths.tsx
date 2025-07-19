import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, Text, useWindowDimensions, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { useHadithStore } from '../store/hadithStore';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import { CdnSvg } from '@/components/CdnSvg';
import { Body1Title2Medium, Body1Title2Regular } from '@/components/Typography/Typography';
import LinearGradient from 'react-native-linear-gradient';
import RenderHtml from 'react-native-render-html';

// Define interfaces for the hadith data
interface HadithContent {
  lang: string;
  chapterNumber: string;
  chapterTitle: string;
  urn: number;
  body: string;
  grades: {
    graded_by: string | null;
    grade: string;
  }[];
}

interface HadithChapter {
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  hadith: HadithContent[];
}

// Chapter Header Component
const ChapterHeader = ({ chapter }: { chapter: HadithChapter }) => {
  // Find English and Arabic content
  const englishContent = chapter.hadith.find(h => h.lang === 'en');
  const arabicContent = chapter.hadith.find(h => h.lang === 'ar');
  
  return (
    <LinearGradient
      colors={['#FEFAEC', '#FCEFC7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.chapterHeader}
    >
      <Body1Title2Medium color="yellow-800" style={styles.chapterNumber}>
        ({chapter.hadithNumber}) Chapter: {englishContent?.chapterTitle || ''}
      </Body1Title2Medium>
      <View style={styles.dividerContainer}>
        <CdnSvg path={DUA_ASSETS.HADITH_DASHED_LINE} width={scale(300)} height={1} />
      </View>
      <View style={styles.chapterArabicContainer}>
        <Body1Title2Medium color="yellow-800" style={styles.chapterArabic}>
          {arabicContent?.chapterTitle || ''} 
        </Body1Title2Medium>
        <Body1Title2Medium color="yellow-800">({chapter?.hadithNumber})</Body1Title2Medium>
      </View>
    </LinearGradient>
  );
};

// Hadith Item Component
const HadithItem = ({ chapter }: { chapter: HadithChapter }) => {
  const { width } = useWindowDimensions();
  const { isHadithSaved, toggleSavedHadith } = useHadithStore();
  const [isSaved, setIsSaved] = useState(isHadithSaved(chapter.hadithNumber, chapter.collection));
  
  // Find English and Arabic content
  const englishContent = chapter.hadith.find(h => h.lang === 'en');
  const arabicContent = chapter.hadith.find(h => h.lang === 'ar');
  
  const handleBookmarkPress = () => {
    toggleSavedHadith(chapter);
    setIsSaved(!isSaved);
  };
  
  return (
    <View style={styles.hadithContainer}>
      {/* Arabic Content */}
      <View style={styles.arabicContainer}>
        {arabicContent?.body && (
          <RenderHtml
            contentWidth={width - scale(36)} // Adjust for padding
            source={{ html: arabicContent.body }}
            tagsStyles={{
              p: {
                fontSize: scale(18),
                lineHeight: scale(28),
                color: '#171717',
                textAlign: 'right',
                fontWeight: '500',
              }
            }}
          />
        )}
      </View>
      
      {/* English Content */}
      <View style={styles.narratorContainer}>
        {englishContent?.body && (
          <RenderHtml
            contentWidth={width - scale(40)} // Adjust for padding
            source={{ html: englishContent.body }}
            tagsStyles={{
              p: {
                fontSize: scale(14),
                lineHeight: scale(20),
                color: '#525252',
              }
            }}
          />
        )}
      </View>
      
      {/* Footer with reference and actions */}
      <View style={styles.footerContainer}>
        <Body1Title2Regular style={styles.referenceText}>
          {chapter.collection} <View style={styles.dot}></View> {chapter.bookNumber}:{chapter.hadithNumber}
        </Body1Title2Regular>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleBookmarkPress}>
            <CdnSvg 
              path={isSaved ? DUA_ASSETS.QURAN_BOOKMARK_FILL_ICON : DUA_ASSETS.HADITH_BOOKMARK} 
              width={24} 
              height={24} 
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <CdnSvg path={DUA_ASSETS.HADITH_SHARE} width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Chapter Section Component
const ChapterSection = ({ chapter }: { chapter: HadithChapter }) => {
  return (
    <View style={styles.chapterSection}>
      <ChapterHeader chapter={chapter} />
      <HadithItem chapter={chapter} />
    </View>
  );
};

// Main SavedHadiths Component
const SavedHadiths = () => {
  const navigation = useNavigation();
  const { getAllSavedHadiths } = useHadithStore();
  
  // Get all saved hadiths
  const savedHadiths = getAllSavedHadiths();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
       <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
                  <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_LEFT} width={24} height={24} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                  <CdnSvg path={DUA_ASSETS.HADITH_BISMILLAH} width={200} height={40} />
                </View>
                <TouchableOpacity style={styles.headerButton}>
                  <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_RIGHT} width={24} height={24} />
                </TouchableOpacity>
              </View>
      
      {savedHadiths.length > 0 ? (
        <FlatList
          data={savedHadiths}
          keyExtractor={item => `${item.collection}_${item.hadithNumber}`}
          renderItem={({ item }) => <ChapterSection chapter={item} />}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved hadiths yet</Text>
          <Text style={styles.emptySubtext}>Bookmark hadiths to see them here</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingBottom: verticalScale(32),
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
  chapterSection: {
    width: scale(375),
    paddingTop: scale(16),
    paddingBottom: scale(16),
    rowGap: scale(16),
  },
  chapterHeader: {
    width: scale(343),
    minHeight: verticalScale(138),
    padding: scale(16),
    paddingHorizontal: scale(24),
    borderRadius: scale(8),
    alignSelf: 'center',
    rowGap: scale(10),
    alignItems: 'center',
  },
  chapterNumber: {
    fontSize: scale(14),
    textAlign: 'center',
  },
  chapterArabic: {
    fontSize: scale(16),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chapterArabicContainer: {
    flexDirection: 'row',
  },
  dividerContainer: {
    alignItems: 'center',
    paddingVertical: scale(8),
    width: scale(295),
  },
  hadithContainer: {
    width: scale(375),
  },
  arabicContainer: {
    width: scale(375),
    padding: scale(18),
    paddingHorizontal: scale(18),
    rowGap: scale(6),
  },
  narratorContainer: {
    width: scale(375),
    padding: scale(20),
    rowGap: scale(16),
  },
  footerContainer: {
    width: scale(375),
    height: verticalScale(22),
    paddingHorizontal: scale(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceText: {
    fontSize: scale(14),
    color: '#404040',
  },
  actionsContainer: {
    flexDirection: 'row',
    width: scale(56),
    columnGap: scale(12),
  },
  actionButton: {
    width: scale(24),
    height: scale(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 5,
    height: 5,
    backgroundColor: '#D4D4D4',
    borderRadius: 5,
  },
  headerContainer: {
    width: scale(375),
    height: verticalScale(66),
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFDF6',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    flexDirection: 'row',
  },
  headerButton: {
    width: scale(76.15),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    width: scale(200),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SavedHadiths;