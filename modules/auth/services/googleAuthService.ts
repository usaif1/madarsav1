// modules/auth/services/googleAuthService.ts
import {
    GoogleSignin,
    statusCodes,
    User as GoogleUser,
  } from '@react-native-google-signin/google-signin';
  import { useAuthStore, User } from '../store/authStore';
  import authService, { AuthenticateRequest } from './authService';
  import tokenService from './tokenService';
  import { useErrorStore } from '@/modules/error/store/errorStore';
  import { ErrorType } from '@/api/utils/errorHandling';
  import { Platform } from 'react-native';
  import { storage } from '../storage/mmkvStorage';
  import DeviceInfo from 'react-native-device-info';
  
  // Configure Google Sign-In
  export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      // Get this from Google Cloud Console
      webClientId: '195416187581-qpimoedkpn9ar93kf13sss1ape1s8lv4.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  };
  
  // Check if user is already signed in with Google
  export const isGoogleSignedIn = async (): Promise<boolean> => {
    try {
      return await GoogleSignin.hasPreviousSignIn();
    } catch (error) {
      console.error('Failed to check Google sign-in status:', error);
      return false;
    }
  };
  
  // Get current Google user
  export const getCurrentGoogleUser = async (): Promise<GoogleUser | null> => {
    try {
      return await GoogleSignin.getCurrentUser();
    } catch (error) {
      console.error('Failed to get current Google user:', error);
      return null;
    }
  };
  
  // Sign in with Google
  export const signInWithGoogle = async (): Promise<boolean> => {
    try {
      // Set loading state
      useAuthStore.getState().setIsLoading(true);
      
      // Check if Google Play Services are available
      await GoogleSignin.hasPlayServices();
      
      // Get device info
      const deviceId = await DeviceInfo.getUniqueId();
      const deviceToken = await DeviceInfo.getInstanceId() || deviceId; // Fallback to device ID if instance ID not available
      
      // Get location data from storage if available
      const latitude = parseFloat(storage.getString('user_latitude') || '0');
      const longitude = parseFloat(storage.getString('user_longitude') || '0');
      const city = storage.getString('user_city') || '';
      const country = storage.getString('user_country') || '';
      
      // Perform Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      console.log('Google user info:', JSON.stringify(userInfo, null, 2));
      
      // Extract ID token and user info
      const idToken = userInfo.data?.idToken;
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }
      
      // Get user data from Google response
      const userData = userInfo.data?.user;
      if (!userData) {
        throw new Error('No user data received from Google');
      }
      
      // Prepare data for authenticate endpoint
      const authenticateData: AuthenticateRequest = {
        email: userData.email,
        firstName: userData.givenName || userData.name?.split(' ')[0] || '',
        lastName: userData.familyName || userData.name?.split(' ').slice(1).join(' ') || '',
        profileImage: userData.photo || undefined, // Convert null to undefined if needed
        profileId: userData.id,
        userId: idToken, // Send Google ID token as userId as requested
        deviceId: deviceId,
        deviceToken: deviceToken,
        deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
        loginWith: 'GOOGLE',
        password: '', // Empty for social logins
        city: city,
        country: country,
        latitude: latitude,
        longitude: longitude,
      };
      
      // Send data to authenticate endpoint with detailed logging
      console.log(' SENDING GOOGLE AUTH REQUEST:', JSON.stringify(authenticateData, null, 2));
      
      try {
        const authResponse = await authService.authenticate(authenticateData);
        console.log(' RECEIVED GOOGLE AUTH RESPONSE:', JSON.stringify(authResponse, null, 2));
        
        // Create user object from response
        const user: User = {
          id: authResponse.userId || userData.id,
          email: authResponse.email || userData.email,
          name: `${userData.givenName || ''} ${userData.familyName || ''}`.trim(),
          photoUrl: userData.photo || undefined,
        };
        
        // Store login method and token
        storage.set('login_method', 'google');
        storage.set('google_token', idToken);
        
        // Update auth state
        useAuthStore.getState().setUser(user);
        useAuthStore.getState().setIsAuthenticated(true);
        useAuthStore.getState().setIsSkippedLogin(false);
        useAuthStore.getState().setError(null);
        
        return true;
      } catch (error: any) {
        console.error(' GOOGLE AUTH ERROR:', error.response?.data || error.message || error);
        throw error;
      }
    } catch (error: any) {
      // Handle specific Google Sign-In errors
      let errorMessage = 'Google sign-in failed';
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        errorMessage = 'Sign in was cancelled';
      } else if (error.code === statusCodes.IN_PROGRESS) {
        errorMessage = 'Sign in is already in progress';
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        errorMessage = 'Google Play Services are not available';
      } else {
        errorMessage = error.message || 'Google sign-in failed';
      }
      
      // Update error state
      useAuthStore.getState().setError(errorMessage);
      useErrorStore.getState().addError({
        type: ErrorType.AUTH,
        message: errorMessage,
        details: error,
      });
      
      return false;
    } finally {
      // Reset loading state
      useAuthStore.getState().setIsLoading(false);
    }
  };
  
  // Sign out from Google
  export const signOutFromGoogle = async (): Promise<void> => {
    try {
      const isSignedIn = await GoogleSignin.hasPreviousSignIn();
      if (isSignedIn) {
        await GoogleSignin.signOut();
      }
    } catch (error) {
      console.error('Failed to sign out from Google:', error);
    }
  };
  
  export default {
    configureGoogleSignIn,
    isGoogleSignedIn,
    getCurrentGoogleUser,
    signInWithGoogle,
    signOutFromGoogle,
  };