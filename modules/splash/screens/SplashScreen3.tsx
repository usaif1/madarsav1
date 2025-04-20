// dependencies
import {Pressable, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';

// assets
// import SpiritualCompanionGraphic from '../../../assets/splash/spiritual_companion_graphic.svg';
import GoogleLogin from '../../../assets/splash/google_login.svg';
import FacebookLogin from '../../../assets/splash/facebook_login.svg';
import Carousel from '../components/Carousel';

import {SafeAreaView} from 'react-native-safe-area-context';

const carousel = [
  {
    id: 0,
    title: 'Your Spiritual Companion',
    label:
      'Your Complete Islamic Worship App: Quran, Hadith, Prayer Times, Qibla, Zakat, Tasbih and Spiritual Tools—All in One Place.',
  },
  {
    id: 1,
    title: 'Nourish Your Soul',
    label:
      'Spiritual Healing at Your Fingertips Dua, Galleries, Mood Tracking—Your Divine Path to Inner Peace.',
  },
  {
    id: 2,
    title: 'Combining Deen & Dunya',
    label:
      'Modern tech education rooted in Islamic principles—coding, design, and business skills taught within a traditional Maktab framework.',
  },
];

const SplashPrimary: React.FC = () => {
  const navigation = useNavigation();

  const [currentState, setCurrentState] = useState<number>(0);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 27,
          alignItems: 'center',
        }}>
        <View style={{height: 33}} />
        <Carousel />

        {/* <View
          style={{width: '100%', height: 321, backgroundColor: '#411B7F'}}
        /> */}

        <View style={{height: 140}} />
        <View style={{width: '100%'}}>
          <Pressable
            onPress={() => {
              setCurrentState(prev => prev + 1);
            }}
            style={{
              backgroundColor: '#0A0A0A',
              borderRadius: 100,
              height: 40,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              columnGap: 6,
            }}>
            <GoogleLogin />
            <Text style={{color: 'white', fontSize: 17, fontWeight: 500}}>
              Continue with Google
            </Text>
          </Pressable>
          <View style={{height: 8}} />
          <Pressable
            onPress={() => {
              setCurrentState(prev => prev - 1);
            }}
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 100,
              height: 40,
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              columnGap: 6,
            }}>
            <FacebookLogin />
            <Text style={{color: '#171717', fontSize: 17, fontWeight: 500}}>
              Continue with Facebook
            </Text>
          </Pressable>
          <View style={{height: 8}} />
          <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={{color: '#171717', fontSize: 17, fontWeight: 500}}>
              Skip this Step
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashPrimary;
