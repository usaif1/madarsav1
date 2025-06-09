import React from 'react';
import { View, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Title3Bold, Body1Title2Medium, Body2Medium, CaptionBold, Body1Title2Bold } from '@/components/Typography/Typography';
import FastImage from 'react-native-fast-image';
import { useThemeStore } from '@/globalStore';
import { DUA_ASSETS, getCdnUrl } from '@/utils/cdnUtils';
import { CdnSvg } from '@/components/CdnSvg';

interface HadithInfoCardProps {
  title: string;
  author: string;
  image?: string;
  brief: string;
  onPress: () => void;
}

const HadithInfoCard: React.FC<HadithInfoCardProps> = ({
  title,
  author,
  image,
  brief,
  onPress,
}) => {
  const { colors } = useThemeStore();
  const styles = getStyles(colors);

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Background SVG Pattern */}
      <View style={styles.backgroundPattern}>
        <CdnSvg 
          path={DUA_ASSETS.HADITH_TOP_ILLUSTRATION}
          width={100}
          height={127} // Fixed height to match container
        />
      </View>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Image */}
        <View style={styles.imageContainer}>
          <FastImage 
            source={image ? { uri: image } : { uri: getCdnUrl(DUA_ASSETS.HADITH_BOOK_IMAGE) }}
            style={styles.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>

        {/* Text Content */}
        <View style={styles.textContent}>
          {/* Title and Arrow */}
          <View style={styles.titleRow}>
            <Body1Title2Bold style={styles.title} numberOfLines={1}>{title}</Body1Title2Bold>
            <View style={styles.arrowBtn}>
              <CdnSvg 
                path={DUA_ASSETS.ARROW_RIGHT}
                width={16}
                height={16}
              />
            </View>
          </View>

          {/* Author Pill */}
          <View style={styles.authorPillContainer}>
            <View style={styles.authorPill}>
              <CaptionBold color="yellow-700" style={styles.authorText}>
                {author}
              </CaptionBold>
            </View>
          </View>

          {/* Description */}
          <Body2Medium color="sub-heading" style={styles.description} numberOfLines={2}>
            {brief}
          </Body2Medium>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getStyles = (colors: any) => StyleSheet.create({
  container: {
    height: verticalScale(127),
    paddingVertical: scale(16),
    paddingHorizontal: scale(16),
    backgroundColor: '#FFFDF6',
    borderRadius: scale(8),
    overflow: 'hidden',
    position: 'relative',
  },
  backgroundPattern: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1,
    width: scale(100),
    height: '100%',
    opacity: 0.5,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 2,
    height: '100%',
  },
  imageContainer: {
    justifyContent: 'center',
    marginRight: scale(16),
  },
  image: {
    width: scale(50.4),
    height: verticalScale(72),
    borderTopLeftRadius: scale(1.87),
    borderTopRightRadius: scale(5.6),
    borderBottomRightRadius: scale(5.6),
    borderBottomLeftRadius: scale(1.87),
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: scale(4),
    width: '100%',
  },
  arrowBtn: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(36),
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    padding: scale(2),
    backgroundColor: colors.accent.accent200,
    marginLeft: scale(8),
  },
  title: {
    fontSize: scale(18),
    flex: 1,
  },
  authorPillContainer: {
    marginBottom: scale(8),
  },
  authorPill: {
    backgroundColor: '#FFECB3',
    paddingHorizontal: scale(8),
    paddingVertical: scale(2),
    borderRadius: scale(30),
    alignSelf: 'flex-start',
  },
  authorText: {
    fontSize: scale(10),
    textAlign: 'center',
  },
  description: {
    width: '100%',
    height: verticalScale(51),
    color: '#6B7280',
    fontSize: scale(12),
    lineHeight: scale(17),
  },
});

export default HadithInfoCard;
