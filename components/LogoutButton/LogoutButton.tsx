import {Pressable} from 'react-native';
import React, {useState} from 'react';

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

// Components
import LogoutModal from '@/components/LogoutModal';

const LogoutButton = () => {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

      // Navigate directly to SplashScreen2 using our navigation utility
      // navigationUtils.navigateToSplashScreen2();
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Failed', 'Could not log out properly. Please try again.');
    }
  }


  return (
    <>
      <Pressable onPress={() => setShowLogoutModal(true)}>
        <LogoutMadarsa />
      </Pressable>
      
      <LogoutModal 
        isVisible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onLogout={() => {
          setShowLogoutModal(false);
          logOut();
        }}
      />
    </>  
  );
};

export default LogoutButton;
