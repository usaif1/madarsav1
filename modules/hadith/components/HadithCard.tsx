import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Bold, CaptionMedium, Body1Title2Medium } from '@/components/Typography/Typography';
import FastImage from 'react-native-fast-image';

export interface HadithCardProps {
  hadith: {
    id: number;
    title: string;
    author: string;
    image: string;
    brief: string;
  };
  onPress: () => void;
}

const HadithCard: React.FC<HadithCardProps> = ({ hadith, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Top portion with image */}
      <View style={styles.topPortion}>
        <FastImage source={{ uri: hadith.image }} style={styles.image} />
      </View>
      
      {/* Bottom portion with text */}
      <View style={styles.bottomPortion}>
        <Body1Title2Bold style={[styles.title, { color: '#1F2937' }]}>
          {hadith.title}
        </Body1Title2Bold>
        
        <View style={styles.authorPill}>
          <Body1Title2Medium style={[styles.authorText, { color: '#B45309' }]}>
            {hadith.author}
          </Body1Title2Medium>
        </View>
        
        <CaptionMedium style={styles.brief} color="sub-heading" numberOfLines={2}>
          {hadith.brief}
        </CaptionMedium>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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
    width: scale(110),
    height: verticalScale(130),
    borderRadius: scale(8),
  },
  title: {
    fontSize: scale(14),
    textAlign: 'center',
  },
  authorPill: {
    width: scale(86),
    height: verticalScale(18),
    paddingTop: scale(2),
    paddingRight: scale(8),
    paddingBottom: scale(2),
    paddingLeft: scale(8),
    borderRadius: scale(29),
    backgroundColor: '#FFECB3', // accent-yellow200
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  authorText: {
    fontSize: scale(10),
  },
  brief: {
    fontSize: scale(10),
    textAlign: 'center',
  },
});

export default HadithCard;
