// modules/hadith/screens/HadithChaptersScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { H5Bold, Body1Title2Medium, Body1Title2Bold, Body1Title2Regular, CaptionMedium } from '@/components/Typography/Typography';
import { useRoute, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { CdnSvg } from '@/components/CdnSvg';
import { DUA_ASSETS } from '@/utils/cdnUtils';
import HadithImageFooter from '../components/HadithImageFooter';
import { useChapters, useHadiths } from '../hooks/useHadith';
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorMessage from '@/components/ErrorMessage';

// Dummy data for demo
const chaptersData = [
  {
    id: '1',
    title: 'How the Divine Revelation started being revealed to Allah\'s Messenger',
    arabic: 'باب (1) كَيْفَ كَانَ بَدْءُ الْوَحْىِ إِلَى رَسُولِ اللَّهِ صلى الله عليه وسلم',
    hadiths: [
      {
        id: '1',
        arabic: 'حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ ، قَالَ : حَدَّثَنَا سُفْيَانُ ، قَالَ : حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ ، قَالَ : أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ ، يَقُولُ : سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ ، قَالَ : سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ، يَقُولُ : " إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى ، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا ، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ "',
        translation: 'I heard Allah\'s Messenger (ﷺ) saying, "The reward of deeds depends upon the intentions and every person will get the reward according to what he has intended. So whoever emigrated for worldly benefits or for a woman to marry, his emigration was for what he emigrated for."',
        narrator: 'Narrated \'Umar bin Al-Khattab:',
        reference: 'Sahih al-Bukhari - 1:1',
      },
    ],
  },
  {
    id: '2',
    title: '',
    arabic: 'باب (2)',
    hadiths: [
      {
        id: '2',
        arabic: 'حَدَّثَنَا عَبْدُ اللَّهِ بْنُ يُوسُفَ ، قَالَ : أَخْبَرَنَا مَالِكٌ ، عَنْ هِشَامِ بْنِ عُرْوَةَ ، عَنْ أَبِيهِ ، عَنْ عَائِشَةَ أُمِّ الْمُؤْمِنِينَ - رَضِيَ اللَّهُ عَنْهَا - : أَنَّ الْحَارِثَ بْنَ هِشَامٍ - رَضِيَ اللَّهُ عَنْهُ - سَأَلَ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ فَقَالَ : يَا رَسُولَ اللَّهِ كَيْفَ يَأْتِيكَ الْوَحْيُ ؟ فَقَالَ رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ : " أَحْيَانًا يَأْتِينِي مِثْلَ صَلْصَلَةِ الْجَرَسِ ، وَهُوَ أَشَدُّهُ عَلَيَّ ، فَيُفْصَمُ عَنِّي وَقَدْ وَعَيْتُ عَنْهُ مَا قَالَ ، وَأَحْيَانًا يَتَمَثَّلُ لِي الْمَلَكُ رَجُلًا فَيُكَلِّمُنِي فَأَعِي مَا يَقُولُ " . قَالَتْ عَائِشَةُ رَضِيَ اللَّهُ عَنْهَا : وَلَقَدْ رَأَيْتُهُ يَنْزِلُ عَلَيْهِ الْوَحْيُ فِي الْيَوْمِ الشَّدِيدِ الْبَرْدِ فَيَفْصِمُ عَنْهُ وَإِنَّ جَبِينَهُ لَيَتَفَصَّدُ عَرَقًا',
        translation: 'The mother of the faithful believers, \'Aisha narrated: Al-Harith bin Hisham asked the Messenger of Allah (ﷺ): "How does the divine inspiration come to you?" He replied, "In all these ways: The Angel sometimes comes to me with a voice which resembles the sound of a ringing bell, and when this state abandons me, I remember what the Angel has said, and this type of Divine Inspiration is the hardest on me; and sometimes the Angel comes to me in the shape of a man and talks to me, and I understand and remember what he says."',
        narrator: 'Narrated \'Aisha:',
        reference: 'Sahih al-Bukhari - 1:2',
      },
    ],
  },
];

const ChapterHeader = ({ chapter, index }: { chapter: any, index: number }) => {
  return (
    <LinearGradient
      colors={['#FEFAEC', '#FCEFC7']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.chapterHeader}
    >
      <Body1Title2Medium color="yellow-800" style={styles.chapterNumber}>({index + 1}) Chapter: {chapter.title}</Body1Title2Medium>
      <View style={styles.dividerContainer}>
        <CdnSvg path={DUA_ASSETS.HADITH_DASHED_LINE} width={scale(300)} height={1} />
      </View>
      <Body1Title2Medium color="accent-yellow-900" style={styles.chapterArabic}>{chapter.arabic}</Body1Title2Medium>
    </LinearGradient>
  );
};

const HadithItem = ({ hadith }: { hadith: any }) => {
  return (
    <View style={styles.hadithContainer}>
      <View style={styles.arabicContainer}>
        <Text style={styles.arabicText}>{hadith.arabic}</Text>
      </View>
      
      <View style={styles.narratorContainer}>
        <Body1Title2Medium style={styles.narratorText}>{hadith.narrator}</Body1Title2Medium>
        <Body1Title2Regular style={styles.translationText}>{hadith.translation}</Body1Title2Regular>
      </View>
      
      <View style={styles.footerContainer}>
        <Body1Title2Regular style={styles.referenceText}>{hadith.reference}</Body1Title2Regular>
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <CdnSvg path={DUA_ASSETS.HADITH_BOOKMARK} width={24} height={24} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <CdnSvg path={DUA_ASSETS.HADITH_SHARE} width={24} height={24} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ChapterSection = ({ chapter, index }: { chapter: any, index: number }) => {
  return (
    <View style={styles.chapterSection}>
      <ChapterHeader chapter={chapter} index={index} />
      {chapter.hadiths.map((hadith: any) => (
        <HadithItem key={hadith.id} hadith={hadith} />
      ))}
    </View>
  );
};

// Import the Chapter type from the service
import type { Chapter as ServiceChapter, Hadith as ServiceHadith } from '../services/hadithService';

// Define our local Chapter interface
interface Chapter {
  id: string;
  chapterId: string;
  title: string;
  arabic: string;
  hadiths: Hadith[];
  bookNumber?: string;
  chapterNumber?: string;
  chapterEnglish?: string;
  chapterArabic?: string;
  chapter?: Array<{
    lang: string;
    chapterNumber: string;
    chapterTitle: string;
    intro: string | null;
    ending: string | null;
  }>;
  // Add index signature to allow dynamic properties
  [key: string]: any;
}

interface Hadith {
  id: string;
  hadithNumber?: string;
  arabic: string;
  translation?: string;
  narrator?: string;
  reference?: string;
  collection?: string;
  bookNumber?: string;
  chapterId?: string;
  hadith?: Array<{
    lang: string;
    chapterNumber: string;
    chapterTitle: string;
    urn: number;
    body: string;
    grades?: Array<{
      graded_by: string;
      grade: string;
    }>;
  }>;
}

// Type guard to check if an object is a valid Chapter
function isValidChapter(chapter: any): chapter is Chapter {
  return (
    chapter &&
    typeof chapter === 'object' &&
    'id' in chapter &&
    'title' in chapter &&
    'arabic' in chapter &&
    'hadiths' in chapter
  );
}

const HadithChaptersScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { hadithId, chapterId, chapterTitle } = route.params as { hadithId: string; chapterId: string; chapterTitle: string };
  const [visibleChapters, setVisibleChapters] = useState(1);
  
  // Fetch chapters and hadiths from API
  const { 
    data: chaptersData, 
    isLoading: chaptersLoading, 
    error: chaptersError 
  } = useChapters(hadithId, chapterId);
  
  const { 
    data: hadithsData, 
    isLoading: hadithsLoading, 
    error: hadithsError 
  } = useHadiths(hadithId, chapterId);

  // Log API responses for debugging
  useEffect(() => {
    if (chaptersData) {
      console.log('Chapters API Response:', chaptersData);
    }
    if (chaptersError) {
      console.error('Chapters API Error:', chaptersError);
    }
    if (hadithsData) {
      console.log('Hadiths API Response:', hadithsData);
    }
    if (hadithsError) {
      console.error('Hadiths API Error:', hadithsError);
    }
  }, [chaptersData, chaptersError, hadithsData, hadithsError]);

  // Process API data or use fallback
  const processedChapters: Chapter[] = React.useMemo(() => {
    if (!chaptersData?.data || !hadithsData?.data) {
      return [];
    }
    
    // Map API data to our UI format
    const chapters = chaptersData.data.map((chapter: any) => {
      const chapterHadiths = hadithsData.data.filter((hadith: any) => 
        hadith.chapterNumber === chapter.chapterNumber
      ).map((hadith: any) => ({
        id: hadith.hadithNumber,
        hadithNumber: hadith.hadithNumber,
        arabic: hadith.hadithArabic || '',
        translation: hadith.hadithEnglish || '',
        narrator: hadith.narrator || 'Unknown Narrator',
        reference: `${hadithId} - ${hadith.hadithNumber}`
      }));
      
      return {
        id: chapter.chapterNumber,
        chapterId: chapter.chapterNumber,
        title: chapter.chapterEnglish || '',
        arabic: chapter.chapterArabic || `باب (${chapter.chapterNumber})`,
        hadiths: chapterHadiths
      };
    });
    
    return chapters;
  }, [chaptersData, hadithsData, hadithId]);

  // Infinite scroll handler
  const handleEndReached = () => {
    if (visibleChapters < processedChapters.length) {
      setVisibleChapters(prev => Math.min(prev + 2, processedChapters.length));
    }
  };

  // Show loading state
  if (chaptersLoading || hadithsLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
        <LoadingIndicator color={colors.primary.primary500} />
      </SafeAreaView>
    );
  }

  // Show error state
  if (chaptersError || hadithsError) {
    return (
      <SafeAreaView style={styles.safeArea}>
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
        <ErrorMessage 
          message={(chaptersError || hadithsError)?.toString() || 'Failed to load hadith chapters'} 
          onRetry={() => navigation.replace('hadithChapters', { hadithId, chapterId, chapterTitle })}
        />
      </SafeAreaView>
    );
  }

  // Process and normalize chapters data
  let displayChapters: Chapter[] = [];
  
  try {
    if (processedChapters.length > 0) {
      // Use processed chapters if available
      displayChapters = processedChapters;
    } else if (chaptersData?.data) {
      const data = chaptersData.data;
      let chapters: any[] = [];
      
      // Normalize data to array
      if (Array.isArray(data)) {
        chapters = data;
      } else if (data && typeof data === 'object') {
        chapters = [data];
      }
      
      // Map and validate chapters
      displayChapters = chapters
        .map(chapter => {
          // Extract chapter info from the service format
          const chapterInfo = Array.isArray(chapter.chapter) ? chapter.chapter[0] : null;
          
          // Create a normalized chapter object with type assertion
          const normalizedChapter = {
            id: chapter.id || chapter.chapterId || '',
            chapterId: chapter.chapterId || chapter.id || '',
            title: chapter.title || chapterInfo?.chapterTitle || '',
            arabic: chapter.arabic || '',
            bookNumber: chapter.bookNumber,
            chapterNumber: chapterInfo?.chapterNumber,
            chapterEnglish: chapterInfo?.chapterTitle,
            chapterArabic: '', // Will be populated if available
            chapter: chapter.chapter,
            hadiths: Array.isArray(chapter.hadiths) 
              ? chapter.hadiths.map((h: any) => ({
                  ...h,
                  id: h.id || '',
                  arabic: h.hadith?.[0]?.body || '',
                  translation: h.translation || '',
                  narrator: h.narrator || '',
                  reference: h.reference || `${chapterInfo?.chapterNumber || ''}`,
                  collection: h.collection,
                  bookNumber: h.bookNumber,
                  chapterId: h.chapterId,
                  hadithNumber: h.hadithNumber
                }))
              : []
          } as Chapter;
          
          return normalizedChapter;
        })
        .filter(isValidChapter); // Filter out invalid chapters
    }
  } catch (error) {
    console.error('Error processing chapters data:', error);
    // Return empty array in case of error to prevent crashes
    displayChapters = [];
  }

  return (
    <SafeAreaView style={styles.safeArea}>
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
      
      {displayChapters && displayChapters.length > 0 ? (
        <FlatList
          data={displayChapters.slice(0, visibleChapters)}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => <ChapterSection chapter={item} index={index} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<HadithImageFooter />}
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
    height: scale(152.07),
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.2,
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
    color: '#171717',
    textAlign: 'center',
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
  arabicText: {
    fontSize: scale(18),
    lineHeight: scale(28),
    color: '#171717',
    textAlign: 'right',
    fontWeight: '500',
  },
  narratorContainer: {
    width: scale(375),
    padding: scale(20),
    rowGap: scale(16),
  },
  narratorText: {
    fontSize: scale(14),
    fontWeight: 'bold',
    color: '#171717',
  },
  translationText: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: '#525252',
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
  actionButtonText: {
    fontSize: scale(16),
  },
});

export default HadithChaptersScreen;