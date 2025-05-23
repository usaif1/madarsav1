import {Pressable} from 'react-native';
import React from 'react';

// assets
import LogoutMadarsa from '@/assets/logout.svg';

// store
import { useAuthStore } from '@/modules/auth/store/authStore';
import tokenService from '@/modules/auth/services/tokenService';
import { mmkvStorage } from '@/modules/auth/storage/mmkvStorage';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

// Auth services
import { signOutFromGoogle, isGoogleSignedIn } from '@/modules/auth/services/googleAuthService';
import { logoutFromFacebook, isFacebookLoggedIn } from '@/modules/auth/services/facebookAuthService';

const LogoutButton = () => {
  const resetAuthStore = useAuthStore((state) => state.resetAuthStore);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsSkippedLogin = useAuthStore((state) => state.setIsSkippedLogin);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();

  const logOut = async () => {
    try {
      console.log('Starting logout process...');
      
      // Check which auth method was used and logout accordingly
      const isGoogleAuth = await isGoogleSignedIn();
      const isFacebookAuth = await isFacebookLoggedIn();
      
      console.log('Auth status - Google:', isGoogleAuth, 'Facebook:', isFacebookAuth);
      
      // Logout from specific providers if logged in
      if (isGoogleAuth) {
        console.log('Logging out from Google...');
        await signOutFromGoogle();
      }
      
      if (isFacebookAuth) {
        console.log('Logging out from Facebook...');
        await logoutFromFacebook();
      }
      
      // Always clear tokens regardless of auth method
      console.log('Clearing tokens...');
      await tokenService.clearTokens();
      
      // Clear MMKV storage
      console.log('Clearing storage...');
      try {
        mmkvStorage.removeItem('auth-storage');
        mmkvStorage.removeItem('device_id');
        mmkvStorage.removeItem('onboarded');
        // Add any other known keys here
      } catch (e) {
        console.warn('Error clearing MMKV storage:', e);
      }
      
      // Reset auth state
      console.log('Resetting auth state...');
      resetAuthStore();
      setUser(null);
      setIsAuthenticated(false);
      setIsSkippedLogin(false);
      
      console.log('Logout successful');
      
      // Uncomment this if you want to navigate back to auth screen after logout
      // navigation.reset({
      //   index: 0,
      //   routes: [{ name: 'auth' }],
      // });
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Failed', 'Could not log out properly. Please try again.');
    }
  }


  return (
    <Pressable onPress={logOut}>
      <LogoutMadarsa />
    </Pressable>
  );
};

export default LogoutButton;
