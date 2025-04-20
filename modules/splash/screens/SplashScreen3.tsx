// dependencies
import {Pressable, Text, View} from 'react-native';
import React from 'react';

// assets
import GoogleLogin from '@/assets/splash/google_login.svg';
import FacebookLogin from '@/assets/splash/facebook_login.svg';
import Carousel from '../components/Carousel';

import {SafeAreaView} from 'react-native-safe-area-context';

const SplashPrimary: React.FC = () => {
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

        <View style={{height: 140}} />
        <View style={{width: '100%'}}>
          <Pressable
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
