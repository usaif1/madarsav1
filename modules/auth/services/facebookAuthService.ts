// modules/auth/services/facebookAuthService.ts
import { LoginManager, AccessToken, Profile, GraphRequest, GraphRequestManager } from 'react-native-fbsdk-next';
import { useAuthStore, User } from '../store/authStore';
import authService, { AuthenticateRequest } from './authService';
import tokenService from './tokenService';
import { useErrorStore } from '@/modules/error/store/errorStore';
import { ErrorType } from '@/api/utils/errorHandling';
import { Settings } from 'react-native-fbsdk-next';
import { mmkvStorage, storage } from '../storage/mmkvStorage';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

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

// Get detailed Facebook user data including email
export const getFacebookUserData = (accessToken: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    console.log('Getting detailed Facebook user data...');
    const request = new GraphRequest(
      '/me',
      {
        accessToken,
        parameters: {
          fields: {
            string: 'id,name,email,picture.type(large),first_name,last_name,location'
          }
        }
      },
      (error, result) => {
        if (error) {
          console.error('Error fetching Facebook user data:', error);
          reject(error);
        } else {
          console.log('Facebook user data received:', JSON.stringify(result));
          resolve(result);
        }
      }
    );
    
    new GraphRequestManager().addRequest(request).start();
  });
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
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email', 'user_location']);
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
    
    // Get device info
    const deviceId = await DeviceInfo.getUniqueId();
    const deviceToken = await DeviceInfo.getInstanceId() || deviceId; // Fallback to device ID if instance ID not available
    
    // Get detailed user data from Graph API
    let fbUserData;
    try {
      fbUserData = await getFacebookUserData(data.accessToken.toString());
      console.log('Detailed FB user data:', JSON.stringify(fbUserData));
    } catch (error) {
      console.warn('Failed to get detailed Facebook user data:', error);
      // Continue with basic profile
    }
    
    // Get user profile as fallback
    const userProfile = await Profile.getCurrentProfile();
    console.log('Basic profile received:', userProfile ? JSON.stringify(userProfile) : 'No profile');
    
    // Get location data from storage if available
    const latitude = parseFloat(storage.getString('user_latitude') || '0');
    const longitude = parseFloat(storage.getString('user_longitude') || '0');
    const city = storage.getString('user_city') || '';
    const country = storage.getString('user_country') || '';
    
    // Prepare user data for authentication, prioritizing Graph API data
    const userData = {
      id: (fbUserData?.id || userProfile?.userID || 'fb_' + Date.now().toString()),
      name: fbUserData?.name || userProfile?.name || 'Facebook User',
      email: fbUserData?.email || '',
      firstName: fbUserData?.first_name || userProfile?.firstName || '',
      lastName: fbUserData?.last_name || userProfile?.lastName || '',
      photoUrl: fbUserData?.picture?.data?.url || userProfile?.imageURL || '',
      // Location data
      city: city || fbUserData?.location?.name?.split(',')[0] || '',
      country: country || fbUserData?.location?.name?.split(',')[1]?.trim() || '',
      latitude: latitude || 0,
      longitude: longitude || 0,
    };
    
    // Prepare data for authenticate endpoint
    const authenticateData: AuthenticateRequest = {
      email: userData.email,
      firstName: userData.firstName || userData.name?.split(' ')[0] || '',
      lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
      profileImage: userData.photoUrl,
      profileId: userData.id,
      userId: data.accessToken.toString(), // Send FB token as userId as requested
      deviceId: deviceId,
      deviceToken: deviceToken,
      deviceType: Platform.OS === 'ios' ? 'IOS' : 'ANDROID',
      loginWith: 'FACEBOOK',
      password: '', // Empty for social logins
      city: userData.city,
      country: userData.country,
      latitude: userData.latitude,
      longitude: userData.longitude,
    };
    
    // Send data to authenticate endpoint with detailed logging
    console.log('🔄 SENDING FB AUTH REQUEST:', JSON.stringify(authenticateData, null, 2));
    
    try {
      const authResponse = await authService.authenticate(authenticateData);
      console.log('✅ RECEIVED FB AUTH RESPONSE:', JSON.stringify(authResponse, null, 2));
      
      // Create user object from response
      const user: User = {
        id: authResponse.userId || userData.id,
        email: authResponse.email || userData.email,
        name: userData.name,
        photoUrl: userData.photoUrl,
      };
      
      // Store login method and token
      storage.set('login_method', 'facebook');
      storage.set('fb_token', data.accessToken.toString());
      
      // Mark user as onboarded in global store
      storage.set('onboarded', 'true');
      
      // Update auth state
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setIsAuthenticated(true);
      useAuthStore.getState().setIsSkippedLogin(false);
      useAuthStore.getState().setError(null);
      
      return true;
    } catch (error: any) {
      console.error('❌ FB AUTH ERROR:', error.response?.data || error.message || error);
      throw error;
    }
    
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