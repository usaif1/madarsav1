// modules/hadith/screens/HadithChaptersScreen.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
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

// ==================== INTERFACES ====================

/**
 * Interface for hadith content structure from API response
 */
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

/**
 * Interface for hadith chapter structure from API response
 */
interface HadithChapter {
  collection: string;
  bookNumber: string;
  chapterId: string;
  hadithNumber: string;
  hadith: HadithContent[];
}

/**
 * Interface for navigation route parameters
 */
interface RouteParams {
  hadithId: string;
  chapterId: string;
  chapterTitle?: string;
}

/**
 * Interface for component props
 */
interface ChapterHeaderProps {
  chapter: HadithChapter;
}

interface HadithItemProps {
  chapter: HadithChapter;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Utility function to clean Arabic HTML content by removing scholarly markup
 * Removes [prematn], [narrator], [matn] and other annotation tags
 * Preserves ALL Arabic text content while removing only English markup
 * @param htmlContent - Raw HTML string with scholarly markup
 * @returns Cleaned HTML string suitable for display
 */
const cleanArabicHtmlContent = (htmlContent: string): string => {
  if (!htmlContent || typeof htmlContent !== 'string') {
    return '';
  }

  try {
    let cleanedContent = htmlContent;

    // Remove scholarly annotation tags (English markup only)
    // [prematn] and [/prematn] - pre-matn (chain of narration)
    cleanedContent = cleanedContent.replace(/\[prematn\]/g, '');
    cleanedContent = cleanedContent.replace(/\[\/prematn\]/g, '');

    // [matn] and [/matn] - matn (actual hadith text)
    cleanedContent = cleanedContent.replace(/\[matn\]/g, '');
    cleanedContent = cleanedContent.replace(/\[\/matn\]/g, '');

    // [narrator id="..." tooltip="..."] and [/narrator] - narrator metadata
    // This removes the English attributes but keeps the Arabic narrator names
    cleanedContent = cleanedContent.replace(/\[narrator[^\]]*\]/g, '');
    cleanedContent = cleanedContent.replace(/\[\/narrator\]/g, '');

    // Remove any other custom annotation tags that might exist
    cleanedContent = cleanedContent.replace(/\[[^\]]*\]/g, '');

    // Clean up multiple spaces and normalize whitespace
    cleanedContent = cleanedContent.replace(/\s+/g, ' ').trim();

    return cleanedContent;
  } catch (error) {
    console.error('Error cleaning Arabic HTML content:', error);
    // Return original content if cleaning fails for graceful degradation
    return htmlContent;
  }
};

/**
 * Custom hook to process hadith content and clean markup
 * @param content - HadithContent object
 * @returns Processed content with cleaned HTML
 */
const useProcessedHadithContent = (content: HadithContent | undefined) => {
  return useMemo(() => {
    if (!content?.body) {
      return {
        cleanedBody: '',
        hasContent: false
      };
    }

    const cleanedBody = cleanArabicHtmlContent(content.body);
    
    return {
      cleanedBody,
      hasContent: Boolean(cleanedBody.trim())
    };
  }, [content?.body]);
};

// ==================== COMPONENTS ====================

/**
 * Component to render chapter header with English and Arabic titles
 * Uses RenderHtml for Arabic content to handle HTML markup properly
 */
