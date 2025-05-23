// modules/auth/services/facebookAuthService.ts
import { LoginManager, AccessToken, Profile } from 'react-native-fbsdk-next';
import { useAuthStore } from '../store/authStore';
import authService from './authService';
import tokenService from './tokenService';
import { useErrorStore } from '@/modules/error/store/errorStore';
import { ErrorType } from '@/api/utils/errorHandling';
import { Settings } from 'react-native-fbsdk-next';

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
    
    // First run the test function to see if basic login works
    // const testResult = await testFacebookLogin();
    // console.log('Test login result:', testResult);
    
    // if (!testResult.success) {
    //   throw new Error(`Basic Facebook login failed: ${JSON.stringify(testResult.error)}`);
    // }
    
    // If test succeeded, try the full login flow
    console.log('Requesting email permission...');
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
    console.log('Full login result:', JSON.stringify(result));
    
    if (result.isCancelled) {
      throw new Error('Login cancelled by user');
    }
    
    // Get access token
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw new Error('Failed to get access token from Facebook');
    }
    console.log('Access token received:', data.accessToken.toString().substring(0, 10) + '...');
    
    // Send access token to backend for verification
    // console.log('Sending token to backend...');
    // const authResponse = await authService.loginWithFacebook(data.accessToken);
    // console.log('Backend auth response received');
    
    // Store tokens securely
    // await tokenService.storeTokens({
    //   accessToken: authResponse.accessToken,
    //   refreshToken: authResponse.refreshToken,
    // });
    // console.log('Tokens stored securely');
    
    // Update auth state
    // useAuthStore.getState().setUser(authResponse.user);
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