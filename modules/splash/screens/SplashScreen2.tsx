// dependencies
import React from 'react';
import {Pressable, StyleSheet, View} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

// assets
import FacebookLogin from '@/assets/splash/facebook_login.svg';
import GoogleLogin from '@/assets/splash/google_login.svg';

// components
import Carousel from '../components/Carousel';
import {Body1Title2Bold, Body1Title2Medium, Divider} from '@/components';

// store
import {useThemeStore} from '@/globalStore';
import {useGlobalStore} from '@/globalStore';

const SplashPrimary: React.FC = () => {
  const {colors} = useThemeStore();
  const {setOnboarded} = useGlobalStore();

  const {bottom} = useSafeAreaInsets();

  console.log('bottom', bottom);

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

        <View style={{width: '100%', paddingBottom: 20}}>
          <Pressable
            style={[
              styles.btn,
              {backgroundColor: colors.secondary.neutral950},
            ]}>
            <GoogleLogin />
            <Body1Title2Bold color="white">
              Continue with Google
            </Body1Title2Bold>
          </Pressable>
          <Divider height={8} />
          <Pressable style={[styles.btn, {backgroundColor: '#F5F5F5'}]}>
            <FacebookLogin />
            <Body1Title2Medium color="heading">
              Continue with Facebook
            </Body1Title2Medium>
          </Pressable>
          <Divider height={8} />
          <Pressable
            onPress={() => {
              setOnboarded(true);
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Body1Title2Medium>Skip this Step</Body1Title2Medium>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashPrimary;

const styles = StyleSheet.create({
  btn: {
    borderRadius: 100,
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    columnGap: 6,
  },
});
