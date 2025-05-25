// modules/auth/services/facebookAuthService.ts
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import { useAuthStore, User } from '../store/authStore';
import authService, { AuthenticateRequest } from './authService';
import tokenService from './tokenService';
import { useErrorStore } from '@/modules/error/store/errorStore';
import { ErrorType } from '@/api/utils/errorHandling';
import { Settings } from 'react-native-fbsdk-next';
import { mmkvStorage, storage } from '../storage/mmkvStorage';
import { Platform } from 'react-native';

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
    
    // Prepare user data for authentication
    let userData;
    if (userProfile) {
      userData = {
        id: userProfile.userID || 'fb_user',
        name: userProfile.name || 'Facebook User',
        email: userProfile.email || '', 
        photoUrl: userProfile.imageURL || '',
      };
    } else {
      // If no profile is available, create minimal user data
      console.warn('No profile information available, creating minimal user data');
      userData = {
        id: 'fb_' + Date.now().toString(),
        name: 'Facebook User',
        photoUrl: '',
      };
    }
    
    // Prepare data for authenticate endpoint
    const authenticateData: AuthenticateRequest = {
      email: userData.email,
      firstName: userData.name?.split(' ')[0] || '',
      lastName: userData.name?.split(' ').slice(1).join(' ') || '',
      profileImage: userData.photoUrl,
      profileId: userData.id,
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      loginWith: 'FACEBOOK',
      password: '', // Empty for social logins
    };
    
    // Send data to authenticate endpoint
    console.log('Sending authenticate request for Facebook login:', JSON.stringify(authenticateData));
    const authResponse = await authService.authenticate(authenticateData);
    console.log('Received authenticate response:', JSON.stringify(authResponse));
    
    // Create user object from response
    const user: User = {
      id: authResponse.userId,
      email: authResponse.email || userData.email,
      name: userData.name,
      photoUrl: userData.photoUrl,
    };
    
    // Store login method
    storage.set('login_method', 'facebook');
    
    // Mark user as onboarded in global store
    try {
      storage.set('onboarded', 'true');
    } catch (e) {
      console.warn('Failed to set onboarded flag:', e);
    }
    
    // Update auth state
    useAuthStore.getState().setUser(user);
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