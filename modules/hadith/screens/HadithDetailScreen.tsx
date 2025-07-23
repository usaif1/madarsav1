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
import LoadingIndicator from '@/components/LoadingIndicator';
import ErrorMessage from '@/components/ErrorMessage';

/**
 * Interface for hadith detail data structure
 */
interface HadithDetail {
  id: string;
  title: string;
  author: string;
  years: string;
  translator: string;
  image: string;
  highlight: string;
  brief: string;
  authorBio: string;
}

/**
 * Route parameters interface
 */
interface RouteParams {
  id: string;
  hadithTitle: string;
  hadithDetail?: HadithDetail;
}

const HadithDetailScreen: React.FC = () => {
  const { colors } = useThemeStore();
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { id, hadithTitle, hadithDetail } = route.params as RouteParams;

  /**
   * Handle start learning button press
   * Navigates to hadith chapters screen
   */
  const handleStartLearning = () => {
    navigation.navigate('hadithChapters', { 
      hadithId: id, 
      chapterId: '1', 
      chapterTitle: hadithTitle 
    });
  };

  /**
   * Handle share button press
   * TODO: Implement sharing functionality
   */
  const handleSharePress = () => {
    // Implement share functionality
    console.log('Share pressed for hadith:', hadithDetail?.title);
  };

  // Show error if no hadith detail data is provided
  if (!hadithDetail) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ErrorMessage 
          message="Hadith details not available. Please try again."
          onRetry={() => navigation.goBack()}
        />
      </View>
    );
  }

  // Show loading if essential data is missing
  if (!hadithDetail.title || !hadithDetail.author) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <LoadingIndicator color={colors.primary.primary500} />
        <Text style={styles.loadingText}>Loading hadith details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Top Section */}
      <View style={styles.topSection}>
        {/* Top Illustration */}
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
              defaultSource={{ uri: getCdnUrl(DUA_ASSETS.HADITH_BOOK_IMAGE) }}
            />
            
            {/* Book Info */}
            <View style={styles.bookInfo}>
              <H5Bold style={styles.bookTitle}>{hadithDetail.title}</H5Bold>
              
              <View style={styles.infoSection}>
                <CaptionMedium color="sub-heading" style={styles.infoLabel}>Author</CaptionMedium>
                <CaptionMedium style={styles.authorName}>{hadithDetail.author}</CaptionMedium>
              </View>
              
              {hadithDetail.years && (
                <View style={styles.infoSection}>
                  <CaptionMedium color="sub-heading" style={styles.infoLabel}>Narrated in</CaptionMedium>
                  <Body2Medium style={styles.infoValue}>{hadithDetail.years}</Body2Medium>
                </View>
              )}
              
              {hadithDetail.translator && (
                <View style={styles.infoSection}>
                  <CaptionMedium color="sub-heading" style={styles.infoLabel}>Translation by</CaptionMedium>
                  <Body2Medium style={styles.infoValue}>{hadithDetail.translator}</Body2Medium>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={[styles.actionBtn, styles.startBtn]}
              onPress={handleStartLearning}
              activeOpacity={0.8}
              accessibilityLabel="Start learning hadith"
              accessibilityRole="button"
            >
              <CdnSvg 
                path={DUA_ASSETS.HADITH_PLAY}
                width={20}
                height={20}
              />
              <Body1Title2Bold style={styles.startBtnText}>Start learning</Body1Title2Bold>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionBtn, styles.shareBtn]}
              onPress={handleSharePress}
              activeOpacity={0.8}
              accessibilityLabel="Share hadith"
              accessibilityRole="button"
            >
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
        {hadithDetail.highlight && (
          <LinearGradient 
            colors={['#FEFAEC', '#FCEFC7']} 
            start={{x: 0, y: 0}} 
            end={{x: 1, y: 0}} 
            style={styles.highlightBar}
          >
            <CaptionBold color="accent-yellow-900" style={styles.highlightText}>
              {hadithDetail.highlight}
            </CaptionBold>
          </LinearGradient>
        )}
      </View>

      {/* Content Section */}
      <View style={styles.contentSection}>
        {/* Hadith Brief */}
        {hadithDetail.brief && (
          <View style={styles.briefSection}>
            <H5Bold style={styles.sectionTitle}>Hadith brief</H5Bold>
            <Body1Title2Regular style={styles.briefText}>
              {hadithDetail.brief}
            </Body1Title2Regular>
          </View>
        )}

        {/* Author Bio */}
        {hadithDetail.authorBio && (
          <View style={styles.bioSection}>
            <H5Bold style={styles.sectionTitle}>Author bio</H5Bold>
            <Body1Title2Regular style={styles.bioText}>
              {hadithDetail.authorBio}
            </Body1Title2Regular>
          </View>
        )}
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: scale(16),
    color: '#8A57DC',
    fontWeight: '500',
    textAlign: 'center',
  },
  topSection: {
    width: scale(375),
    minHeight: verticalScale(322.7),
    paddingTop: scale(32),
    gap: scale(16),
    backgroundColor: '#FFFDF6',
  },
  innerTopSection: {
    width: scale(375),
    minHeight: verticalScale(244.7),
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
    minHeight: verticalScale(188.7),
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
    flex: 1,
    minHeight: verticalScale(188.7),
    paddingVertical: scale(10),
    justifyContent: 'flex-start',
  },
  infoSection: {
    width: '100%',
    marginBottom: scale(16),
  },
  bookTitle: {
    fontSize: scale(20),
    marginBottom: scale(16),
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: scale(10),
    marginBottom: scale(4),
    color: '#737373',
  },
  authorName: {
    fontSize: scale(12),
    color: '#171717',
    flexWrap: 'wrap',
  },
  infoValue: {
    fontSize: scale(12),
    color: '#171717',
    flexWrap: 'wrap',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: scale(7),
  },
  actionBtn: {
    flex: 1,
    maxWidth: scale(164),
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
    minHeight: verticalScale(30),
    paddingVertical: scale(8),
    paddingHorizontal: scale(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightText: {
    fontSize: scale(10),
    textAlign: 'center',
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