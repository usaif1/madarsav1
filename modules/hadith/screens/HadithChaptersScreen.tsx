// modules/hadith/screens/HadithChaptersScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import { H5Bold, Body1Title2Medium, Body1Title2Bold, Body1Title2Regular, CaptionMedium } from '@/components/Typography/Typography';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import HadithImageFooter from '../components/HadithImageFooter';
import HadithChaptersLeftHeading from '@/assets/hadith/HadithChaptersLeftHeading.svg';
import HadithChaptersRightHeading from '@/assets/hadith/HadithChaptersRightHeading.svg';
import BismillahCalligraphy from '@/assets/hadith/BismillahCalligraphy.svg';
import Bookmark from '@/assets/hadith/bookmark.svg';
import ShareAlt from '@/assets/hadith/share_alt.svg';
import DashedLine from '@/assets/hadith/dashedLine.svg';

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
        <DashedLine />
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
            <Bookmark />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <ShareAlt />
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

const HadithChaptersScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const route = useRoute();
  const { id } = route.params as { id: string };
  const [visibleChapters, setVisibleChapters] = useState(chaptersData.length);

  // Infinite scroll handler
  const handleEndReached = () => {
    if (visibleChapters < chaptersData.length) {
      setVisibleChapters(prev => Math.min(prev + 2, chaptersData.length));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <TouchableOpacity style={styles.headerButton}>
          <HadithChaptersLeftHeading />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <BismillahCalligraphy width={200} height={40} />
        </View>
        <TouchableOpacity style={styles.headerButton}>
          <HadithChaptersRightHeading />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={chaptersData.slice(0, visibleChapters)}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => <ChapterSection chapter={item} index={index} />}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<HadithImageFooter />}
      />
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
    opacity: 0.5,
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