// modules/hadith/screens/HadithDetailScreen.tsx

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useThemeStore } from '@/globalStore';
import { scale, verticalScale } from '@/theme/responsive';
import FastImage from 'react-native-fast-image';
import { Body2Medium, CaptionMedium, CaptionBold, H5Bold, Body1Title2Bold, Body1Title2Regular } from '@/components/Typography/Typography';
import HadithImageFooter from '../components/HadithImageFooter';
import LinearGradient from 'react-native-linear-gradient';
import { DUA_ASSETS, getCdnUrl, getHadithBookImagePath } from '@/utils/cdnUtils';
import { CdnSvg } from '@/components/CdnSvg';
import { useNavigation, useRoute } from '@react-navigation/native';

// Fallback data in case API fails
const fallbackHadithDetail = {
  id: 'bukhari',
  title: 'Sahih al-Bukhari',
  author: 'Abu Abdullah Muhammad Ibn Isma\'il al-Bukhari(rahimahullah)',
  years: '202-275 AH',
  translator: 'Dr. M. Muhsin Khan',
  image: DUA_ASSETS.HADITH_BOOK_IMAGE,
  highlight: 'Contains roughly 7500 Hadith (with repetitions) in 57 books',
  brief: `Ṣaḥīḥ al-Bukhārī is a collection of hadīth compiled by Abu Abdullāh Muhammad Ibn Ismā\`īl al-Bukhārī(rahimahullāh). His collection is recognised by the overwhelming majority of the Muslim world to be one of the most authentic collections of the Sunnah of the Prophet (ﷺ). It contains roughly 7563 hadīth (with repetitions) in 98 books. The translation provided here is by Dr. M. Muhsin Khan.`,
  authorBio: `Imām al-Bukhārī (rahimahullāh) is known as the Amīr al-Mu'minīn in hadīth. His genealogy is as follows: Abu Abdullāh Muhammad Ibn Ismā\`īl Ibn Ibrāhīm Ibn al-Mughīrah Ibn Bardizbah al-Bukhārī. His father Ismā\`īl was a well-known and famous muhaddith in his time and had been blessed with the chance of being in the company of Imām Mālik, Hammād Ibn Zaid and also Abdullāh Ibn Mubārak (rahimahullahum).`,
};

const HadithDetailScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { id, hadithTitle, hadithDetail: passedHadithDetail } = route.params as {
    id: string;
    hadithTitle: string;
    hadithDetail: any;
  };

  // Use passed data or fallback to dummy data
  const hadithDetail = passedHadithDetail || fallbackHadithDetail;

  const handleStartLearning = () => {
    navigation.navigate('hadithChapters', { hadithId: id, chapterId: '1', chapterTitle: hadithTitle });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Section */}
      <View style={styles.topSection}>
        
      <View style={styles.topIllustrationContainer}>
            <CdnSvg 
              path={DUA_ASSETS.HADITH_TOP_ILLUSTRATION}
              width={scale(155)}
              height={verticalScale(100)}
            />
          </View>
        <View style={styles.innerTopSection}>
          
          {/* Book Card */}
          <View style={styles.bookCard}>
            {/* Book Image */}
            <FastImage 
              source={{ uri: getCdnUrl(getHadithBookImagePath(hadithDetail.title)) }}
              style={styles.bookImage}
              resizeMode={FastImage.resizeMode.contain}
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
            <TouchableOpacity 
              style={[styles.actionBtn, styles.startBtn]}
              onPress={handleStartLearning}
            >
              <CdnSvg 
                path={DUA_ASSETS.HADITH_PLAY}
                width={20}
                height={20}
              />
              <Body1Title2Bold style={styles.startBtnText}>Start learning</Body1Title2Bold>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.shareBtn]}>
              <CdnSvg 
                path={DUA_ASSETS.QURAN_SHARE_ICON}
                width={20}
                height={20}
              />
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
    position: 'relative',
  },
  topIllustrationContainer: {
    position: 'absolute',
    top: scale(-16),
    left: 0,
    zIndex: 0,
  },
  bookCard: {
    width: scale(335),
    height: verticalScale(188.7),
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
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
    height: verticalScale(188.7),
    paddingVertical: scale(10),
    justifyContent: 'flex-start',
  },
  infoSection: {
    width: scale(186.91),
    marginBottom: scale(16),
  },
  bookTitle: {
    fontSize: scale(20),
    marginBottom: scale(16),
  },
  infoLabel: {
    fontSize: scale(10),
    marginBottom: scale(4),
    color: '#737373',
  },
  authorName: {
    fontSize: scale(12),
    color: '#171717',
  },
  infoValue: {
    fontSize: scale(12),
    color: '#171717',
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