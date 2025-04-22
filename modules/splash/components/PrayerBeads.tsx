// dependencies
import {Dimensions, StyleSheet, View} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';

// assets
import PrayerBeadsText from '@/assets/splash/prayer_beads_text.svg';
import MarblePath from '@/assets/splash/marble_path.svg';

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
        <PrayerBeadsText />

        <FastImage
          source={require('@/assets/splash/marble.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={[
            styles.marble,
            {
              top: 120,
              left: -13,
              zIndex: 0,
            },
          ]}
        />
        <FastImage
          source={require('@/assets/splash/marble.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={[
            styles.marble,
            {
              top: 103,
              left: 19,
              zIndex: 1,
            },
          ]}
        />
        <FastImage
          source={require('@/assets/splash/marble.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={[
            styles.marble,
            {
              top: 82.5,
              left: 87,
              zIndex: 1,
            },
          ]}
        />
        <FastImage
          source={require('@/assets/splash/marble.png')}
          resizeMode={FastImage.resizeMode.cover}
          style={[
            styles.marble,
            {
              top: 74.5,
              left: 124,
              zIndex: 0,
            },
          ]}
        />
        <MarblePath style={styles.marblePath} />
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
    top: 95.5,
    zIndex: 0,
  },
});
