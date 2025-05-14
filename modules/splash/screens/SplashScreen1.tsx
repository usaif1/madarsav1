// modules/splash/screens/SplashScreen1.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/modules/auth/store/authStore';
import tokenService from '@/modules/auth/services/tokenService';
import authService from '@/modules/auth/services/authService';
import { isGoogleSignedIn } from '@/modules/auth/services/googleAuthService';
import skipLoginService from '@/modules/auth/services/skipLoginService';
import { useGlobalStore } from '@/globalStore';

const SplashScreen1: React.FC = () => {
  const navigation = useNavigation();
  const { setUser, setIsAuthenticated, setIsSkippedLogin } = useAuthStore();
  const { setOnboarded } = useGlobalStore();
  
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
        if (isGoogleSignIn) {
          try {
            // Trigger Google sign in to get fresh tokens
            const success = await useAuthStore.getState().loginWithGoogle();
            if (success) {
              setOnboarded(true);
              return;
            }
          } catch (error) {
            console.error('Google sign in failed:', error);
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
        navigation.navigate('SplashScreen2' as never);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigation.navigate('SplashScreen2' as never);
      }
    };
    
    checkAuth();
  }, [navigation, setUser, setIsAuthenticated, setIsSkippedLogin, setOnboarded]);
  
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#8A57DC" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default SplashScreen1;