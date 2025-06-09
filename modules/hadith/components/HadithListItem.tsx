import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Bold, CaptionMedium, CaptionBold } from '@/components/Typography/Typography';
import FastImage from 'react-native-fast-image';
import { useThemeStore } from '@/globalStore';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import { CdnSvg } from '@/components/CdnSvg';

export interface HadithListItemProps {
  hadith: {
    id: string | number;
    title: string;
    author: string;
    image: string;
    brief: string;
  };
  onPress: () => void;
}

const HadithListItem: React.FC<HadithListItemProps> = ({ hadith, onPress }) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);
  
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Left portion with image */}
      <View style={styles.leftPortion}>
        <FastImage 
          source={hadith.image ? { uri: hadith.image } : { uri: getCdnUrl(DUA_ASSETS.HADITH_BOOK_IMAGE) }} 
          style={styles.image} 
          resizeMode={FastImage.resizeMode.cover}
        />
      </View>
      
      {/* Right portion with text */}
      <View style={styles.rightPortion}>
        <Body1Title2Bold style={styles.title}>
          {hadith.title}
        </Body1Title2Bold>
        
        <View style={styles.authorPill}>
          <CaptionBold color="yellow-700" style={styles.authorText}>
            {hadith.author}
          </CaptionBold>
        </View>
        
        <CaptionMedium style={styles.brief} color="sub-heading" numberOfLines={2}>
          {hadith.brief}
        </CaptionMedium>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    width: scale(375),
    height: verticalScale(116),
    flexDirection: 'row',
    gap: scale(12),
    backgroundColor: 'white',
    marginBottom: verticalScale(8),
    borderLeftWidth: 1, 
  },
  leftPortion: {
    width: scale(100.21),
    height: verticalScale(116),
    paddingTop: verticalScale(10.61),
    paddingRight: scale(16),
    paddingBottom: verticalScale(7.95),
    paddingLeft: scale(16),
    backgroundColor: '#F5F6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightPortion: {
    flex: 1,
    paddingVertical: verticalScale(12),
    paddingRight: scale(16),
    justifyContent: 'center',
  },
  image: {
    width: scale(68.21),
    height: verticalScale(97.44),
    borderTopLeftRadius: scale(2.14),
    borderTopRightRadius: scale(6.41),
    borderBottomRightRadius: scale(6.41),
    borderBottomLeftRadius: scale(2.14),
    borderWidth: scale(1.07),
    borderColor: colors.primary.primary100,
  },
  title: {
    fontSize: scale(14),
    marginBottom: verticalScale(4),
    color: colors.secondary.neutral950
  },
  authorPill: {
    width: scale(117),
    height: verticalScale(18),
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(29),
    backgroundColor: '#FFECB3',
    marginBottom: verticalScale(4),
    justifyContent: 'center',
  },
  authorText: {
    fontSize: scale(10),
    textAlign: 'center',
  },
  brief: {
    fontSize: scale(10),
    lineHeight: scale(14),
    fontFamily: 'Geist',
    fontWeight: '500',
  },
});

export default HadithListItem;
