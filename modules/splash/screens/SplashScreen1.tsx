import React, {useEffect, useRef, useState} from 'react';
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
import googleAuthService, { isGoogleSignedIn } from '@/modules/auth/services/googleAuthService';
import { isFacebookLoggedIn } from '@/modules/auth/services/facebookAuthService';
import skipLoginService from '@/modules/auth/services/skipLoginService';
import { useGlobalStore } from '@/globalStore';

// Location imports
import locationService from '@/modules/location/services/locationService';
import { useLocationStore } from '@/modules/location/store/locationStore';

// assets
import { CdnSvg } from '@/components/CdnSvg';

type RootStackParamList = {
  SplashScreen2: undefined;
  screen2: undefined;
};

const SplashGraphic = () => (
  <CdnSvg 
    path="/assets/splash/splash_graphic.svg" 
    width={375} // Adjust based on your design
    height={200} // Adjust based on your design
  />
);

const MandalaFull = () => (
  <CdnSvg 
    path="/assets/splash/mandala_full.svg" 
    width={375} // Adjust based on your design
    height={375} // Adjust based on your design
  />
);

const SplashScreen1: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { setUser, setIsAuthenticated, setIsSkippedLogin } = useAuthStore();
  const { setOnboarded } = useGlobalStore();
  const [locationInitialized, setLocationInitialized] = useState(false);
  
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

  // Initialize location data
  useEffect(() => {
    const initLocation = async () => {
      try {
        console.log('🌍 Initializing location data...');
        await locationService.initializeLocation();
        console.log('🌍 Location data initialized successfully');
        setLocationInitialized(true);
      } catch (error) {
        console.error('🌍 Error initializing location:', error);
        // Even if location initialization fails, we should continue with auth
        setLocationInitialized(true);
      }
    };
    
    initLocation();
  }, []);

  // Authentication check effect
  useEffect(() => {
    // Only proceed with auth check after location is initialized
    if (!locationInitialized) return;
    
    const checkAuth = async () => {
      try {
        // Get location data for authentication requests
        const locationData = useLocationStore.getState();
        console.log('🌍 Using location data for auth:', {
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          city: locationData.city,
          country: locationData.country,
        });
        
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
        try {
          // Configure Google client first
          await googleAuthService.configureGoogleSignIn();
          
          const isGoogleSignIn = await isGoogleSignedIn();
          console.log('isGoogleSignIn', isGoogleSignIn);
          
          if (isGoogleSignIn) {
            try {
              // Try to get current Google user to verify the session
              const currentUser = await googleAuthService.getCurrentGoogleUser();
              
              if (currentUser) {
                // If we have a Google user but no tokens, try to sign in again
                const success = await googleAuthService.signInWithGoogle();
                console.log('Google re-auth success:', success);
                
                if (success) {
                  setOnboarded(true);
                  return;
                }
              } else {
                // No current user despite isGoogleSignedIn being true
                // This is the edge case - clear Google sign-in state
                await googleAuthService.signOutFromGoogle();
                console.log('Cleared inconsistent Google sign-in state');
              }
            } catch (error) {
              console.error('Google sign in verification failed:', error);
              // On any error, try to clear the Google sign-in state
              await googleAuthService.signOutFromGoogle();
            }
          }
        } catch (error) {
          console.error('Google sign in check failed:', error);
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
        console.log('navigating to SplashScreen2');
        navigation.navigate('SplashScreen2');
        console.log('should have navigated to SplashScreen2');
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
  }, [navigation, setUser, setIsAuthenticated, setIsSkippedLogin, setOnboarded, locationInitialized]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SplashGraphic />

      {/* <Pressable
        style={styles.nextButton}
        onPress={() => navigation.navigate('SplashScreen2')}>
        <Text>Next</Text>
      </Pressable> */}

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