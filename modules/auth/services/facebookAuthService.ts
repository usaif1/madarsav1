// modules/auth/services/facebookAuthService.ts
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import { useAuthStore, User } from '../store/authStore';
import authService from './authService';
import tokenService from './tokenService';
import { useErrorStore } from '@/modules/error/store/errorStore';
import { ErrorType } from '@/api/utils/errorHandling';
import { Settings } from 'react-native-fbsdk-next';
import { mmkvStorage } from '../storage/mmkvStorage';

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

// Simple test function for Facebook login - use this for debugging
export const testFacebookLogin = async (): Promise<any> => {
  console.log('Starting basic Facebook login test...');
  try {
    // Initialize SDK
    Settings.initializeSDK();
    console.log('SDK initialized');
    
    // Basic login with minimal permissions
    console.log('Requesting public_profile permission...');
    const loginResult = await LoginManager.logInWithPermissions(['public_profile']);
    console.log('Login result:', JSON.stringify(loginResult));
    
    if (loginResult.isCancelled) {
      console.log('Login was cancelled by user');
      return { success: false, error: 'Login cancelled' };
    }
    
    // Try to get token
    console.log('Getting access token...');
    const tokenData = await AccessToken.getCurrentAccessToken();
    console.log('Token data:', tokenData ? 'Token received' : 'No token');
    
    return { 
      success: !!tokenData, 
      token: tokenData?.accessToken?.toString(),
      permissions: loginResult.grantedPermissions 
    };
  } catch (error) {
    console.error('Test Facebook login error:', error);
    return { success: false, error: error };
  }
};

// Login with Facebook
export const loginWithFacebook = async (): Promise<boolean> => {
  try {
    // Set loading state
    useAuthStore.getState().setIsLoading(true);
    console.log('Facebook login starting...');
    
    // Initialize SDK
    Settings.initializeSDK();
    
    // Request permissions
    console.log('Requesting permissions...');
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    console.log('Login permissions result:', JSON.stringify(result));
    
    if (result.isCancelled) {
      throw new Error('Login cancelled by user');
    }
    
    // Get access token
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Failed to get access token from Facebook');
    }
    console.log('Access token received:', data.accessToken.toString().substring(0, 10) + '...');
    
    // Get user profile information
    console.log('Fetching user profile...');
    const userProfile = await Profile.getCurrentProfile();
    console.log('User profile received:', userProfile ? JSON.stringify(userProfile) : 'No profile');
    
    // Create a user object from the profile
    if (userProfile) {
      // Create a valid User object that matches your User interface
      const user: User = {
        id: userProfile.userID || 'fb_user', // Ensure id is never undefined
        name: userProfile.name || 'Facebook User',
        email: userProfile.email || '', // Email is not available directly from Profile
        photoUrl: userProfile.imageURL || '',
      };
      
      console.log('Created user object:', JSON.stringify(user));
      
      // Update auth state with the user profile
      useAuthStore.getState().setUser(user);
    } else {
      // If no profile is available, create a minimal user object
      console.warn('No profile information available, creating minimal user');
      const minimalUser: User = {
        id: 'fb_' + Date.now().toString(),
        name: 'Facebook User',
        photoUrl: '',
      };
      useAuthStore.getState().setUser(minimalUser);
    }
    
    // Mark user as onboarded in global store to enable navigation to home
    // This is critical for routing to home screen
    try {
      // Set onboarded flag in storage
      mmkvStorage.setItem('onboarded', 'true');
    } catch (e) {
      console.warn('Failed to set onboarded flag:', e);
    }
    
    // Send access token to backend for verification (commented out for now)
    // console.log('Sending token to backend...');
    // const authResponse = await authService.loginWithFacebook(data.accessToken);
    // console.log('Backend auth response received');
    
    // Store tokens securely (commented out for now)
    // await tokenService.storeTokens({
    //   accessToken: authResponse.accessToken,
    //   refreshToken: authResponse.refreshToken,
    // });
    // console.log('Tokens stored securely');
    
    // Update auth state
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