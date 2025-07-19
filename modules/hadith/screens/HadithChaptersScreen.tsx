// modules/hadith/screens/HadithChaptersScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, useWindowDimensions } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { useHadithStore } from '../store/hadithStore';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Medium, Body1Title2Regular } from '@/components/Typography/Typography';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import HadithImageFooter from '../components/HadithImageFooter';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorMessage from '@/components/ErrorMessage';
import RenderHtml from 'react-native-render-html';
import { useHadithChaptersWithPagination } from '../hooks/useHadithChaptersWithPagination';
// Import only what we need from the service

// Define interfaces for the new API response structure
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
      <View style={styles.chapterArabicContainer}><Body1Title2Medium color="yellow-800" style={styles.chapterArabic}>
        {arabicContent?.chapterTitle || ''} 
      </Body1Title2Medium><Body1Title2Medium color="yellow-800">({chapter?.hadithNumber})</Body1Title2Medium></View>
    </LinearGradient>
  );
};

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

const ChapterSection = ({ chapter }: { chapter: HadithChapter }) => {
  return (
    <View style={styles.chapterSection}>
      <ChapterHeader chapter={chapter} />
      <HadithItem chapter={chapter} />
    </View>
  );
};

const HadithChaptersScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { hadithId, chapterId } = route.params as {
    hadithId: string;
    chapterId: string;
    chapterTitle?: string
  };
  
  // Use our custom hook for pagination
  const {
    data: chapters,
    isLoading,
    error,
    loadMore,
    hasMore,
    refetch
  } = useHadithChaptersWithPagination(hadithId, chapterId, 10);
  
  // Log API response for debugging
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      console.log('Hadith Chapters API Response:', chapters);
    }
    if (error) {
      console.error('Hadith Chapters API Error:', error);
    }
  }, [chapters, error]);
  
  // Handle end reached for infinite scroll
  const handleEndReached = () => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  };
  
  // Show loading state
  if (isLoading && chapters.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
       <View style={styles.headerContainer}>
                       <TouchableOpacity style={styles.headerButtonLeft} onPress={() => navigation.goBack()}>
                         <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_LEFT} width={80} height={80} />
                       </TouchableOpacity>
                       <View style={styles.headerCenter}>
                         <CdnSvg path={DUA_ASSETS.HADITH_BISMILLAH} width={200} height={40} />
                       </View>
                       <TouchableOpacity style={styles.headerButtonRight}>
                         <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_RIGHT} width={80} height={80} />
                       </TouchableOpacity>
                     </View>
        <LoadingIndicator color={colors.primary.primary500} />
      </SafeAreaView>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
                        <TouchableOpacity style={styles.headerButtonLeft} onPress={() => navigation.goBack()}>
                          <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_LEFT} width={80} height={80} />
                        </TouchableOpacity>
                        <View style={styles.headerCenter}>
                          <CdnSvg path={DUA_ASSETS.HADITH_BISMILLAH} width={200} height={40} />
                        </View>
                        <TouchableOpacity style={styles.headerButtonRight}>
                          <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_RIGHT} width={80} height={80} />
                        </TouchableOpacity>
                      </View>
        <ErrorMessage 
          message={error.toString() || 'Failed to load hadith chapters'} 
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
                      <TouchableOpacity style={styles.headerButtonLeft} onPress={() => navigation.goBack()}>
                        <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_LEFT} width={80} height={80} />
                      </TouchableOpacity>
                      <View style={styles.headerCenter}>
                        <CdnSvg path={DUA_ASSETS.HADITH_BISMILLAH} width={200} height={40} />
                      </View>
                      <TouchableOpacity style={styles.headerButtonRight}>
                        <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_RIGHT} width={80} height={80} />
                      </TouchableOpacity>
                    </View>
      
      {chapters && chapters.length > 0 ? (
        <FlatList
          data={chapters}
          keyExtractor={item => item.hadithNumber}
          renderItem={({ item }) => <ChapterSection chapter={item} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            <>
              {isLoading && chapters.length > 0 && (
                <View style={styles.loadingFooter}>
                  <LoadingIndicator size="small" color={colors.primary.primary500} />
                </View>
              )}
              <HadithImageFooter />
            </>
          }
        />
      ) : (
        <View style={styles.noContentContainer}>
          <Body1Title2Medium>No chapters found</Body1Title2Medium>
          <HadithImageFooter />
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
  headerCenter: {
    width: scale(200),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingBottom: verticalScale(32),
  },
  noContentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: scale(20),
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
  loadingFooter: {
    paddingVertical: verticalScale(16),
    alignItems: 'center',
  },
  headerButtonLeft: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(-32),
  },
  headerButtonRight: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(-32),
  },
});

export default HadithChaptersScreen;