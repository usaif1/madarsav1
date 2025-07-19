import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Bold, CaptionMedium, CaptionBold } from '@/components/Typography/Typography';
import { useThemeStore } from '@/globalStore';
import { DUA_ASSETS, getCdnUrl, getHadithBookImagePath } from '@/utils/cdnUtils';
import FastImage from 'react-native-fast-image';

export interface HadithCardProps {
  hadith: {
    id: string | number;
    title: string;
    author: string;
    image: string;
    brief: string;
  };
  onPress: () => void;
}

const HadithCard: React.FC<HadithCardProps> = ({ hadith, onPress }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  
  /**
   * Get the dynamic image URL based on hadith title
   * Falls back to default hadith book image if the specific image fails to load
   */
  const getHadithImageUrl = (): string => {
    // Generate dynamic path based on hadith title
    const dynamicImagePath = getHadithBookImagePath(hadith.title);
    return getCdnUrl(dynamicImagePath);
  };

  /**
   * Fallback image URL for error cases
   */
  const getFallbackImageUrl = (): string => {
    return getCdnUrl(DUA_ASSETS.HADITH_BOOK_IMAGE);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Top portion with image */}
      <View style={styles.topPortion}>
        <FastImage 
          source={{ 
            uri: getHadithImageUrl(),
            priority: FastImage.priority.normal,
          }}
          style={styles.image} 
          resizeMode={FastImage.resizeMode.contain}
          fallback={true} // Enable fallback for better error handling
          onError={() => {
            // Optional: Log error for debugging
            console.log(`Failed to load image for hadith: ${hadith.title}`);
          }}
          // Fallback source in case the dynamic image fails
          defaultSource={{ uri: getFallbackImageUrl() }}
        />
      </View>
      
      {/* Bottom portion with text */}
      <View style={styles.bottomPortion}>
        <Body1Title2Bold style={[styles.title]}>
          {hadith.title}
        </Body1Title2Bold>
        
        <View style={styles.authorPill}>
          <CaptionBold color="yellow-700" style={[styles.authorText]}>
            {hadith.author}
          </CaptionBold>
        </View>
        
        <CaptionMedium style={styles.brief} color="sub-heading" numberOfLines={3}>
          {hadith.brief}
        </CaptionMedium>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    width: scale(186.5),
    height: verticalScale(289),
    paddingBottom: scale(16),
    gap: scale(10),
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  topPortion: {
    width: scale(186.5),
    height: verticalScale(175),
    paddingTop: scale(16),
    paddingBottom: scale(12),
    backgroundColor: '#F5F6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomPortion: {
    width: scale(186.5),
    paddingHorizontal: scale(12),
    gap: scale(10),
  },
  image: {
    width: scale(102.9),
    height: verticalScale(147),
    borderTopLeftRadius: scale(3.22),
    borderTopRightRadius: scale(9.67),
    borderBottomRightRadius: scale(9.67),
    borderBottomLeftRadius: scale(3.22),
    borderWidth: scale(1.61),
    borderColor: colors.primary.primary100,
  },
  title: {
    fontSize: scale(14),
    textAlign: 'center',
    color: colors.secondary.neutral950
  },
  authorPill: {
    width: scale(86),
    height: verticalScale(18),
    paddingTop: scale(2),
    paddingRight: scale(8),
    paddingBottom: scale(2),
    paddingLeft: scale(8),
    borderRadius: scale(30),
    backgroundColor: '#FFECB3',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  authorText: {
    fontSize: scale(10),
    textAlign: 'center',
  },
  brief: {
    fontSize: scale(10),
    textAlign: 'center',
    width: scale(162.5),
  },
});

export default HadithCard;