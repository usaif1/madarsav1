// modules/auth/hooks/useSocialAuth.ts
import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import googleAuthService from '../services/googleAuthService';
import facebookAuthService from '../services/facebookAuthService';
import skipLoginService from '../services/skipLoginService';

export const useSocialAuth = () => {
  const { error, setIsLoading } = useAuthStore();
  const [isLoading, setLocalLoading] = useState(false);
  
  // Initialize social auth SDKs
  useEffect(() => {
    // Configure Google Sign-In only once when the hook is first used
    googleAuthService.configureGoogleSignIn();
    facebookAuthService.configureFacebookSDK();
    
    // Reset loading state on mount
    setIsLoading(false);
    setLocalLoading(false);
  }, []);
  
  // Google Sign-In
  const signInWithGoogle = useCallback(async () => {
    try {
      setLocalLoading(true);
      setIsLoading(true);
      const result = await googleAuthService.signInWithGoogle();
      return result;
    } catch (error) {
      console.error('Google sign-in error:', error);
      return false;
    } finally {
      setLocalLoading(false);
      setIsLoading(false);
    }
  }, []);
  
  // Facebook Login
  const loginWithFacebook = useCallback(async () => {
    console.log('Facebook login usesocialauth');
    try {
      setLocalLoading(true);
      setIsLoading(true);
      const result = await facebookAuthService.loginWithFacebook();
      return result;
    } catch (error) {
      console.error('Facebook login error:', error);
      return false;
    } finally {
      setLocalLoading(false);
      setIsLoading(false);
    }
  }, []);
  
  // Skip Login
  const skipLogin = useCallback(async (deviceToken?: string) => {
    try {
      setLocalLoading(true);
      setIsLoading(true);
      const result = await skipLoginService.skipLogin(deviceToken);
      return result;
    } catch (error) {
      console.error('Skip login error:', error);
      return false;
    } finally {
      setLocalLoading(false);
      setIsLoading(false);
    }
  }, []);
  
  return {
    isLoading,
    error,
    signInWithGoogle,
    loginWithFacebook,
    skipLogin,
  };
};