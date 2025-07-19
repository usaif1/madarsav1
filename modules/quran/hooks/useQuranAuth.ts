import { useEffect, useState } from 'react';
import { useQuranAuthStore } from '../store/quranAuthStore';

export const useQuranAuth = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const {
    accessToken,
    expiresAt,
    isLoading,
    error,
    refreshToken,
    clearTokens,
    isTokenExpired
  } = useQuranAuthStore();

  // Initialize authentication on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      console.log('🔄 Initializing Quran.Foundation authentication');
      try {
        // Get a valid token if we don't have one or if it's expired
        if (!accessToken) {
          console.log('⚠️ No access token available, initiating token refresh');
          await refreshToken();
        } else if (isTokenExpired()) {
          console.log('⚠️ Token expired, initiating token refresh');
          console.log(`📅 Current time: ${new Date().toISOString()}`);
          console.log(`📅 Token expires at: ${expiresAt ? new Date(expiresAt).toISOString() : 'unknown'}`);
          await refreshToken();
        } else {
          console.log('✅ Valid token already available, skipping refresh');
        }
        setIsInitialized(true);
        console.log('✅ Authentication initialization complete');
      } catch (error) {
        console.error('❌ Failed to initialize Quran.Foundation auth:', error);
        setIsInitialized(true);
        console.log('⚠️ Continuing with initialization despite auth error');
      }
    };

    initializeAuth();
  }, [accessToken, expiresAt, isTokenExpired, refreshToken]);

  // Set up a timer to refresh the token before it expires
  useEffect(() => {
    if (!accessToken || !expiresAt) {
      console.log('⚠️ No token or expiration time available, skipping refresh timer setup');
      return;
    }

    // Calculate time until token needs refresh (5 minutes before expiry)
    const timeUntilRefresh = expiresAt - Date.now() - 5 * 60 * 1000;
    const refreshAt = new Date(Date.now() + timeUntilRefresh).toISOString();
    
    // Calculate remaining time in a readable format
    const remainingMs = expiresAt - Date.now();
    const remainingMinutes = Math.floor(remainingMs / 60000);
    const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
    
    console.log(`📅 Token expires at ${new Date(expiresAt).toISOString()} (in ${remainingMinutes}m ${remainingSeconds}s)`);
    console.log(`⏰ Setting up refresh timer to trigger in ${Math.floor(timeUntilRefresh/60000)}m ${Math.floor((timeUntilRefresh%60000)/1000)}s (at ${refreshAt})`);
    
    // Don't set a timer if the token is already expired or about to expire
    if (timeUntilRefresh <= 0) {
      console.log('⚠️ Token is already expired or about to expire, refreshing immediately');
      refreshToken();
      return;
    }

    // Set a timer to refresh the token
    const refreshTimer = setTimeout(() => {
      console.log('⏰ Token refresh timer triggered, refreshing token');
      refreshToken();
    }, timeUntilRefresh);

    // Clean up the timer on unmount
    return () => {
      console.log('🧹 Cleaning up token refresh timer');
      clearTimeout(refreshTimer);
    };
  }, [accessToken, expiresAt, refreshToken]);

  const isAuthenticated = !!accessToken && !isTokenExpired();
  
  // Log authentication status changes
  useEffect(() => {
    console.log(`🔐 Authentication status: ${isAuthenticated ? 'Authenticated' : 'Not authenticated'}`);
    if (error) {
      console.error('❌ Authentication error:', error);
    }
  }, [isAuthenticated, error]);

  return {
    accessToken,
    isAuthenticated,
    isInitialized,
    isLoading,
    error,
    refreshToken,
    clearTokens,
  };
};

export default useQuranAuth;