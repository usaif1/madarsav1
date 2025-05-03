// modules/hadith/screens/HadithDetailScreen.tsx

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { Body2Medium, CaptionMedium, CaptionBold, H5Bold, Body1Title2Bold, Body1Title2Regular } from '@/components/Typography/Typography';
import HadithImageFooter from '../components/HadithImageFooter';
import LinearGradient from 'react-native-linear-gradient';
import PlayIcon from '@/assets/hadith/Play.svg';
import ShareIcon from '@/assets/hadith/Share.svg';

// Dummy data for demo
const hadithDetail = {
  id: 'bukhari',
  title: 'Sahih al-Bukhari',
  author: 'Abu Abdullah Muhammad Ibn Isma\'il al-Bukhari(rahimahullah)',
  years: '202-275 AH',
  translator: 'Dr. M. Muhsin Khan',
  image: require('@/assets/hadith/BookImageBig.png'),
  highlight: 'Contains roughly 7500 Hadith (with repetitions) in 57 books',
  brief: `Ṣaḥīḥ al-Bukhārī is a collection of hadīth compiled by Abu Abdullāh Muhammad Ibn Ismā\`īl al-Bukhārī(rahimahullāh). His collection is recognised by the overwhelming majority of the Muslim world to be one of the most authentic collections of the Sunnah of the Prophet (ﷺ). It contains roughly 7563 hadīth (with repetitions) in 98 books. The translation provided here is by Dr. M. Muhsin Khan.`,
  authorBio: `Imām al-Bukhārī (rahimahullāh) is known as the Amīr al-Mu'minīn in hadīth. His genealogy is as follows: Abu Abdullāh Muhammad Ibn Ismā\`īl Ibn Ibrāhīm Ibn al-Mughīrah Ibn Bardizbah al-Bukhārī. His father Ismā\`īl was a well-known and famous muhaddith in his time and had been blessed with the chance of being in the company of Imām Mālik, Hammād Ibn Zaid and also Abdullāh Ibn Mubārak (rahimahullahum).

Imām al-Bukhārī (rahimahullah) was born on the day of Jumuah (Friday) the 13th of Shawwāl 194 (A.H.). His father passed away in his childhood. At the age of sixteen after having memorized the compiled books of Imām Wakīy and Abdullāh Ibn Mubārak, he performed Hajj with his elder brother and mother. After the completion of Hajj he remained in Makkah for a further two years and upon reaching the age of eighteen headed for Madīnah, compiling the books "Qadhāyas-Sahābah wa at-Tābi'īn" and "Tārikh al-Kabīr." Imām al-Bukhārī also traveled to other key centers of Arabia in search of knowledge like Syria, Egypt, Kufa, Basra, and Baghdad.

Imām al-Bukhārī (rahimahullah) first started listening and learning ahādīth in 205 A.H., and after benefiting from the \`ulama of his town he started his travels in 210 A.H. His memory was considered to be one of a kind; after listening to a hadīth he would repeat it from memory. It has been known that in his childhood he had memorized 2,000 ahādīth.

There are a number of books compiled by Imām al-Bukhārī (rahimahullah). His Ṣaḥīḥ is regarded as the highest authority of the collection of hadīth. He named this book "Al-Jāmi\` al-Musnad as-Ṣaḥīḥ al-Mukhtasar min Umuri Rasulullahi sallallāhu 'alaihi wa sallam wa Sunanihi wa Ayyāmihi." After he finished, he showed the manuscript to his teachers Imām Ahmad ibn Hanbal (rahimahullah) for approval, along with Ibn al-Madini, and lastly Ibn Ma\`īn. It has also been recorded that it took Imām al-Bukhārī a period of 16 years to gather the ahādīth and to write the Ṣaḥīḥ, which sets the date back to 217 A.H. as the year in which he started the compilation; Imām al-Bukhārī (rahimahullah) being merely 23 years of age.

Before he actually placed a hadith in his compilation he performed ghusl and prayed two raka\`ah nafl prayers asking Allah for guidance. He finalized each hadith in the rawdah of Masjid an-Nabawi (between the Prophet's (ﷺ) grave and his minbar) and wrote the hadīth in the masjid. Only after being completely satisfied with a hadīth did he give it a place in his collection.

Methods of Classification and Annotation: Imām al-Bukhārī (rahimahullah) imposed conditions which all narrators and testifiers in the hadith chain must have met before a hadith was included in his book:

1. All narrators in the chain must be just (\`adl).
2. All narrators in the chain must possess strong memory and all the Muhadditheen who possess great knowledge of ahadith must agree upon the narrators' ability to learn and memorize, along with their reporting techniques.
3. The chain must be complete without any missing narrators.
4. It must be known that consecutive narrators in the chain met each other (this is Imām al-Bukhārī's extra condition).

Imām an-Nawawi (rahimahullah) relates that all scholars in Islām have agreed that Ṣaḥīḥ al-Bukhārī has gained the status of being the most authentic book after the Qur'an. Ṣaḥīḥ al-Bukhārī consists of 7,563 ahādith including those ahādith which have been repeated. Without repetitions however, the total number of hadith is around 2,600.

His Students: In the year 864/250, he settled in Nishapur. It was there that he met Muslim ibn Al-Hajjaj, who would be considered his student, and eventually collector and organizer of the hadith collection Ṣaḥīḥ Muslim which is considered second only to that of al-Bukhārī.

His Death: Political problems led him to move to Khartank, a village near Samarkānd where he died in the year 256 A.H./870 A.D.`,
};

