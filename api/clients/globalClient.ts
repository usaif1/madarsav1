import axios from 'axios';
import Config from 'react-native-config';
import { API_URLS } from '../config/apiConfig';

// Debug: Log all available config keys to see what's loaded
console.log('🔍 Available Config keys:', Object.keys(Config));
console.log('🔍 Full Config object:', Config);
console.log('🔍 SUNNAH_HADITH_KEY value:', Config.SUNNAH_HADITH_KEY);

// Type assertion for TypeScript
interface AppConfig {
  SUNNAH_HADITH_KEY?: string;
  GOOGLE_KEY?: string;
  [key: string]: string | undefined;
}

const appConfig = Config as AppConfig;

// Create a map of base URLs to Axios instances
const apiClients = {
  ISLAMIC_DEVELOPERS: axios.create({
    baseURL: API_URLS.ISLAMIC_DEVELOPERS,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  
  ALADHAN: axios.create({
    baseURL: API_URLS.ALADHAN,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  
  SUNNAH: axios.create({
    baseURL: API_URLS.SUNNAH,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  
  QURAN: axios.create({
    baseURL: API_URLS.QURAN,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  }),
};

// Add request/response interceptors if needed
// Add API key to all requests to Sunnah.com API from environment variable
apiClients.SUNNAH.interceptors.request.use(
  (config) => {
    // Get API key from environment variables with multiple fallback attempts
    const sunnahApiKey = 
      appConfig.SUNNAH_HADITH_KEY || 
      appConfig['SUNNAH_HADITH_KEY'] ||
      process.env.SUNNAH_HADITH_KEY;

    const googleKey = 
      appConfig.GOOGLE_WEB_CLIENT_ID
    
    console.log('🔑 Attempting to use Sunnah API key:', sunnahApiKey ? `${sunnahApiKey} ✅ Found` : '❌ Not found');
    console.log('🔑 Attempting to use Google API key:', googleKey ? `${googleKey} ✅ Found` : '❌ Not found');
    
    // Validate that the API key exists
    if (!sunnahApiKey) {
      console.error('❌ SUNNAH_HADITH_KEY is not configured in environment variables');
      console.error('🔍 Available keys:', Object.keys(appConfig));
      
      // Temporary fallback for development (remove in production)
      const fallbackKey = '9iHLJib7vC2bF6lbU8op97hJJfkOu4tz9lVlhUmw';
      console.warn('⚠️ Using fallback API key for development');
      config.headers['X-API-Key'] = fallbackKey;
      return config;
      
      // Uncomment this to throw error instead of using fallback:
      // throw new Error('Sunnah API key is not configured');
    }
    
    config.headers['X-API-Key'] = sunnahApiKey;
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for better error handling
apiClients.SUNNAH.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Sunnah API: Unauthorized - Check your API key');
    } else if (error.response?.status === 403) {
      console.error('Sunnah API: Forbidden - API key may be invalid or expired');
    }
    return Promise.reject(error);
  }
);

// Named exports for specific clients
export const aladhanClient = apiClients.ALADHAN;
export const sunnahClient = apiClients.SUNNAH;
export const quranClient = apiClients.QURAN;
export const islamicDevelopersClient = apiClients.ISLAMIC_DEVELOPERS;

export default apiClients;