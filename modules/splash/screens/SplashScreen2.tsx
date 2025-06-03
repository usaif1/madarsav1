// modules/splash/screens/SplashScreen2.tsx
import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, View, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParentStackParamList } from '@/navigator/ParentNavigator';

// assets
import FacebookLogin from '@/assets/splash/facebook_login.svg';
import GoogleLogin from '@/assets/splash/google_login.svg';

// components
import Carousel from '../components/Carousel';
import { Body1Title2Bold, Body1Title2Medium, Divider } from '@/components';

// store
import { useThemeStore } from '@/globalStore';
import { useGlobalStore } from '@/globalStore';

// auth
import { useSocialAuth } from '@/modules/auth/hooks/useSocialAuth';
import { scale } from '@/theme/responsive';

const SplashPrimary: React.FC = () => {
  const { colors } = useThemeStore();
  const { setOnboarded } = useGlobalStore();
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation<NativeStackNavigationProp<ParentStackParamList>>();

  // Get social auth methods and loading state
  const { isLoading, signInWithGoogle, loginWithFacebook, skipLogin } = useSocialAuth();
  
  // Track which button is loading
  const [loadingButton, setLoadingButton] = useState<'google' | 'facebook' | 'skip' | null>(null);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    setLoadingButton('google');
    const success = await signInWithGoogle();
    setLoadingButton(null);
    if (success) {
      setOnboarded(true);
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    setLoadingButton('facebook');
    const success = await loginWithFacebook();
    setLoadingButton(null);
    if (success) {
      setOnboarded(true);
    }
  };

  // Handle Skip Login
  const handleSkipLogin = async () => {
    setLoadingButton('skip');
    // Set the skipped login flag in the auth store
    await skipLogin();
    // Also set the onboarded flag to true to prevent returning to splash
    setOnboarded(true);
    setLoadingButton(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: 27,
          alignItems: 'center',
        }}>
        <View style={{ height: 33 }} />
        <Carousel />

        <View style={{width: '100%', paddingBottom: scale(36), rowGap: scale(2)}}>
          <Pressable
            onPress={handleGoogleSignIn}
            disabled={loadingButton !== null}
            style={[
              styles.btn,
              { backgroundColor: colors.secondary.neutral950 },
              loadingButton !== null && { opacity: 0.7 }
            ]}>
            {loadingButton === 'google' ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <GoogleLogin />
                <Body1Title2Bold color="white">
                  Continue with Google
                </Body1Title2Bold>
              </>
            )}
          </Pressable>
          <Divider height={8} />
          <Pressable 
            onPress={handleFacebookLogin}
            disabled={loadingButton !== null}
            style={[
              styles.btn, 
              { backgroundColor: '#F5F5F5' },
              loadingButton !== null && { opacity: 0.7 }
            ]}>
            {loadingButton === 'facebook' ? (
              <ActivityIndicator color="#000000" size="small" />
            ) : (
              <>
                <FacebookLogin />
                <Body1Title2Medium color="heading">
                  Continue with Facebook
                </Body1Title2Medium>
              </>
            )}
          </Pressable>
          <Divider height={16} />
          <Pressable
            onPress={handleSkipLogin}
            disabled={loadingButton !== null}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loadingButton !== null ? 0.7 : 1
            }}>
            {loadingButton === 'skip' ? (
              <ActivityIndicator color="#000000" size="small" />
            ) : (
              <Body1Title2Medium>Skip this Step</Body1Title2Medium>
            )}
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