const HadithDetailScreen: React.FC = () => {
  const { colors } = useThemeStore();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Section */}
      <View style={styles.topSection}>
        <View style={styles.innerTopSection}>
          {/* Book Card */}
          <View style={styles.bookCard}>
            {/* Book Image */}
            <FastImage 
              source={hadithDetail.image} 
              style={styles.bookImage}
              resizeMode={FastImage.resizeMode.cover}
            />
            
            {/* Book Info */}
            <View style={styles.bookInfo}>
              <H5Bold style={styles.bookTitle}>{hadithDetail.title}</H5Bold>
              
              <View style={styles.infoSection}>
                <CaptionMedium color="sub-heading" style={styles.infoLabel}>Author</CaptionMedium>
                <CaptionMedium style={styles.authorName}>{hadithDetail.author}</CaptionMedium>
              </View>
              
              <View style={styles.infoSection}>
                <CaptionMedium color="sub-heading" style={styles.infoLabel}>Narrated in</CaptionMedium>
                <Body2Medium style={styles.infoValue}>{hadithDetail.years}</Body2Medium>
              </View>
              
              <View style={styles.infoSection}>
                <CaptionMedium color="sub-heading" style={styles.infoLabel}>Translation by</CaptionMedium>
                <Body2Medium style={styles.infoValue}>{hadithDetail.translator}</Body2Medium>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, styles.startBtn]}>
              <PlayIcon width={20} height={20} />
              <Body1Title2Bold style={styles.startBtnText}>Start learning</Body1Title2Bold>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.shareBtn]}>
              <ShareIcon width={20} height={20} />
              <Body1Title2Bold style={styles.shareBtnText}>Share</Body1Title2Bold>
            </TouchableOpacity>
          </View>
        </View>

      {/* Highlight Bar */}
      <LinearGradient 
        colors={['#FEFAEC', '#FCEFC7']} 
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}} 
        style={styles.highlightBar}
      >
        <CaptionBold color="accent-yellow-900" style={styles.highlightText}>{hadithDetail.highlight}</CaptionBold>
      </LinearGradient>
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Hadith Brief */}
        <View style={styles.briefSection}>
          <H5Bold style={styles.sectionTitle}>Hadith brief</H5Bold>
          <Body1Title2Regular style={styles.briefText}>{hadithDetail.brief}</Body1Title2Regular>
        </View>

        {/* Author Bio */}
        <View style={styles.bioSection}>
          <Body1Title2Regular style={styles.bioText}>Author bio</Body1Title2Regular>
          <Body1Title2Regular style={styles.bioText}>{hadithDetail.authorBio}</Body1Title2Regular>
        </View>
      </View>

      {/* Footer */}
      <HadithImageFooter />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white',
  },
  topSection: {
    width: scale(375),
    height: verticalScale(322.7),
    paddingTop: scale(32),
    gap: scale(16),
    backgroundColor: '#FFFDF6',
  },
  innerTopSection: {
    width: scale(375),
    height: verticalScale(244.7),
    rowGap: scale(16),
    paddingHorizontal: scale(20),
  },
  bookCard: {
    width: scale(335),
    height: verticalScale(188.7),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: scale(16),
  },
  bookImage: {
    width: scale(132.09),
    height: verticalScale(188.7),
    borderTopLeftRadius: scale(1.65),
    borderTopRightRadius: scale(4.96),
    borderBottomRightRadius: scale(4.96),
    borderBottomLeftRadius: scale(1.65),
  },
  bookInfo: {
    width: scale(186.91),
    height: verticalScale(180),
    rowGap: scale(10),
    justifyContent: 'center',
  },
  infoSection: {
    width: scale(186.91),
    height: verticalScale(52),
    rowGap: scale(4),
  },
  bookTitle: {
    fontSize: scale(20),
    marginBottom: scale(8),
  },
  infoLabel: {
    fontSize: scale(10),
    marginTop: scale(4),
  },
  authorName: {
    fontSize: scale(12),
    color: '#171717',
  },
  infoValue: {
    fontSize: scale(12),
    color: '#171717',
    marginBottom: scale(4),
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(7),
  },
  actionBtn: {
    width: scale(164),
    height: verticalScale(40),
    borderRadius: scale(60),
    paddingVertical: scale(10),
    paddingHorizontal: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: scale(6),
  },
  startBtn: {
    backgroundColor: '#F0EAFB',
  },
  startBtnText: {
    color: '#8A57DC',
    fontSize: scale(14),
  },
  shareBtn: {
    backgroundColor: '#6D2DD3',
  },
  shareBtnText: {
    color: 'white',
    fontSize: scale(14),
  },
  highlightBar: {
    height: verticalScale(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightText: {
    fontSize: scale(10),
  },
  contentSection: {
    width: scale(375),
    padding: scale(20),
    paddingTop: scale(24),
    rowGap: scale(10),
  },
  briefSection: {
    marginBottom: scale(16),
  },
  bioSection: {
    marginBottom: scale(16),
  },
  sectionTitle: {
    fontSize: scale(20),
    marginBottom: scale(8),
  },
  briefText: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: '#737373',
  },
  bioText: {
    fontSize: scale(14),
    lineHeight: scale(20),
    color: '#737373',
  },
});

export default HadithDetailScreen;