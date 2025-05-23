import {Pressable} from 'react-native';
import React from 'react';

// assets
import LogoutMadarsa from '@/assets/logout.svg';

// store
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

// Auth services
import { signOutFromGoogle, isGoogleSignedIn } from '@/modules/auth/services/googleAuthService';
import { logoutFromFacebook, isFacebookLoggedIn } from '@/modules/auth/services/facebookAuthService';
import authService from '@/modules/auth/services/authService';

const LogoutButton = () => {
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

      authService.logOutByDeletingTokens();

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
