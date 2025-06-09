// dependencies
import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

// assets
import { CdnSvg } from '@/components/CdnSvg';
import { scale } from '@/theme/responsive';
import { Title1Regular } from '@/components';

const {height} = Dimensions.get('window');

const PrayerBeads = () => {
  return (
    <LinearGradient
      colors={['#FEFAEC', '#FCEFC7']}
      style={{borderRadius: 16, flex: 1}}>
      <View
        style={{
          paddingTop: 16,
          paddingHorizontal: 16,
          height: height * 0.2,
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 16,
          borderWidth: 1,
          borderColor: '#F5F5F5',
        }}>
        <View style={{alignItems: 'flex-end',left: scale(12)}}><CdnSvg path="/assets/splash/prayer_beads_text.svg" width={scale(200)} height={scale(40)} /></View>

        <FastImage
          source={require('@/assets/splash/marble.png')}
          resizeMode={FastImage.resizeMode.contain}
          style={[
            styles.marble,
            {
              top: 140,
              left: -20,
              zIndex: 0,
              height: scale(44),
              width: scale(44),
            },
          ]}
        />
        <FastImage
          source={require('@/assets/splash/marble.png')}
          resizeMode={FastImage.resizeMode.contain}
          style={[
            styles.marble,
            {
              top: 120,
              left: 24,
              zIndex: 1,
              height: scale(44),
              width: scale(44),
            },
          ]}
        />
        <FastImage
          source={require('@/assets/splash/marble.png')}
          resizeMode={FastImage.resizeMode.contain}
          style={[
            styles.marble,
            {
              top: 90,
              left: 110,
              zIndex: 1,
              height: scale(44),
              width: scale(44),
            },
          ]}
        />
        <FastImage
          source={require('@/assets/splash/marble.png')}
          resizeMode={FastImage.resizeMode.contain}
          style={[
            styles.marble,
            {
              top: 74.5,
              left: 156,
              zIndex: 0,
              height: scale(44),
              width: scale(44),
            },
          ]}
        />
        <CdnSvg path="/assets/splash/marble_path.svg" width={scale(100)} height={scale(50)} style={styles.marblePath} />

        <Title1Regular style={{fontSize: scale(17),position: 'absolute',top: scale(120),left: '55%',zIndex: 1}}>+1</Title1Regular>
      </View>
    </LinearGradient>
  );
};

export default PrayerBeads;

const styles = StyleSheet.create({
  marble: {
    width: 38.75,
    height: 38.75,
    position: 'absolute',
  },

  marblePath: {
    position: 'absolute',
    top: 120,
    zIndex: 0,
    transform: [{rotate: '-8deg'}],
  },
});
