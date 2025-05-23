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

const LogoutButton = () => {
  const resetAuthStore = useAuthStore((state) => state.resetAuthStore);
  const setUser = useAuthStore((state) => state.setUser);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);
  const setIsSkippedLogin = useAuthStore((state) => state.setIsSkippedLogin);
  const user = useAuthStore((state) => state.user);
  const navigation = useNavigation();

  const logOut = async () => {
    try{
      // Keep the logout functionality for now (commented out)
            // Uncomment this if you want to enable logout again
            
            // Use the proper logout function from auth store
            // This will clear tokens from secure storage
            await tokenService.clearTokens();
            
            // Clear MMKV storage - use available methods
            // Loop through all known keys and remove them
            try {
              mmkvStorage.removeItem('auth-storage');
              mmkvStorage.removeItem('device_id');
              mmkvStorage.removeItem('onboarded');
              // Add any other known keys here
            } catch (e) {
              console.warn('Error clearing MMKV storage:', e);
            }
            
            // Reset all auth state
            resetAuthStore();
            setUser(null);
            setIsAuthenticated(false);
            setIsSkippedLogin(false);

            // navigation.reset({
            //   index: 0,
            //   routes: [{ name: 'auth' }],
            // });
            
            console.log('Logout successful');
    }
    catch(error){
      console.log('Logout failed:', error);
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
