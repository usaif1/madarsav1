import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { scale, verticalScale } from '@/theme/responsive';
import { Body1Title2Bold, Body1Title2Medium, H5Bold } from '@/components';
import LinearGradient from 'react-native-linear-gradient';
import { CdnSvg } from '@/components/CdnSvg';

const SplashDuaCard = () => {
  // Using the first dua from the fallback data
  const dua = {
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلاً مُتَقَبَّلاً",
    translation: "O Allah, I ask You for knowledge that is of benefit, a good provision, and deeds that will be accepted.",
    reference: "Ibn Majah",
    referenceVerse: "925",
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FEFAEC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1.1152 }}
      style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Arabic text with bubble number */}
        <View style={styles.arabicRow}>
          <H5Bold color='heading' style={styles.arabicText}>
            {dua.arabic}
          </H5Bold>
          <View style={styles.bubbleWrap}>
            <Body1Title2Bold style={styles.bubbleNum}>
              1
            </Body1Title2Bold>
          </View>
        </View>
        
        {/* Translation section */}
        <View style={styles.translationContainer}>
          <Body1Title2Bold style={styles.translationTitle}>Translation</Body1Title2Bold>
          <Body1Title2Medium style={styles.translationText}>
            {dua.translation}
          </Body1Title2Medium>
        </View>
        
        {/* Footer with reference */}
        <View style={styles.footerContainer}>
          <View style={styles.referenceContainer}>
            <Body1Title2Medium style={styles.referenceText}>{dua.reference}</Body1Title2Medium>
            <View style={styles.dot} />
            <Body1Title2Medium style={styles.referenceText}>{dua.referenceVerse}</Body1Title2Medium>
          </View>
          <View style={styles.actionsContainer}>
                    <View 
                      style={styles.actionButton}
                    >
                       <CdnSvg path="/assets/hadith/bookmark.svg" width={16} height={16} />
                    </View>
                    <View 
                      style={styles.actionButton}
                    >
                      <CdnSvg path="/assets/hadith/share_alt.svg" width={16} height={16} />
                    </View>
                  </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: scale(321),
    // height: verticalScale(186.968), // Removed for dynamic height
    paddingTop: scale(22),
    paddingBottom: scale(12),
    gap: scale(14),
    borderRadius: scale(13.7),
    borderWidth: scale(0.68),
    borderColor: '#E5E5E5',
  },
  innerContainer: {
    width: '100%', // Changed from scale(322) to fit parent
    // height: verticalScale(162), // Removed for dynamic height
    paddingRight: scale(18),
    paddingLeft: scale(18),
    gap: scale(8),
  },
  arabicRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  arabicText: {
    flex: 1,
    fontSize: scale(18),
    lineHeight: scale(28),
    textAlign: 'right',
    color: '#171717',
    letterSpacing: scale(0.5),
  },
  bubbleWrap: {
    position: 'relative',
    width: scale(26),
    height: scale(26),
    marginLeft: scale(12),
    backgroundColor: '#fffaeb',
    borderRadius: scale(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubbleNum: {
    position: 'absolute',
    top: '50%',
    left: '55%',
    transform: [{ translateX: -6 }, { translateY: -9 }],
    color: '#877d58',
    fontSize: scale(12),
  },
  transliterationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  purpleLine: {
    width: scale(3),
    height: '100%',
    backgroundColor: '#8A57DC',
    marginRight: scale(8),
    borderRadius: scale(2),
  },
  transliterationText: {
    flex: 1,
    fontSize: scale(12),
    lineHeight: scale(20),
    color: '#525252',
  },
  translationContainer: {
    marginTop: scale(4),
  },
  translationTitle: {
    fontSize: scale(14),
    marginBottom: scale(4),
    color: '#0A0A0A',
  },
  translationText: {
    fontSize: scale(12),
    lineHeight: scale(20),
    color: '#404040',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(6),
  },
  referenceText: {
    fontSize: scale(12),
    color: '#6B7280',
  },
  dot: {
    width: scale(5),
    height: scale(5),
    backgroundColor: '#D4D4D4',
    borderRadius: scale(5),
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashDuaCard;
