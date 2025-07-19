declare module 'react-native-config' {
  export interface NativeConfig {
    GOOGLE_WEB_CLIENT_ID: string;
    FACEBOOK_APP_ID: string;
    FACEBOOK_CLIENT_TOKEN: string;
    SUNNAH_HADITH_KEY: string;
  }
  
  export const Config: NativeConfig;
  export default Config;
} 