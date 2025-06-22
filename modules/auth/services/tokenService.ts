// modules/auth/services/tokenService.ts
import * as Keychain from 'react-native-keychain';

// Token types
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

// Service for securely storing and retrieving tokens
const tokenService = {
  // Store tokens securely in Keychain
  storeTokens: async (tokens: Tokens): Promise<boolean> => {
    try {
      console.log(' Storing tokens:', {
        accessToken: tokens.accessToken ? `${tokens.accessToken.substring(0, 10)}...` : 'null',
        refreshToken: tokens.refreshToken ? `${tokens.refreshToken.substring(0, 10)}...` : 'null',
        hasRefreshToken: !!tokens.refreshToken
      });
      
      await Keychain.setGenericPassword(
        'auth_tokens',
        JSON.stringify(tokens),
        { service: 'auth' }
      );
      return true;
    } catch (error) {
      console.error(' Failed to store tokens:', error);
      return false;
    }
  },
  
  // Get tokens from Keychain
  getTokens: async (): Promise<Tokens | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: 'auth' });
      if (credentials) {
        const tokens = JSON.parse(credentials.password) as Tokens;
        console.log(' Retrieved tokens:', {
          hasAccessToken: !!tokens.accessToken,
          hasRefreshToken: !!tokens.refreshToken,
          accessTokenPreview: tokens.accessToken ? `${tokens.accessToken}` : 'null',
          refreshTokenPreview: tokens.refreshToken ? `${tokens.refreshToken}` : 'null'
        });
        return tokens;
      }
      console.log(' No tokens found in keychain');
      return null;
    } catch (error) {
      console.error(' Failed to get tokens:', error);
      return null;
    }
  },
  
  // Get access token only
  getAccessToken: async (): Promise<string | null> => {
    const tokens = await tokenService.getTokens();
    if (!tokens?.accessToken) {
      console.log(' No access token available');
      return null;
    }
    return tokens.accessToken;
  },
  
  // Get refresh token only
  getRefreshToken: async (): Promise<string | null> => {
    const tokens = await tokenService.getTokens();
    if (!tokens?.refreshToken) {
      console.log(' No refresh token available');
      return null;
    }
    return tokens.refreshToken;
  },
  
  // Clear tokens (logout)
  clearTokens: async (): Promise<boolean> => {
    try {
      console.log(' Clearing all tokens');
      await Keychain.resetGenericPassword({ service: 'auth' });
      return true;
    } catch (error) {
      console.error(' Failed to clear tokens:', error);
      return false;
    }
  },
  
  // Update only the access token
  updateAccessToken: async (accessToken: string): Promise<boolean> => {
    try {
      console.log(' Updating access token only');
      const tokens = await tokenService.getTokens();
      if (!tokens) {
        console.error(' No existing tokens found to update');
        return false;
      }
      
      return await tokenService.storeTokens({
        ...tokens,
        accessToken,
      });
    } catch (error) {
      console.error(' Failed to update access token:', error);
      return false;
    }
  },
  
  // Update only the refresh token
  updateRefreshToken: async (refreshToken: string): Promise<boolean> => {
    try {
      console.log(' Updating refresh token only');
      const tokens = await tokenService.getTokens();
      if (!tokens) {
        console.error(' No existing tokens found to update');
        return false;
      }
      
      return await tokenService.storeTokens({
        ...tokens,
        refreshToken,
      });
    } catch (error) {
      console.error(' Failed to update refresh token:', error);
      return false;
    }
  },
  
  // Update both tokens
  updateBothTokens: async (accessToken: string, refreshToken: string): Promise<boolean> => {
    try {
      console.log(' Updating both access and refresh tokens');
      return await tokenService.storeTokens({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      console.error(' Failed to update both tokens:', error);
      return false;
    }
  },
};

export default tokenService;