const ChapterHeader: React.FC<ChapterHeaderProps> = ({ chapter }) => {
  const { width } = useWindowDimensions();
  
  // Extract English and Arabic content safely with memoization
  const englishContent = useMemo(() => 
    chapter.hadith.find(h => h.lang === 'en'), 
    [chapter.hadith]
  );
  
  const arabicContent = useMemo(() => 
    chapter.hadith.find(h => h.lang === 'ar'), 
    [chapter.hadith]
  );

  // Process Arabic chapter title to remove markup if present
  const { cleanedBody: cleanedArabicTitle, hasContent: hasArabicTitle } = 
    useProcessedHadithContent({ ...arabicContent, body: arabicContent?.chapterTitle || '' } as HadithContent);
  
  return (
    <LinearGradient
      colors={['#FEFAEC', '#FCEFC7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.chapterHeader}
    >
      {/* English Chapter Title */}
      <Body1Title2Medium color="yellow-800" style={styles.chapterNumber}>
        ({chapter.hadithNumber}) Chapter: {englishContent?.chapterTitle || ''}
      </Body1Title2Medium>
      
      {/* Decorative Divider */}
      <View style={styles.dividerContainer}>
        <CdnSvg path={DUA_ASSETS.HADITH_DASHED_LINE} width={scale(300)} height={1} />
      </View>
      
      {/* Arabic Chapter Title using RenderHtml */}
      <View style={styles.chapterArabicContainer}>
        {hasArabicTitle ? (
          <RenderHtml
            contentWidth={width - scale(80)}
            source={{ html: `<p>${cleanedArabicTitle}</p>` }}
            tagsStyles={{
              p: {
                fontSize: scale(16),
                fontWeight: 'bold',
                textAlign: 'center',
                color: '#6D591D', // yellow-800 equivalent
                margin: 0,
              }
            }}
          />
        ) : (
          <Body1Title2Medium color="yellow-800" style={styles.chapterArabic}>
            {arabicContent?.chapterTitle || ''} 
          </Body1Title2Medium>
        )}
        
        <Body1Title2Medium color="yellow-800">
          ({chapter?.hadithNumber})
        </Body1Title2Medium>
      </View>
    </LinearGradient>
  );
};

/**
 * Component to render individual hadith item with cleaned content
 * Simple implementation without fancy features - just cleans markup and displays text
 */
const HadithItem: React.FC<HadithItemProps> = ({ chapter }) => {
  const { width } = useWindowDimensions();
  const { isHadithSaved, toggleSavedHadith } = useHadithStore();
  
  // Track bookmark state with proper error handling
  const [isSaved, setIsSaved] = useState(() => {
    try {
      return isHadithSaved(chapter.hadithNumber, chapter.collection);
    } catch (error) {
      console.error('Error checking saved hadith status:', error);
      return false;
    }
  });
  
  // Extract and process content with memoization
  const englishContent = useMemo(() => 
    chapter.hadith.find(h => h.lang === 'en'), 
    [chapter.hadith]
  );
  
  const arabicContent = useMemo(() => 
    chapter.hadith.find(h => h.lang === 'ar'), 
    [chapter.hadith]
  );
  
  // Process Arabic content to remove markup - keeps ALL Arabic text
  const { cleanedBody: cleanedArabicBody, hasContent: hasArabicContent } = 
    useProcessedHadithContent(arabicContent);
  
  // Handle bookmark toggle with error handling
  const handleBookmarkPress = useCallback(() => {
    try {
      toggleSavedHadith(chapter);
      setIsSaved(prevState => !prevState);
    } catch (error) {
      console.error('Error toggling hadith bookmark:', error);
      // Could show a toast or error message here if needed
    }
  }, [chapter, toggleSavedHadith]);
  
  return (
    <View style={styles.hadithContainer}>
      {/* Arabic Content with cleaned markup - preserves all Arabic text */}
      {hasArabicContent && (
        <View style={styles.arabicContainer}>
          <RenderHtml
            contentWidth={width - scale(36)}
            source={{ html: cleanedArabicBody }}
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
        </View>
      )}
      
      {/* English Content */}
      {englishContent?.body && (
        <View style={styles.narratorContainer}>
          <RenderHtml
            contentWidth={width - scale(40)}
            source={{ html: englishContent.body }}
            tagsStyles={{
              p: {
                fontSize: scale(14),
                lineHeight: scale(20),
                color: '#525252',
              }
            }}
          />
        </View>
      )}
      
      {/* Footer with reference and actions */}
      <View style={styles.footerContainer}>
        <Body1Title2Regular style={styles.referenceText}>
          {chapter.collection} <View style={styles.dot}></View> {chapter.bookNumber}:{chapter.hadithNumber}
        </Body1Title2Regular>
        
        <View style={styles.actionsContainer}>
          {/* Bookmark Button */}
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleBookmarkPress}
            accessibilityLabel={isSaved ? "Remove bookmark" : "Add bookmark"}
            accessibilityRole="button"
          >
            <CdnSvg
              path={isSaved ? DUA_ASSETS.QURAN_BOOKMARK_FILL_ICON : DUA_ASSETS.HADITH_BOOKMARK}
              width={24}
              height={24}
            />
          </TouchableOpacity>
          
          {/* Share Button */}
          <TouchableOpacity 
            style={styles.actionButton}
            accessibilityLabel="Share hadith"
            accessibilityRole="button"
          >
            <CdnSvg path={DUA_ASSETS.HADITH_SHARE} width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/**
 * Component combining chapter header and hadith item
 */
const ChapterSection: React.FC<{ chapter: HadithChapter }> = ({ chapter }) => {
  return (
    <View style={styles.chapterSection}>
      <ChapterHeader chapter={chapter} />
      <HadithItem chapter={chapter} />
    </View>
  );
};

// ==================== MAIN COMPONENT ====================

/**
 * Main screen component for displaying hadith chapters with pagination
 * Simple, clean implementation without fancy features
 */
const HadithChaptersScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  // Extract route parameters with type safety
  const { hadithId, chapterId } = route.params as RouteParams;
  
  // Use custom hook for pagination with error handling
  const {
    data: chapters,
    isLoading,
    error,
    loadMore,
    hasMore,
    refetch
  } = useHadithChaptersWithPagination(hadithId, chapterId, 10);
  
  // Debug logging for API responses
  useEffect(() => {
    if (chapters && chapters.length > 0) {
      const firstChapter = chapters[0];
      const arabicContent = firstChapter?.hadith?.find(h => h.lang === 'ar');
      
      console.log('Hadith Chapters Debug Info:', {
        totalChapters: chapters.length,
        firstChapterId: firstChapter?.hadithNumber,
        hasArabicContent: Boolean(arabicContent?.body),
        hasScholarlyMarkup: arabicContent?.body?.includes('[') || false,
        // Log a sample of what gets cleaned
        originalSample: arabicContent?.body?.substring(0, 100) || '',
        cleanedSample: cleanArabicHtmlContent(arabicContent?.body || '').substring(0, 100)
      });
    }
    
    if (error) {
      console.error('Hadith Chapters API Error:', error);
    }
  }, [chapters, error]);
  
  // Handle infinite scroll with throttling
  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  }, [hasMore, isLoading, loadMore]);
  
  // Navigation handler with error handling
  const handleGoBack = useCallback(() => {
    try {
      navigation.goBack();
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigation]);
  
  // Render key extractor with fallback
  const keyExtractor = useCallback((item: HadithChapter) => 
    `${item.hadithNumber}-${item.collection}`, 
    []
  );
  
  // Render item component
  const renderChapterItem = useCallback(({ item }: { item: HadithChapter }) => 
    <ChapterSection chapter={item} />, 
    []
  );
  
  // Common header component
  const HeaderComponent = useMemo(() => (
    <View style={styles.headerContainer}>
      <TouchableOpacity 
        style={styles.headerButtonLeft} 
        onPress={handleGoBack}
        accessibilityLabel="Go back"
        accessibilityRole="button"
      >
        <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_LEFT} width={80} height={80} />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <CdnSvg path={DUA_ASSETS.HADITH_BISMILLAH} width={200} height={40} />
      </View>
      
      <TouchableOpacity style={styles.headerButtonRight}>
        <CdnSvg path={DUA_ASSETS.HADITH_CHAPTER_RIGHT} width={80} height={80} />
      </TouchableOpacity>
    </View>
  ), [handleGoBack]);
  
  // ==================== RENDER STATES ====================
  
  // Loading state
  if (isLoading && chapters.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {HeaderComponent}
        <LoadingIndicator color={colors.primary.primary500} />
      </SafeAreaView>
    );
  }
  
  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {HeaderComponent}
        <ErrorMessage 
          message={error.toString() || 'Failed to load hadith chapters'} 
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }
  
  // Main content
  return (
    <SafeAreaView style={styles.safeArea}>
      {HeaderComponent}
      
      {chapters && chapters.length > 0 ? (
        <FlatList
          data={chapters}
          keyExtractor={keyExtractor}
          renderItem={renderChapterItem}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true} // Performance optimization
          maxToRenderPerBatch={5} // Performance optimization
          windowSize={10} // Performance optimization
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

// ==================== STYLES ====================

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