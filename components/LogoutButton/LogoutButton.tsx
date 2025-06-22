import {Pressable, Alert} from 'react-native';
import React, {useState} from 'react';

// assets
import { CdnSvg } from '@/components/CdnSvg';

// store
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Navigation types
type RootStackParamList = {
  SplashScreen2: undefined;
  [key: string]: undefined | object;
};

// Auth services
import googleAuthService, { signOutFromGoogle, isGoogleSignedIn } from '@/modules/auth/services/googleAuthService';
import { logoutFromFacebook, isFacebookLoggedIn } from '@/modules/auth/services/facebookAuthService';
import authService from '@/modules/auth/services/authService';

// Components
import LogoutModal from '@/components/LogoutModal';

const LogoutMadarsa = () => (
  <CdnSvg 
    path="/assets/logout.svg" 
    width={24} 
    height={24} 
  />
);

const LogoutButton = () => {
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const logOut = async () => {
    try {
      console.log('Starting logout process...');
      
      // First, configure Google client to ensure it's ready
      await googleAuthService.configureGoogleSignIn();
      
      // Then check auth methods
      const isGoogleAuth = await isGoogleSignedIn();
      const isFacebookAuth = await isFacebookLoggedIn();
      
      console.log('Auth status - Google:', isGoogleAuth, 'Facebook:', isFacebookAuth);
      
      // First clear tokens and auth state
      await authService.logOutByDeletingTokens();
      
      // Then sign out from providers if needed
      if (isGoogleAuth) {
        console.log('Logging out from Google...');
        await signOutFromGoogle();
      }
      
      if (isFacebookAuth) {
        console.log('Logging out from Facebook...');
        await logoutFromFacebook();
      }
      
      // Navigate to SplashScreen2
      navigation.reset({
        index: 0,
        routes: [{ name: 'SplashScreen2' }],
      });
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
