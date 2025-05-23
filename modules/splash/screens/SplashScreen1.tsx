import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Pressable,
  StatusBar,
  Text,
  View,
  Easing,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Auth imports
import { useAuthStore } from '@/modules/auth/store/authStore';
import tokenService from '@/modules/auth/services/tokenService';
import authService from '@/modules/auth/services/authService';
import { isGoogleSignedIn } from '@/modules/auth/services/googleAuthService';
import { isFacebookLoggedIn } from '@/modules/auth/services/facebookAuthService';
import skipLoginService from '@/modules/auth/services/skipLoginService';
import { useGlobalStore } from '@/globalStore';

// assets
import SplashGraphic from '@/assets/splash/splash_graphic.svg';
import MandalaFull from '@/assets/splash/mandala_full.svg';

type RootStackParamList = {
  SplashScreen2: undefined;
  screen2: undefined;
};

const SplashScreen1: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUser, setIsAuthenticated, setIsSkippedLogin } = useAuthStore();
  const { setOnboarded } = useGlobalStore();

  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 50000, // 👈 10s per full rotation (slow and steady)
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotateAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Authentication check effect
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check for stored tokens
        const tokens = await tokenService.getTokens();
        
        if (tokens) {
          try {
            // Try to get user profile with stored tokens
            const user = await authService.getUserProfile();
            
            // If successful, set authenticated state
            setUser(user);
            setIsAuthenticated(true);
            setOnboarded(true);
            return;
          } catch (error) {
            // If token is invalid, try to refresh
            try {
              const refreshed = await useAuthStore.getState().refreshTokens();
              
              if (refreshed) {
                // If refresh successful, get user profile again
                const user = await authService.getUserProfile();
                setUser(user);
                setIsAuthenticated(true);
                setOnboarded(true);
                return;
              }
            } catch (refreshError) {
              // If refresh fails, continue to check other auth methods
              console.error('Token refresh failed:', refreshError);
            }
          }
        }
        
        // Check if user is signed in with Google
        const isGoogleSignIn = await isGoogleSignedIn();
        console.log('isGoogleSignIn', isGoogleSignIn);
        if (isGoogleSignIn) {
          try {
            // Trigger Google sign in to get fresh tokens
            // const success = await useAuthStore.getState().loginWithGoogle();
            const success = true;
            console.log('success', success);
            if (success) {
              setOnboarded(true);
              return;
            }
          } catch (error) {
            console.error('Google sign in failed:', error);
          }
        }
        
        // Check if user is signed in with Facebook
        const isFacebookSignIn = await isFacebookLoggedIn();
        console.log('isFacebookSignIn', isFacebookSignIn);
        if (isFacebookSignIn) {
          try {
            // Trigger Facebook sign in to get fresh tokens
            const success = true; // We're assuming success here like with Google
            console.log('Facebook login success', success);
            if (success) {
              setOnboarded(true);
              return;
            }
          } catch (error) {
            console.error('Facebook sign in failed:', error);
          }
        }
        
        // Check if device has skipped login before
        const hasSkippedBefore = skipLoginService.isSkippedLoginDevice();
        if (hasSkippedBefore) {
          setIsSkippedLogin(true);
          setOnboarded(true);
          return;
        }
        
        // If no auth method worked, navigate to splash screen 2
        navigation.navigate('SplashScreen2');
      } catch (error) {
        console.error('Auth check failed:', error);
        navigation.navigate('SplashScreen2');
      }
    };
    
    // Start authentication check after animation has had a chance to start
    const timer = setTimeout(() => {
      checkAuth();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [navigation, setUser, setIsAuthenticated, setIsSkippedLogin, setOnboarded]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SplashGraphic />

      <Pressable
        style={styles.nextButton}
        onPress={() => navigation.navigate('SplashScreen2')}>
        <Text>Next</Text>
      </Pressable>

      <Animated.View
        style={[
          styles.mandalaWrapper,
          {
            transform: [{translateY: 150}, {rotate: rotateInterpolate}],
          },
        ]}>
        <MandalaFull />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#411B7F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  nextButton: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  mandalaWrapper: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
});

export default SplashScreen1;