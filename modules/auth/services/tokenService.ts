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
      await Keychain.setGenericPassword(
        'auth_tokens',
        JSON.stringify(tokens),
        { service: 'auth' }
      );
      return true;
    } catch (error) {
      console.error('Failed to store tokens:', error);
      return false;
    }
  },
  
  // Get tokens from Keychain
  getTokens: async (): Promise<Tokens | null> => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: 'auth' });
      if (credentials) {
        return JSON.parse(credentials.password);
      }
      return null;
    } catch (error) {
      console.error('Failed to get tokens:', error);
      return null;
    }
  },
  
  // Get access token only
  getAccessToken: async (): Promise<string | null> => {
    const tokens = await tokenService.getTokens();
    return tokens?.accessToken || null;
  },
  
  // Get refresh token only
  getRefreshToken: async (): Promise<string | null> => {
    const tokens = await tokenService.getTokens();
    return tokens?.refreshToken || null;
  },
  
  // Clear tokens (logout)
  clearTokens: async (): Promise<boolean> => {
    try {
      await Keychain.resetGenericPassword({ service: 'auth' });
      return true;
    } catch (error) {
      console.error('Failed to clear tokens:', error);
      return false;
    }
  },
  
  // Update only the access token
  updateAccessToken: async (accessToken: string): Promise<boolean> => {
    try {
      const tokens = await tokenService.getTokens();
      if (!tokens) return false;
      
      return await tokenService.storeTokens({
        ...tokens,
        accessToken,
      });
    } catch (error) {
      console.error('Failed to update access token:', error);
      return false;
    }
  },
};

export default tokenService;