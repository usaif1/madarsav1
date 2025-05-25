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
      
      // Perform Google Sign-In
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo inside google auth service', userInfo);
      
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
        deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
        loginWith: 'GOOGLE',
        password: '', // Empty for social logins
      };
      
      // Send data to authenticate endpoint
      console.log('Sending authenticate request for Google login:', JSON.stringify(authenticateData));
      const authResponse = await authService.authenticate(authenticateData);
      console.log('Received authenticate response:', JSON.stringify(authResponse));
      
      // Create user object from response
      const user: User = {
        id: authResponse.userId,
        email: authResponse.email || userData.email,
        name: `${userData.givenName || ''} ${userData.familyName || ''}`.trim(),
        photoUrl: userData.photo || undefined,
      };
      
      // Store login method
      storage.set('login_method', 'google');
      
      // Update auth state
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setIsAuthenticated(true);
      useAuthStore.getState().setIsSkippedLogin(false);
      useAuthStore.getState().setError(null);
      
      return true;
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