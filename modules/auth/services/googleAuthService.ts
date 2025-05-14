// modules/auth/services/googleAuthService.ts
import {
    GoogleSignin,
    statusCodes,
    User as GoogleUser,
  } from '@react-native-google-signin/google-signin';
  import { useAuthStore } from '../store/authStore';
  import authService from './authService';
  import tokenService from './tokenService';
  import { useErrorStore } from '@/modules/error/store/errorStore';
  import { ErrorType } from '@/api/utils/errorHandling';
  
  // Configure Google Sign-In
  export const configureGoogleSignIn = () => {
    GoogleSignin.configure({
      // Get this from Google Cloud Console
      webClientId: 'YOUR_WEB_CLIENT_ID_HERE',
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
      
      // Extract ID token
      const idToken = userInfo.idToken;
      if (!idToken) {
        throw new Error('No ID token received from Google');
      }
      
      // Send ID token to backend for verification
      const authResponse = await authService.loginWithGoogle(idToken);
      
      // Store tokens securely
      await tokenService.storeTokens({
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken,
      });
      
      // Update auth state
      useAuthStore.getState().setUser(authResponse.user);
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