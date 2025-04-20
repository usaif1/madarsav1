// dependencies
import {View, Text} from 'react-native';
import React from 'react';
import LinearGradient from 'react-native-linear-gradient';

// assets
import PrayerBeadsText from '@/assets/splash/prayer_beads_text.svg';

const PrayerBeads = () => {
  return (
    <LinearGradient colors={['#FEFAEC', '#FCEFC7']}>
      <View style={{paddingTop: 16, paddingHorizontal: 16}}>
        <PrayerBeadsText />
      </View>
    </LinearGradient>
  );
};

export default PrayerBeads;
