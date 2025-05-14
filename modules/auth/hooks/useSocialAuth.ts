// modules/auth/hooks/useSocialAuth.ts
import { useCallback, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import googleAuthService from '../services/googleAuthService';
import facebookAuthService from '../services/facebookAuthService';
import skipLoginService from '../services/skipLoginService';

export const useSocialAuth = () => {
  const { isLoading, error } = useAuthStore();
  
  // Initialize social auth SDKs
  useEffect(() => {
    googleAuthService.configureGoogleSignIn();
    facebookAuthService.configureFacebookSDK();
  }, []);
  
  // Google Sign-In
  const signInWithGoogle = useCallback(async () => {
    return await googleAuthService.signInWithGoogle();
  }, []);
  
  // Facebook Login
  const loginWithFacebook = useCallback(async () => {
    return await facebookAuthService.loginWithFacebook();
  }, []);
  
  // Skip Login
  const skipLogin = useCallback(async (deviceToken?: string) => {
    return await skipLoginService.skipLogin(deviceToken);
  }, []);
  
  return {
    isLoading,
    error,
    signInWithGoogle,
    loginWithFacebook,
    skipLogin,
  };
};