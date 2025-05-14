// modules/auth/services/facebookAuthService.ts
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import { useAuthStore } from '../store/authStore';
import authService from './authService';
import tokenService from './tokenService';
import { useErrorStore } from '@/modules/error/store/errorStore';
import { ErrorType } from '@/api/utils/errorHandling';

// Configure Facebook SDK
export const configureFacebookSDK = () => {
  // Facebook SDK is configured automatically when imported
  // Additional configuration can be added here if needed
};

// Check if user is already logged in with Facebook
export const isFacebookLoggedIn = async (): Promise<boolean> => {
  try {
    const data = await AccessToken.getCurrentAccessToken();
    return data !== null;
  } catch (error) {
    console.error('Failed to check Facebook login status:', error);
    return false;
  }
};

// Get current Facebook user profile
export const getCurrentFacebookProfile = async (): Promise<Profile | null> => {
  try {
    const currentProfile = await Profile.getCurrentProfile();
    return currentProfile;
  } catch (error) {
    console.error('Failed to get current Facebook profile:', error);
    return null;
  }
};

// Login with Facebook
export const loginWithFacebook = async (): Promise<boolean> => {
  try {
    // Set loading state
    useAuthStore.getState().setIsLoading(true);
    
    // Perform Facebook Login
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    
    if (result.isCancelled) {
      throw new Error('Login cancelled by user');
    }
    
    // Get access token
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Failed to get access token from Facebook');
    }
    
    // Send access token to backend for verification
    const authResponse = await authService.loginWithFacebook(data.accessToken);
    
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
    // Update error state
    const errorMessage = error.message || 'Facebook login failed';
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

// Logout from Facebook
export const logoutFromFacebook = async (): Promise<void> => {
  try {
    LoginManager.logOut();
  } catch (error) {
    console.error('Failed to logout from Facebook:', error);
  }
};

export default {
  configureFacebookSDK,
  isFacebookLoggedIn,
  getCurrentFacebookProfile,
  loginWithFacebook,
  logoutFromFacebook,
};